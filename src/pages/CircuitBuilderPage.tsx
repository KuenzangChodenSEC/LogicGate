import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { GateType, evaluateGate } from '@/lib/gateData';
import GateSVG from '@/components/GateSVG';
import { toast } from 'sonner';
import { updateUser } from '@/lib/storage';

type ComponentType = GateType | 'INPUT' | 'OUTPUT';

interface CircuitNode {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  value?: number;
  inputIds?: string[];
}

const PALETTE: ComponentType[] = ['INPUT', 'OUTPUT', 'AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];
const NODE_W = 80;
const NODE_H = 82;

// Fresh memo per evaluation pass — avoids stale cached values
function computeValue(node: CircuitNode, nodes: CircuitNode[], memo: Map<string, number | undefined>): number | undefined {
  if (memo.has(node.id)) return memo.get(node.id);
  memo.set(node.id, undefined); // cycle guard

  if (node.type === 'INPUT') {
    const v = node.value ?? 0;
    memo.set(node.id, v);
    return v;
  }
  if (node.type === 'OUTPUT') {
    const src = nodes.find(n => n.id === node.inputIds?.[0]);
    const v = src ? computeValue(src, nodes, memo) : undefined;
    memo.set(node.id, v);
    return v;
  }

  const inputs = (node.inputIds || []).map(iid => {
    const src = nodes.find(n => n.id === iid);
    return src ? computeValue(src, nodes, memo) : undefined;
  });

  if (inputs.some(v => v === undefined)) { memo.set(node.id, undefined); return undefined; }

  const isSingle = ['NOT', 'BUFFER'].includes(node.type);
  const a = inputs[0] ?? 0;
  const b = isSingle ? undefined : (inputs[1] ?? 0);
  const v = evaluateGate(node.type as GateType, a, b);
  memo.set(node.id, v);
  return v;
}

function getValueForAll(nodes: CircuitNode[]): Map<string, number | undefined> {
  const memo = new Map<string, number | undefined>();
  for (const node of nodes) computeValue(node, nodes, memo);
  return memo;
}

export default function CircuitBuilderPage() {
  const { user, awardXP } = useApp();
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  // dragOffset stores cursor position relative to node's top-left corner (canvas-space)
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const circuitBuilt = useRef(false);

  // Compute all node values fresh on every render
  const valueMap = getValueForAll(nodes);
  function getNodeValue(id: string) { return valueMap.get(id); }

  function addNode(type: ComponentType) {
    const id = `n_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    // Place new nodes in a visible area of the canvas
    const x = 80 + Math.random() * 240;
    const y = 60 + Math.random() * 180;
    setNodes(prev => [...prev, { id, type, x, y, value: type === 'INPUT' ? 0 : undefined, inputIds: [] }]);
  }

  function startDrag(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const node = nodes.find(n => n.id === id)!;
    // offset = cursor position inside node (canvas-relative)
    const cursorCanvasX = e.clientX - rect.left;
    const cursorCanvasY = e.clientY - rect.top;
    dragOffset.current = { x: cursorCanvasX - node.x, y: cursorCanvasY - node.y };
    setDragging(id);
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Convert cursor to canvas-relative coordinates, then subtract offset
    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x, y } : n));
  }, [dragging]);

  function stopDrag() { setDragging(null); }

  // Release drag if mouse leaves canvas
  useEffect(() => {
    const up = () => stopDrag();
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  function toggleInput(id: string) {
    setNodes(prev => prev.map(n =>
      n.id === id && n.type === 'INPUT' ? { ...n, value: n.value === 0 ? 1 : 0 } : n
    ));
  }

  function connectNodes(toId: string) {
    if (!connecting || connecting === toId) { setConnecting(null); return; }
    const fromNode = nodes.find(n => n.id === connecting)!;
    const toNode = nodes.find(n => n.id === toId)!;
    if (fromNode.type === 'OUTPUT') { toast.error('Output nodes cannot be sources.'); setConnecting(null); return; }
    if (toNode.type === 'INPUT') { toast.error('Input nodes cannot receive connections.'); setConnecting(null); return; }
    const maxInputs = ['NOT', 'BUFFER', 'OUTPUT'].includes(toNode.type) ? 1 : 2;
    if ((toNode.inputIds?.length ?? 0) >= maxInputs) {
      toast.error(`${toNode.type} accepts at most ${maxInputs} input(s).`);
      setConnecting(null);
      return;
    }
    setNodes(prev => prev.map(n =>
      n.id === toId ? { ...n, inputIds: [...(n.inputIds || []), connecting] } : n
    ));
    if (!circuitBuilt.current && user) {
      circuitBuilt.current = true;
      awardXP(10, 'Built first circuit!');
      if (!user.badges.includes('first_circuit')) toast.success('Badge unlocked: Circuit Maker!');
    }
    setConnecting(null);
  }

  function removeNode(id: string) {
    setNodes(prev => prev
      .filter(n => n.id !== id)
      .map(n => ({ ...n, inputIds: (n.inputIds || []).filter(iid => iid !== id) }))
    );
    if (connecting === id) setConnecting(null);
  }

  function clearCanvas() { setNodes([]); setConnecting(null); circuitBuilt.current = false; }

  function saveCircuit() {
    if (!user) return;
    updateUser({ ...user, circuitSave: JSON.stringify(nodes) });
    toast.success('Circuit saved!');
  }

  function loadCircuit() {
    if (!user?.circuitSave) { toast.error('No saved circuit found.'); return; }
    try { setNodes(JSON.parse(user.circuitSave)); toast.success('Circuit loaded!'); }
    catch { toast.error('Failed to load circuit.'); }
  }

  const btnBase = 'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors';

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-border bg-white flex items-center justify-between flex-wrap gap-2 shrink-0">
        <div>
          <h2 className="font-semibold text-foreground text-sm">Circuit Builder</h2>
          <p className="text-muted-foreground text-xs">Add components from the panel, drag to position, use → to connect.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {connecting && (
            <span className="text-primary text-xs border border-primary/40 px-2 py-1 rounded-md bg-primary/5 font-medium">
              Connecting: {nodes.find(n => n.id === connecting)?.type} → click target node
            </span>
          )}
          <button onClick={saveCircuit} className={`${btnBase} bg-primary text-primary-foreground border-primary hover:bg-primary/90`}>Save</button>
          <button onClick={loadCircuit} className={`${btnBase} bg-background text-foreground border-border hover:bg-muted`}>Load</button>
          <button onClick={clearCanvas} className={`${btnBase} bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20`}>Clear</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Palette */}
        <div className="w-24 shrink-0 bg-muted/40 border-r border-border p-2 overflow-y-auto flex flex-col gap-1">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider mb-1">Add</p>
          {PALETTE.map(type => (
            <button key={type} onClick={() => addNode(type)}
              className="w-full py-1.5 text-[11px] font-medium rounded-lg border border-border bg-white text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              {type}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 min-w-0 relative overflow-hidden bg-white select-none"
          style={{
            backgroundImage: 'radial-gradient(hsl(var(--border)/0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            cursor: dragging ? 'grabbing' : 'default',
          }}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
        >
          {/* SVG wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {nodes.map(node =>
              (node.inputIds || []).map(srcId => {
                const src = nodes.find(n => n.id === srcId);
                if (!src) return null;
                // wire exits right-center of src, enters left-center of dst
                const x1 = src.x + NODE_W;
                const y1 = src.y + NODE_H / 2;
                const x2 = node.x;
                const y2 = node.y + NODE_H / 2;
                const cx = (x1 + x2) / 2;
                const val = getNodeValue(srcId);
                const color = val === 1 ? 'hsl(var(--primary))' : 'hsl(var(--border))';
                const width = val === 1 ? 2.5 : 1.5;
                return (
                  <path key={`${srcId}-${node.id}`}
                    d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
                    fill="none" stroke={color} strokeWidth={width} />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const val = getNodeValue(node.id);
            const isActive = val === 1;
            const isConnecting = connecting === node.id;
            return (
              <div key={node.id}
                className={`absolute rounded-xl border-2 bg-white shadow-sm select-none transition-shadow ${
                  isConnecting
                    ? 'border-primary shadow-primary/20 shadow-md'
                    : isActive
                    ? 'border-primary/50'
                    : 'border-border'
                }`}
                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H, zIndex: dragging === node.id ? 10 : 2, cursor: dragging === node.id ? 'grabbing' : 'grab' }}
                onMouseDown={e => startDrag(e, node.id)}
              >
                {/* Node body */}
                <div className="flex flex-col items-center justify-center h-full gap-1 px-1 pt-1">
                  {node.type === 'INPUT' ? (
                    <button
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted text-foreground border-border hover:border-primary'
                      }`}
                      onMouseDown={e => e.stopPropagation()}
                      onClick={e => { e.stopPropagation(); toggleInput(node.id); }}
                    >{node.value}</button>
                  ) : node.type === 'OUTPUT' ? (
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-base transition-colors ${
                      isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'
                    }`}>
                      {val !== undefined ? val : '?'}
                    </div>
                  ) : (
                    <GateSVG gate={node.type as GateType} size={46} active={isActive} />
                  )}
                  <p className="text-[10px] text-muted-foreground font-medium leading-none">{node.type}</p>
                </div>

                {/* Connect / Remove buttons — inside node bounds at bottom */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1" style={{ zIndex: 3 }}>
                  <button
                    title={connecting ? 'Connect here' : 'Start connection'}
                    className={`text-[10px] w-6 h-5 flex items-center justify-center rounded font-bold transition-colors ${
                      isConnecting ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground hover:bg-primary/80'
                    }`}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); connecting ? connectNodes(node.id) : setConnecting(node.id); }}
                  >→</button>
                  <button
                    title="Remove"
                    className="text-[10px] w-6 h-5 flex items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-bold"
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); removeNode(node.id); }}
                  >✕</button>
                </div>
              </div>
            );
          })}

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <p className="text-sm font-medium">Click a component on the left to add it</p>
                <p className="text-xs mt-1 opacity-70">Use → to connect nodes, ✕ to remove</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
