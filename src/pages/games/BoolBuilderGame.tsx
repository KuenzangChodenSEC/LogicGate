import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getBoolBuilderConfig } from '@/lib/gameLevels';
import { GateType, evaluateGate } from '@/lib/gateData';
import GateSVG from '@/components/GateSVG';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { playGameSound } from '@/lib/gameAudio';

type Screen = 'levels' | 'playing' | 'results';

const OPERAND_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const NODE_W = 84;
const NODE_H = 84;
const CANVAS_WIDTH = 900;

interface BoolChallenge {
  targetExpr: string;
  targetFn: (inputs: number[]) => number;
  inputValues: number[];
  targetOutput: number;
  numOperands: number;
  numOperators: number;
  availableGates: GateType[];
}

function genChallenge(cfg: ReturnType<typeof getBoolBuilderConfig>): BoolChallenge {
  const inputs = Array.from({ length: cfg.operands }, () => Math.random() > 0.5 ? 1 : 0);
  const availableGates = cfg.operators === 1 ? cfg.gates : cfg.gates.filter(g => g !== 'NOT');
  const targetGates = Array.from({ length: cfg.operators }, () =>
    availableGates[Math.floor(Math.random() * availableGates.length)]
  );
  const targetExpr = targetGates.length === 1 && targetGates[0] === 'NOT'
    ? 'NOT A'
    : targetGates.reduce(
      (expr, gate, index) => `(${expr} ${gate} ${OPERAND_NAMES[index + 1]})`,
      'A',
    );
  const targetFn = (values: number[]) => {
    if (targetGates.length === 1 && targetGates[0] === 'NOT') {
      return evaluateGate('NOT', values[0]);
    }
    return targetGates.reduce(
      (result, gate, index) => evaluateGate(gate, result, values[index + 1]),
      values[0],
    );
  };

  return {
    targetExpr,
    targetFn,
    inputValues: inputs,
    targetOutput: targetFn(inputs),
    numOperands: cfg.operands,
    numOperators: cfg.operators,
    availableGates,
  };
}

type CircuitNodeType = GateType | 'INPUT' | 'OUTPUT';

interface CircuitNode {
  id: string;
  type: CircuitNodeType;
  x: number;
  y: number;
  inputIndex?: number;
  value?: number;
  inputIds: string[];
}

function getCanvasHeight(numOperands: number) {
  return Math.max(360, 44 + numOperands * 68);
}

function createInitialNodes(challenge: BoolChallenge): CircuitNode[] {
  const inputs = challenge.inputValues.map((value, index) => ({
    id: `input-${index}`,
    type: 'INPUT' as const,
    x: 20,
    y: 20 + index * 68,
    inputIndex: index,
    value,
    inputIds: [],
  }));
  const output: CircuitNode = {
    id: 'output',
    type: 'OUTPUT',
    x: CANVAS_WIDTH - NODE_W - 20,
    y: (getCanvasHeight(challenge.numOperands) - NODE_H) / 2,
    inputIds: [],
  };
  return [...inputs, output];
}

function getNodeValues(nodes: CircuitNode[], inputValues?: number[]) {
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const values = new Map<string, number | undefined>();

  function getValue(id: string): number | undefined {
    if (values.has(id)) return values.get(id);
    const node = nodeById.get(id);
    if (!node) return undefined;
    values.set(id, undefined);

    if (node.type === 'INPUT') {
      const value = inputValues?.[node.inputIndex ?? 0] ?? node.value;
      values.set(id, value);
      return value;
    }

    const inputs = node.inputIds.map(getValue);
    if (inputs.some(value => value === undefined)) return undefined;
    if (node.type === 'OUTPUT') {
      const value = inputs[0];
      values.set(id, value);
      return value;
    }

    const requiredInputs = node.type === 'NOT' ? 1 : 2;
    if (inputs.length !== requiredInputs) return undefined;
    const firstInput = inputs[0];
    if (firstInput === undefined) return undefined;
    const value = evaluateGate(node.type, firstInput, inputs[1]);
    values.set(id, value);
    return value;
  }

  nodes.forEach(node => getValue(node.id));
  return values;
}

function getNodesConnectedToOutput(nodes: CircuitNode[], outputId: string) {
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const connected = new Set<string>();

  function visit(id: string) {
    if (connected.has(id)) return;
    connected.add(id);
    nodeById.get(id)?.inputIds.forEach(visit);
  }

  visit(outputId);
  return connected;
}

export default function BoolBuilderGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [challenge, setChallenge] = useState<BoolChallenge | null>(null);
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const progress = user ? getGameProgress(user, 'boolBuilder') : [];
  const valueMap = getNodeValues(nodes);

  function startLevel(idx: number) {
    const cfg = getBoolBuilderConfig(idx + 1);
    const ch = genChallenge(cfg);
    setChallenge(ch);
    setLevelIdx(idx);
    setNodes(createInitialNodes(ch));
    setConnecting(null);
    setDragging(null);
    setAttempts(0);
    setFeedback(null);
    setScore(0);
    setScreen('playing');
  }

  function addGate(gate: GateType) {
    if (!challenge) return;
    const gateCount = nodes.filter(node => node.type !== 'INPUT' && node.type !== 'OUTPUT').length;
    if (gateCount >= challenge.numOperators) return;
    const id = `gate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setNodes(prev => {
      const currentGateCount = prev.filter(node => node.type !== 'INPUT' && node.type !== 'OUTPUT').length;
      return [...prev, {
        id,
        type: gate,
        x: 230 + (currentGateCount % 3) * 130,
        y: 24 + Math.floor(currentGateCount / 3) * 112,
        inputIds: [],
      }];
    });
    setFeedback(null);
  }

  function startDrag(event: React.MouseEvent, id: string) {
    event.preventDefault();
    event.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    const node = nodes.find(item => item.id === id);
    if (!rect || !node) return;
    dragOffset.current = {
      x: event.clientX - rect.left - node.x,
      y: event.clientY - rect.top - node.y,
    };
    setDragging(id);
  }

  const moveNode = useCallback((event: React.MouseEvent) => {
    if (!dragging || !challenge) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const maxY = getCanvasHeight(challenge.numOperands) - NODE_H;
    setNodes(prev => prev.map(node => node.id === dragging ? {
      ...node,
      x: Math.max(0, Math.min(CANVAS_WIDTH - NODE_W, event.clientX - rect.left - dragOffset.current.x)),
      y: Math.max(0, Math.min(maxY, event.clientY - rect.top - dragOffset.current.y)),
    } : node));
  }, [challenge, dragging]);

  useEffect(() => {
    const stopDragging = () => setDragging(null);
    window.addEventListener('mouseup', stopDragging);
    return () => window.removeEventListener('mouseup', stopDragging);
  }, []);

  function dependsOn(startId: string, targetId: string, visited = new Set<string>()): boolean {
    if (startId === targetId) return true;
    if (visited.has(startId)) return false;
    visited.add(startId);
    const node = nodes.find(item => item.id === startId);
    return node?.inputIds.some(id => dependsOn(id, targetId, visited)) ?? false;
  }

  function connectNode(targetId: string) {
    if (!connecting) return;
    if (connecting === targetId) {
      setConnecting(null);
      return;
    }
    const source = nodes.find(node => node.id === connecting);
    const target = nodes.find(node => node.id === targetId);
    if (!source || !target) return;
    if (source.type === 'OUTPUT' || target.type === 'INPUT') {
      setFeedback('Connect from an input or gate to a gate or the output.');
      setConnecting(null);
      return;
    }
    if (target.inputIds.includes(source.id)) {
      setFeedback('Those components are already connected.');
      setConnecting(null);
      return;
    }
    const maxInputs = target.type === 'NOT' || target.type === 'OUTPUT' ? 1 : 2;
    if (target.inputIds.length >= maxInputs) {
      setFeedback(`${target.type} accepts at most ${maxInputs} input${maxInputs === 1 ? '' : 's'}.`);
      setConnecting(null);
      return;
    }
    if (dependsOn(source.id, target.id)) {
      setFeedback('That connection would create a circuit loop.');
      setConnecting(null);
      return;
    }
    setNodes(prev => prev.map(node => node.id === targetId
      ? { ...node, inputIds: [...node.inputIds, source.id] }
      : node
    ));
    setConnecting(null);
    setFeedback(null);
  }

  function toggleConnection(node: CircuitNode) {
    if (connecting) {
      connectNode(node.id);
      return;
    }
    if (node.type === 'OUTPUT') {
      setFeedback('Select an input or gate as the connection source.');
      return;
    }
    setConnecting(node.id);
    setFeedback(null);
  }

  function removeGate(id: string) {
    setNodes(prev => prev
      .filter(node => node.id !== id || node.type === 'INPUT' || node.type === 'OUTPUT')
      .map(node => ({ ...node, inputIds: node.inputIds.filter(inputId => inputId !== id) }))
    );
    if (connecting === id) setConnecting(null);
    setFeedback(null);
  }

  function checkAnswer() {
    if (!challenge) return;
    const gateNodes = nodes.filter(node => node.type !== 'INPUT' && node.type !== 'OUTPUT');
    if (gateNodes.length !== challenge.numOperators) {
      setFeedback(`Add ${challenge.numOperators} gate${challenge.numOperators === 1 ? '' : 's'} to match the expression.`);
      return;
    }
    const output = nodes.find(node => node.type === 'OUTPUT');
    if (!output || output.inputIds.length === 0) {
      setFeedback('Connect the completed circuit to the output.');
      return;
    }
    const connected = getNodesConnectedToOutput(nodes, output.id);
    if (gateNodes.some(node => !connected.has(node.id))) {
      setFeedback('Connect every gate to the output before checking.');
      return;
    }
    const currentOutput = getNodeValues(nodes, challenge.inputValues).get(output.id);
    if (currentOutput === undefined) {
      setFeedback('Complete every gate connection before checking the circuit.');
      return;
    }

    const truthTableMatches = Array.from({ length: 2 ** challenge.numOperands }, (_, row) => {
      const inputs = Array.from({ length: challenge.numOperands }, (_, index) =>
        (row >> (challenge.numOperands - index - 1)) & 1
      );
      return getNodeValues(nodes, inputs).get(output.id) === challenge.targetFn(inputs);
    }).every(Boolean);

    const att = attempts + 1;
    setAttempts(att);
    if (truthTableMatches) {
      playGameSound('correct');
      const s = att === 1 ? 3 : att === 2 ? 2 : 1;
      const sc = Math.max(0, (4 - att) * 120);
      setStars(s);
      setScore(sc);
      setFeedback(`✓ Correct! Your circuit matches the expression for every input combination.`);
      finishLevel(sc, s);
    } else {
      playGameSound('wrong');
      setFeedback(`✗ The circuit does not match the expression for every input combination. Try again! (Attempt ${att})`);
    }
  }

  function finishLevel(sc: number, s: number) {
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (s === 3 ? 10 : 0);
    const prev = progress[levelIdx];
    const newData = { completed: true, bestScore: Math.max(sc, prev?.bestScore ?? 0), stars: Math.max(s, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'boolBuilder', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Bool Builder Level ${levelIdx + 1}`);
    setTimeout(() => setScreen('results'), 1200);
  }

  if (screen === 'levels') return <LevelSelect gameTitle="BOOLEAN BUILDER" progress={progress} user={user!} gameId="boolBuilder" onSelect={startLevel} />;

  if (!user) return null;

  if (screen === 'results') {
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  if (!challenge) return null;
  const gateNodes = nodes.filter(node => node.type !== 'INPUT' && node.type !== 'OUTPUT');
  const canvasHeight = getCanvasHeight(challenge.numOperands);
  const connectingNode = nodes.find(node => node.id === connecting);

  return (
    <div className="bool-builder-game p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="font-medium text-foreground">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
          <span className="text-muted-foreground text-xs">Attempt {attempts + 1}</span>
        </div>
      </div>

      {/* Challenge display */}
      <div className="pixel-card p-5 mb-4">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-3">
          Build a circuit that matches this Boolean expression:
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <code className="text-primary font-mono font-semibold break-words">{challenge.targetExpr}</code>
            <p className="text-foreground text-sm mt-2">
              Inputs: {challenge.inputValues.map((value, index) => `${OPERAND_NAMES[index]}=${value}`).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Target output Y =</span>
            <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${challenge.targetOutput === 1 ? 'border-accent bg-accent/20 text-accent' : 'border-border bg-muted text-foreground'}`}>
              {challenge.targetOutput}
            </div>
          </div>
        </div>
      </div>

      {/* Gate palette */}
      <div className="pixel-card p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">Add gates to your circuit</p>
          <span className="text-xs font-medium text-foreground">{gateNodes.length}/{challenge.numOperators} gates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {challenge.availableGates.map(gate => (
            <button key={gate} onClick={() => addGate(gate)} disabled={gateNodes.length >= challenge.numOperators}
              className="bool-builder-gate-button flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-xs font-semibold hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
              <GateSVG gate={gate} size={34} active />
              {gate}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Drag components to arrange them. Click a component’s arrow, then click the component it should connect to.
        </p>
        {connectingNode && (
          <p className="text-xs text-primary font-medium mt-2">
            Connecting from {connectingNode.type === 'INPUT' ? OPERAND_NAMES[connectingNode.inputIndex ?? 0] : connectingNode.type} — choose a gate or OUTPUT.
          </p>
        )}
      </div>

      {/* Circuit canvas */}
      <div className="pixel-card p-3 mb-4 overflow-auto">
        <div
          ref={canvasRef}
          className="bool-builder-canvas relative select-none bg-white"
          style={{
            width: CANVAS_WIDTH,
            minWidth: CANVAS_WIDTH,
            height: canvasHeight,
            backgroundImage: 'radial-gradient(hsl(var(--border)/0.55) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            cursor: dragging ? 'grabbing' : 'default',
          }}
          onMouseMove={moveNode}
          onMouseUp={() => setDragging(null)}
        >
          <svg className="bool-builder-wires absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {nodes.map(target => target.inputIds.map(sourceId => {
              const source = nodes.find(node => node.id === sourceId);
              if (!source) return null;
              const x1 = source.x + NODE_W;
              const y1 = source.y + NODE_H / 2;
              const x2 = target.x;
              const y2 = target.y + NODE_H / 2;
              const curve = (x1 + x2) / 2;
              const wireActive = valueMap.get(source.id) === 1;
              return (
                <path key={`${source.id}-${target.id}`}
                  d={`M${x1},${y1} C${curve},${y1} ${curve},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={wireActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={wireActive ? 3 : 2}
                />
              );
            }))}
          </svg>

          {nodes.map(node => {
            const value = valueMap.get(node.id);
            const active = value === 1;
            const isConnecting = connecting === node.id;
            const nodeLabel = node.type === 'INPUT'
              ? `INPUT ${OPERAND_NAMES[node.inputIndex ?? 0]}`
              : node.type;
            return (
              <div key={node.id}
                className={`bool-builder-node bool-node-${node.type.toLowerCase()} absolute rounded-xl border-2 bg-white shadow-sm select-none transition-all duration-150 ease-out ${
                  isConnecting ? 'border-primary shadow-primary/20 shadow-md' :
                  active ? 'border-primary/60' : 'border-border'
                } ${dragging === node.id ? 'is-dragging' : ''}`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: NODE_W,
                  height: NODE_H,
                  zIndex: dragging === node.id ? 10 : 2,
                  cursor: dragging === node.id ? 'grabbing' : 'grab',
                }}
                onMouseDown={event => startDrag(event, node.id)}
              >
                <div className="flex flex-col items-center justify-center h-full gap-1 px-1 pt-1">
                  {node.type === 'INPUT' ? (
                    <>
                      <div className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center font-bold text-lg ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border'}`}>
                        {node.value}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-none">INPUT {OPERAND_NAMES[node.inputIndex ?? 0]}</p>
                    </>
                  ) : node.type === 'OUTPUT' ? (
                    <>
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-base ${active ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}`}>
                        {value ?? '?'}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium leading-none">OUTPUT</p>
                    </>
                  ) : (
                    <>
                      <GateSVG gate={node.type} size={45} active={active} />
                      <p className="text-[10px] text-muted-foreground font-medium leading-none">{node.type}</p>
                    </>
                  )}
                </div>
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1" style={{ zIndex: 3 }}>
                  <button
                    title={connecting ? `Connect to ${nodeLabel}` : `Start connection from ${nodeLabel}`}
                    aria-label={connecting ? `Connect to ${nodeLabel}` : `Start connection from ${nodeLabel}`}
                    className={`bool-builder-connector text-[10px] w-6 h-5 flex items-center justify-center rounded font-bold transition-all ${isConnecting ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground hover:bg-primary/80'}`}
                    onMouseDown={event => event.stopPropagation()}
                    onClick={event => { event.stopPropagation(); toggleConnection(node); }}
                  >→</button>
                  {node.type !== 'INPUT' && node.type !== 'OUTPUT' && (
                    <button
                      title="Remove gate"
                      aria-label={`Remove ${node.type} gate`}
                      className="text-[10px] w-6 h-5 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-bold"
                      onMouseDown={event => event.stopPropagation()}
                      onClick={event => { event.stopPropagation(); removeGate(node.id); }}
                    >×</button>
                  )}
                </div>
              </div>
            );
          })}
          {gateNodes.length === 0 && (
            <div className="absolute pointer-events-none text-center text-muted-foreground text-sm"
              style={{ left: 260, top: Math.max(12, canvasHeight / 2 - 12) }}>
              Add a gate from the palette to start building.
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${feedback.startsWith('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {feedback}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={checkAnswer}
          className="pixel-btn-primary px-8 py-2.5 text-sm disabled:opacity-50">
          Check Circuit
        </button>
        <button onClick={() => startLevel(levelIdx)}
          className="pixel-btn px-4 py-2.5 text-sm flex items-center gap-1">
          <RotateCcw size={13} /> New Puzzle
        </button>
      </div>
    </div>
  );
}
