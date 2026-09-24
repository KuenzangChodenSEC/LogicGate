import { GateType, evaluateGate } from './gateData';

// ─── Gate Match Level Config ─────────────────────────────────────────────────
export interface GateMatchConfig {
  level: number;
  gridCols: number;
  gridRows: number;
  pairs: number;
  timeLimit: number; // seconds
  gates: GateType[];
  previewTime: number; // ms
}

const ALL_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];
const EASY_GATES: GateType[] = ['AND', 'OR', 'NOT'];
const MED_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR'];

export function getGateMatchConfig(level: number): GateMatchConfig {
  // level is 1-indexed
  const l = level;
  if (l <= 4) return { level: l, gridCols: 2, gridRows: 4, pairs: 4, timeLimit: 120, gates: EASY_GATES, previewTime: 1500 };
  if (l <= 8) return { level: l, gridCols: 3, gridRows: 4, pairs: 6, timeLimit: 100, gates: EASY_GATES, previewTime: 1200 };
  if (l <= 12) return { level: l, gridCols: 4, gridRows: 4, pairs: 8, timeLimit: 90, gates: EASY_GATES, previewTime: 1000 };
  if (l <= 16) return { level: l, gridCols: 4, gridRows: 4, pairs: 8, timeLimit: 80, gates: MED_GATES, previewTime: 800 };
  if (l <= 20) return { level: l, gridCols: 4, gridRows: 5, pairs: 10, timeLimit: 70, gates: MED_GATES, previewTime: 600 };
  if (l <= 25) return { level: l, gridCols: 4, gridRows: 5, pairs: 10, timeLimit: 60, gates: MED_GATES, previewTime: 500 };
  if (l <= 30) return { level: l, gridCols: 4, gridRows: 6, pairs: 12, timeLimit: 55, gates: ALL_GATES, previewTime: 400 };
  if (l <= 35) return { level: l, gridCols: 4, gridRows: 6, pairs: 12, timeLimit: 45, gates: ALL_GATES, previewTime: 300 };
  if (l <= 40) return { level: l, gridCols: 5, gridRows: 6, pairs: 15, timeLimit: 40, gates: ALL_GATES, previewTime: 200 };
  if (l <= 45) return { level: l, gridCols: 6, gridRows: 6, pairs: 18, timeLimit: 35, gates: ALL_GATES, previewTime: 0 };
  if (l <= 50) return { level: l, gridCols: 6, gridRows: 6, pairs: 18, timeLimit: 28, gates: ALL_GATES, previewTime: 0 };
  // Expert 51-60
  const extra = l - 50;
  return { level: l, gridCols: 6, gridRows: 6 + Math.floor(extra / 2), pairs: 18 + extra, timeLimit: Math.max(20, 28 - extra * 2), gates: ALL_GATES, previewTime: 0 };
}

// ─── Truth Table Blitz Level Config ─────────────────────────────────────────
export interface BlitzConfig {
  level: number;
  rounds: number;
  timePerRound: number; // seconds
  gates: GateType[];
  multiGate: boolean; // compound expressions
  symbolOnly: boolean; // hide gate name
}

export function getBlitzConfig(level: number): BlitzConfig {
  const l = level;
  if (l <= 4) return { level: l, rounds: 8, timePerRound: 6, gates: EASY_GATES, multiGate: false, symbolOnly: false };
  if (l <= 8) return { level: l, rounds: 10, timePerRound: 5, gates: EASY_GATES, multiGate: false, symbolOnly: false };
  if (l <= 12) return { level: l, rounds: 12, timePerRound: 5, gates: MED_GATES, multiGate: false, symbolOnly: false };
  if (l <= 16) return { level: l, rounds: 14, timePerRound: 4, gates: ALL_GATES, multiGate: false, symbolOnly: false };
  if (l <= 20) return { level: l, rounds: 15, timePerRound: 4, gates: ALL_GATES, multiGate: false, symbolOnly: false };
  if (l <= 25) return { level: l, rounds: 16, timePerRound: 3.5, gates: ALL_GATES, multiGate: true, symbolOnly: false };
  if (l <= 30) return { level: l, rounds: 18, timePerRound: 3, gates: ALL_GATES, multiGate: true, symbolOnly: false };
  if (l <= 35) return { level: l, rounds: 20, timePerRound: 3, gates: ALL_GATES, multiGate: true, symbolOnly: true };
  if (l <= 40) return { level: l, rounds: 22, timePerRound: 2.5, gates: ALL_GATES, multiGate: true, symbolOnly: true };
  if (l <= 45) return { level: l, rounds: 24, timePerRound: 2, gates: ALL_GATES, multiGate: true, symbolOnly: true };
  if (l <= 50) return { level: l, rounds: 26, timePerRound: 2, gates: ALL_GATES, multiGate: true, symbolOnly: true };
  const extra = l - 50;
  return { level: l, rounds: 26 + extra, timePerRound: Math.max(1.5, 2 - extra * 0.05), gates: ALL_GATES, multiGate: true, symbolOnly: true };
}

export interface BlitzQuestion {
  text: string;
  answer: number; // 0 or 1
}

export function generateBlitzQuestion(config: BlitzConfig): BlitzQuestion {
  const gate = config.gates[Math.floor(Math.random() * config.gates.length)];
  const a = Math.random() > 0.5 ? 1 : 0;
  const b = Math.random() > 0.5 ? 1 : 0;

  if (config.multiGate) {
    // compound: gate1(A,B) op gate2(B,C)
    const gate2 = ALL_GATES[Math.floor(Math.random() * ALL_GATES.length)];
    const op = Math.random() > 0.5 ? 'AND' : 'OR';
    const r1 = evaluateGate(gate, a, b);
    const r2 = evaluateGate(gate2, b, a);
    const out = evaluateGate(op, r1, r2);
    return {
      text: `(A ${gate} B) ${op} (B ${gate2} A) where A=${a}, B=${b}`,
      answer: out,
    };
  }

  const needsB = !['NOT', 'BUFFER'].includes(gate);
  const out = evaluateGate(gate, a, needsB ? b : undefined);
  const gateLabel = config.symbolOnly ? gate.substring(0,3) + '⊕' : gate;
  const text = needsB
    ? `${gateLabel} gate: A=${a}, B=${b}`
    : `${gateLabel} gate: A=${a}`;
  return { text, answer: out };
}

// ─── Gate Puzzle Level Config ────────────────────────────────────────────────
export interface PuzzleGateConfig {
  level: number;
  hiddenCount: number;
  totalGates: number;
  gates: GateType[];
  options: number; // answer choices per hidden gate
  inputSets: number; // how many input combinations must be satisfied
}

export function getPuzzleConfig(level: number): PuzzleGateConfig {
  const l = level;
  if (l <= 4) return { level: l, hiddenCount: 1, totalGates: 2, gates: EASY_GATES, options: 3, inputSets: 1 };
  if (l <= 8) return { level: l, hiddenCount: 1, totalGates: 3, gates: EASY_GATES, options: 4, inputSets: 1 };
  if (l <= 12) return { level: l, hiddenCount: 1, totalGates: 3, gates: MED_GATES, options: 4, inputSets: 2 };
  if (l <= 16) return { level: l, hiddenCount: 2, totalGates: 4, gates: MED_GATES, options: 4, inputSets: 2 };
  if (l <= 20) return { level: l, hiddenCount: 2, totalGates: 4, gates: ALL_GATES, options: 5, inputSets: 2 };
  if (l <= 25) return { level: l, hiddenCount: 2, totalGates: 5, gates: ALL_GATES, options: 5, inputSets: 3 };
  if (l <= 30) return { level: l, hiddenCount: 3, totalGates: 5, gates: ALL_GATES, options: 5, inputSets: 3 };
  if (l <= 35) return { level: l, hiddenCount: 3, totalGates: 6, gates: ALL_GATES, options: 6, inputSets: 4 };
  if (l <= 40) return { level: l, hiddenCount: 3, totalGates: 6, gates: ALL_GATES, options: 6, inputSets: 4 };
  if (l <= 45) return { level: l, hiddenCount: 4, totalGates: 7, gates: ALL_GATES, options: 7, inputSets: 4 };
  if (l <= 50) return { level: l, hiddenCount: 4, totalGates: 8, gates: ALL_GATES, options: 8, inputSets: 5 };
  const extra = l - 50;
  return { level: l, hiddenCount: 4 + Math.min(extra, 4), totalGates: 8 + extra, gates: ALL_GATES, options: 8, inputSets: 5 + extra };
}

// ─── Boolean Expression Builder Level Config ─────────────────────────────────
export interface BoolBuilderConfig {
  level: number;
  operands: number; // number of variables (A, B, C, ...)
  operators: number; // number of gate operators
  gates: GateType[];
  hasParentheses: boolean;
}

export function getBoolBuilderConfig(level: number): BoolBuilderConfig {
  const l = level;
  if (l <= 4) return { level: l, operands: 2, operators: 1, gates: EASY_GATES, hasParentheses: false };
  if (l <= 8) return { level: l, operands: 2, operators: 1, gates: EASY_GATES, hasParentheses: false };
  if (l <= 12) return { level: l, operands: 2, operators: 1, gates: MED_GATES, hasParentheses: false };
  if (l <= 16) return { level: l, operands: 3, operators: 2, gates: MED_GATES, hasParentheses: false };
  if (l <= 20) return { level: l, operands: 3, operators: 2, gates: ALL_GATES, hasParentheses: false };
  if (l <= 25) return { level: l, operands: 3, operators: 2, gates: ALL_GATES, hasParentheses: true };
  if (l <= 30) return { level: l, operands: 4, operators: 3, gates: ALL_GATES, hasParentheses: true };
  if (l <= 35) return { level: l, operands: 4, operators: 3, gates: ALL_GATES, hasParentheses: true };
  if (l <= 40) return { level: l, operands: 4, operators: 3, gates: ALL_GATES, hasParentheses: true };
  if (l <= 45) return { level: l, operands: 5, operators: 4, gates: ALL_GATES, hasParentheses: true };
  if (l <= 50) return { level: l, operands: 5, operators: 4, gates: ALL_GATES, hasParentheses: true };
  const extra = l - 50;
  return { level: l, operands: Math.min(5 + Math.floor(extra / 2), 8), operators: Math.min(4 + Math.floor(extra / 2), 7), gates: ALL_GATES, hasParentheses: true };
}

// ─── Maze Level Config ───────────────────────────────────────────────────────
export interface MazeConfig {
  level: number;
  gridSize: number;
  gates: GateType[];
  timeLimit: number; // 0 = no limit
  deadEnds: number;
  chainedPuzzles: boolean;
}

export function getMazeConfig(level: number): MazeConfig {
  const l = level;
  if (l <= 4) return { level: l, gridSize: 5, gates: EASY_GATES, timeLimit: 0, deadEnds: 0, chainedPuzzles: false };
  if (l <= 8) return { level: l, gridSize: 5, gates: EASY_GATES, timeLimit: 0, deadEnds: 1, chainedPuzzles: false };
  if (l <= 12) return { level: l, gridSize: 6, gates: MED_GATES, timeLimit: 0, deadEnds: 2, chainedPuzzles: false };
  if (l <= 16) return { level: l, gridSize: 7, gates: ALL_GATES, timeLimit: 0, deadEnds: 2, chainedPuzzles: false };
  if (l <= 20) return { level: l, gridSize: 7, gates: ALL_GATES, timeLimit: 0, deadEnds: 3, chainedPuzzles: false };
  if (l <= 25) return { level: l, gridSize: 8, gates: ALL_GATES, timeLimit: 120, deadEnds: 3, chainedPuzzles: false };
  if (l <= 30) return { level: l, gridSize: 8, gates: ALL_GATES, timeLimit: 100, deadEnds: 4, chainedPuzzles: false };
  if (l <= 35) return { level: l, gridSize: 9, gates: ALL_GATES, timeLimit: 90, deadEnds: 4, chainedPuzzles: true };
  if (l <= 40) return { level: l, gridSize: 10, gates: ALL_GATES, timeLimit: 80, deadEnds: 5, chainedPuzzles: true };
  if (l <= 45) return { level: l, gridSize: 11, gates: ALL_GATES, timeLimit: 70, deadEnds: 5, chainedPuzzles: true };
  if (l <= 50) return { level: l, gridSize: 12, gates: ALL_GATES, timeLimit: 60, deadEnds: 6, chainedPuzzles: true };
  const extra = l - 50;
  return { level: l, gridSize: Math.min(12 + extra, 15), gates: ALL_GATES, timeLimit: Math.max(40, 60 - extra * 3), deadEnds: 6 + extra, chainedPuzzles: true };
}

// ─── Gate Sorter Level Config ─────────────────────────────────────────────────
export interface SorterConfig {
  level: number;
  itemCount: number;
  gates: GateType[];
  criteria: 'output_1' | 'output_0' | 'sequence' | 'pipeline';
  moveLimit: number;
}

export function getSorterConfig(level: number): SorterConfig {
  const l = level;
  if (l <= 4) return { level: l, itemCount: 4, gates: EASY_GATES, criteria: 'output_1', moveLimit: 8 };
  if (l <= 8) return { level: l, itemCount: 4, gates: EASY_GATES, criteria: 'output_0', moveLimit: 8 };
  if (l <= 12) return { level: l, itemCount: 5, gates: MED_GATES, criteria: 'output_1', moveLimit: 10 };
  if (l <= 16) return { level: l, itemCount: 5, gates: MED_GATES, criteria: 'sequence', moveLimit: 10 };
  if (l <= 20) return { level: l, itemCount: 6, gates: ALL_GATES, criteria: 'sequence', moveLimit: 12 };
  if (l <= 25) return { level: l, itemCount: 6, gates: ALL_GATES, criteria: 'output_1', moveLimit: 14 };
  if (l <= 30) return { level: l, itemCount: 7, gates: ALL_GATES, criteria: 'pipeline', moveLimit: 14 };
  if (l <= 35) return { level: l, itemCount: 8, gates: ALL_GATES, criteria: 'pipeline', moveLimit: 16 };
  if (l <= 40) return { level: l, itemCount: 8, gates: ALL_GATES, criteria: 'pipeline', moveLimit: 18 };
  if (l <= 45) return { level: l, itemCount: 9, gates: ALL_GATES, criteria: 'pipeline', moveLimit: 20 };
  if (l <= 50) return { level: l, itemCount: 10, gates: ALL_GATES, criteria: 'pipeline', moveLimit: 20 };
  const extra = l - 50;
  return { level: l, itemCount: Math.min(10 + extra, 14), gates: ALL_GATES, criteria: 'pipeline', moveLimit: 20 + extra * 2 };
}
