import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getBoolBuilderConfig } from '@/lib/gameLevels';
import { GateType, evaluateGate } from '@/lib/gateData';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import { ArrowLeft, RotateCcw } from 'lucide-react';

type Screen = 'levels' | 'playing' | 'results';

const OPERAND_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ALL_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];
const EASY_GATES: GateType[] = ['AND', 'OR', 'NOT'];

interface BoolChallenge {
  targetExpr: string;
  targetFn: (inputs: number[]) => number;
  inputValues: number[];
  targetOutput: number;
  numOperands: number;
  availableGates: GateType[];
}

function genChallenge(cfg: ReturnType<typeof getBoolBuilderConfig>): BoolChallenge {
  const ops = cfg.operands;
  const inputs = Array.from({ length: ops }, () => Math.random() > 0.5 ? 1 : 0);
  // Build a random expression string and function
  const gatePool = cfg.gates;
  const g1 = gatePool[Math.floor(Math.random() * gatePool.length)];
  const isSingle1 = ['NOT', 'BUFFER'].includes(g1);

  let expr: string;
  let out: number;

  if (cfg.operators === 1) {
    // simple 1-gate
    if (isSingle1) {
      expr = `NOT A`;
      out = evaluateGate(g1, inputs[0]);
    } else {
      expr = `A ${g1} B`;
      out = evaluateGate(g1, inputs[0], inputs[1]);
    }
  } else if (cfg.operators === 2) {
    const g2 = gatePool[Math.floor(Math.random() * gatePool.length)];
    const mid = evaluateGate(g1, inputs[0], inputs[1] ?? inputs[0]);
    out = evaluateGate(g2, mid, inputs[2] ?? inputs[0]);
    expr = ops >= 3 ? `(A ${g1} B) ${g2} C` : `(A ${g1} B) ${g2} A`;
  } else {
    const g2 = gatePool[Math.floor(Math.random() * gatePool.length)];
    const g3 = gatePool[Math.floor(Math.random() * gatePool.length)];
    const r1 = evaluateGate(g1, inputs[0], inputs[1] ?? inputs[0]);
    const r2 = evaluateGate(g2, inputs[2] ?? inputs[1] ?? inputs[0], inputs[3] ?? inputs[0]);
    out = evaluateGate(g3, r1, r2);
    expr = ops >= 4
      ? `(A ${g1} B) ${g3} (C ${g2} D)`
      : `(A ${g1} B) ${g3} (B ${g2} A)`;
  }

  return {
    targetExpr: expr,
    targetFn: () => out,
    inputValues: inputs,
    targetOutput: out,
    numOperands: ops,
    availableGates: gatePool,
  };
}

type SlotType = GateType | string; // operator slot value

export default function BoolBuilderGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [challenge, setChallenge] = useState<BoolChallenge | null>(null);
  const [selectedGates, setSelectedGates] = useState<(GateType | null)[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  const progress = user ? getGameProgress(user, 'boolBuilder') : [];

  function startLevel(idx: number) {
    const cfg = getBoolBuilderConfig(idx + 1);
    const ch = genChallenge(cfg);
    setChallenge(ch);
    setLevelIdx(idx);
    setSelectedGates(Array(cfg.operators).fill(null));
    setAttempts(0);
    setFeedback(null);
    setScore(0);
    setScreen('playing');
  }

  function selectGate(slotIdx: number, gate: GateType) {
    setSelectedGates(prev => {
      const next = [...prev];
      next[slotIdx] = gate;
      return next;
    });
    setFeedback(null);
  }

  function checkAnswer() {
    if (!challenge) return;
    if (selectedGates.some(g => g === null)) {
      setFeedback('Please fill in all gate slots before checking!');
      return;
    }
    // Re-evaluate with selected gates
    const ops = selectedGates as GateType[];
    const inp = challenge.inputValues;
    let computed: number;
    if (ops.length === 1) {
      const isSingle = ['NOT', 'BUFFER'].includes(ops[0]);
      computed = isSingle ? evaluateGate(ops[0], inp[0]) : evaluateGate(ops[0], inp[0], inp[1] ?? inp[0]);
    } else if (ops.length === 2) {
      const r1 = evaluateGate(ops[0], inp[0], inp[1] ?? inp[0]);
      computed = evaluateGate(ops[1], r1, inp[2] ?? inp[0]);
    } else {
      const r1 = evaluateGate(ops[0], inp[0], inp[1] ?? inp[0]);
      const r2 = evaluateGate(ops[1], inp[2] ?? inp[1] ?? inp[0], inp[3] ?? inp[0]);
      computed = evaluateGate(ops[2], r1, r2);
    }

    const att = attempts + 1;
    setAttempts(att);
    if (computed === challenge.targetOutput) {
      const s = att === 1 ? 3 : att === 2 ? 2 : 1;
      const sc = (4 - att) * 120;
      setStars(s);
      setScore(sc);
      setFeedback(`✓ Correct! Output = ${challenge.targetOutput} matches in ${att} attempt${att > 1 ? 's' : ''}!`);
      finishLevel(sc, s);
    } else {
      setFeedback(`✗ Output was ${computed}, expected ${challenge.targetOutput}. Try different gates! (Attempt ${att})`);
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

  if (screen === 'levels') return <LevelSelect gameTitle="BOOLEAN BUILDER" progress={progress} user={user!} onSelect={startLevel} />;

  if (!user) return null;

  if (screen === 'results') {
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  if (!challenge) return null;
  const cfg = getBoolBuilderConfig(levelIdx + 1);

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
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
      <div className="pixel-card p-5 mb-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-3">
          Build an expression that gives this output:
        </p>
        <div className="bg-muted rounded-lg border border-border p-4 mb-3">
          <p className="text-muted-foreground text-xs mb-1">
            Expression pattern: <code className="text-primary font-mono">{challenge.targetExpr}</code>
          </p>
          <p className="text-foreground text-sm">
            Inputs: {challenge.inputValues.slice(0, challenge.numOperands).map((v, i) => `${OPERAND_NAMES[i]}=${v}`).join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Target Output Y =</span>
          <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${challenge.targetOutput === 1 ? 'border-accent bg-accent/20 text-accent' : 'border-border bg-muted text-foreground'}`}>
            {challenge.targetOutput}
          </div>
        </div>
      </div>

      {/* Slot filling */}
      <div className="pixel-card p-5 mb-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-4">
          Select gates for each operator slot:
        </p>
        {Array.from({ length: cfg.operators }).map((_, slotIdx) => (
          <div key={slotIdx} className="mb-5">
            <p className="text-foreground text-sm font-medium mb-2">
              Gate #{slotIdx + 1}:
              {selectedGates[slotIdx] && (
                <span className="ml-2 text-primary font-bold">{selectedGates[slotIdx]}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {cfg.gates.map(g => (
                <button key={g} onClick={() => selectGate(slotIdx, g)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${selectedGates[slotIdx] === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-primary'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${feedback.startsWith('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {feedback}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={checkAnswer} disabled={selectedGates.some(g => g === null)}
          className="pixel-btn-primary px-8 py-2.5 text-sm disabled:opacity-50">
          Check Expression
        </button>
        <button onClick={() => startLevel(levelIdx)}
          className="pixel-btn px-4 py-2.5 text-sm flex items-center gap-1">
          <RotateCcw size={13} /> New Puzzle
        </button>
      </div>
    </div>
  );
}
