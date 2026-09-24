import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getMazeConfig } from '@/lib/gameLevels';
import { GateType, evaluateGate } from '@/lib/gateData';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, ArrowLeftIcon } from 'lucide-react';

type Screen = 'levels' | 'playing' | 'results';
type Dir = 'up' | 'down' | 'left' | 'right';

interface Cell {
  row: number;
  col: number;
  isWall: boolean;
  isExit: boolean;
  gate?: GateType;
  inputA?: number;
  inputB?: number;
  answer?: number;
  solved?: boolean;
}

interface MazeState {
  grid: Cell[][];
  playerRow: number;
  playerCol: number;
  gridSize: number;
}

const ALL_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];

function randomGateChallenge(gates: GateType[]): Pick<Cell, 'gate' | 'inputA' | 'inputB' | 'answer'> {
  const g = gates[Math.floor(Math.random() * gates.length)];
  const a = Math.random() > 0.5 ? 1 : 0;
  const b = Math.random() > 0.5 ? 1 : 0;
  const isSingle = ['NOT', 'BUFFER'].includes(g);
  const ans = isSingle ? evaluateGate(g, a) : evaluateGate(g, a, b);
  return { gate: g, inputA: a, inputB: isSingle ? undefined : b, answer: ans };
}

function generateMaze(cfg: ReturnType<typeof getMazeConfig>): MazeState {
  const size = cfg.gridSize;
  const grid: Cell[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row, col,
      isWall: false,
      isExit: row === size - 1 && col === size - 1,
    }))
  );

  // Add walls via random obstacles (not too many)
  const maxWalls = Math.floor(size * size * 0.15);
  let wallsPlaced = 0;
  while (wallsPlaced < maxWalls) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if ((r === 0 && c === 0) || (r === size - 1 && c === size - 1)) continue;
    if (!grid[r][c].isWall) { grid[r][c].isWall = true; wallsPlaced++; }
  }

  // Add gate challenges at junctions (roughly every 3 cells)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      if (cell.isWall || cell.isExit || (r === 0 && c === 0)) continue;
      if ((r + c) % 3 === 0) {
        const ch = randomGateChallenge(cfg.gates);
        cell.gate = ch.gate;
        cell.inputA = ch.inputA;
        cell.inputB = ch.inputB;
        cell.answer = ch.answer;
      }
    }
  }

  return { grid, playerRow: 0, playerCol: 0, gridSize: size };
}

export default function MazeGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [maze, setMaze] = useState<MazeState | null>(null);
  const [pendingCell, setPendingCell] = useState<Cell | null>(null);
  const [pendingDir, setPendingDir] = useState<Dir | null>(null);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  const progress = user ? getGameProgress(user, 'maze') : [];

  function startLevel(idx: number) {
    const cfg = getMazeConfig(idx + 1);
    const m = generateMaze(cfg);
    setMaze(m);
    setLevelIdx(idx);
    setWrongMoves(0);
    setTimeLeft(cfg.timeLimit);
    setGameOver(false);
    setWon(false);
    setScore(0);
    setPendingCell(null);
    setPendingDir(null);
    setFeedback('');
    setScreen('playing');
  }

  useEffect(() => {
    if (screen !== 'playing' || !maze || won || gameOver) return;
    const cfg = getMazeConfig(levelIdx + 1);
    if (cfg.timeLimit === 0) return;
    if (timeLeft <= 0) { handleGameOver(); return; }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen, won, gameOver]);

  function tryMove(dir: Dir) {
    if (!maze || pendingCell || won || gameOver) return;
    const { playerRow: r, playerCol: c, grid, gridSize } = maze;
    let nr = r, nc = c;
    if (dir === 'up') nr = r - 1;
    if (dir === 'down') nr = r + 1;
    if (dir === 'left') nc = c - 1;
    if (dir === 'right') nc = c + 1;

    if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return;
    const target = grid[nr][nc];
    if (target.isWall) { setFeedback('Wall! Choose another direction.'); return; }

    if (target.gate && !target.solved) {
      setPendingCell(target);
      setPendingDir(dir);
      setFeedback(`Gate puzzle at (${nr},${nc})! Solve it to proceed.`);
    } else {
      movePlayer(nr, nc, target);
    }
  }

  function movePlayer(nr: number, nc: number, cell: Cell) {
    setMaze(prev => {
      if (!prev) return prev;
      const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));
      newGrid[nr][nc].solved = true;
      return { ...prev, playerRow: nr, playerCol: nc, grid: newGrid };
    });
    if (cell.isExit) handleWin();
    setPendingCell(null);
    setPendingDir(null);
    setFeedback('');
  }

  function answerGate(ans: number) {
    if (!pendingCell || !pendingDir || !maze) return;
    const { grid } = maze;
    const target = pendingCell;
    if (ans === target.answer) {
      setFeedback('Correct! Path unlocked!');
      const nr = pendingDir === 'up' ? maze.playerRow - 1
        : pendingDir === 'down' ? maze.playerRow + 1 : maze.playerRow;
      const nc = pendingDir === 'left' ? maze.playerCol - 1
        : pendingDir === 'right' ? maze.playerCol + 1 : maze.playerCol;
      setTimeout(() => movePlayer(nr, nc, target), 400);
    } else {
      setWrongMoves(w => w + 1);
      setFeedback(`Wrong! The answer was ${target.answer}. You stay here.`);
      setPendingCell(null);
      setPendingDir(null);
    }
  }

  function handleWin() {
    setWon(true);
    const cfg = getMazeConfig(levelIdx + 1);
    const timeBon = cfg.timeLimit > 0 ? timeLeft : 60;
    const sc = Math.max(0, 1000 - wrongMoves * 50 + timeBon * 5);
    const s = wrongMoves === 0 ? 3 : wrongMoves <= 3 ? 2 : 1;
    setScore(sc);
    setStars(s);
    finishLevel(sc, s, true);
  }

  function handleGameOver() {
    setGameOver(true);
    finishLevel(0, 0, false);
  }

  function finishLevel(sc: number, s: number, completed: boolean) {
    const diff = getDifficulty(levelIdx);
    const xpEarned = completed ? getXPForDifficulty(diff) + (s === 3 ? 10 : 0) : 0;
    const prev = progress[levelIdx];
    const newData = { completed, bestScore: Math.max(sc, prev?.bestScore ?? 0), stars: Math.max(s, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'maze', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    if (xpEarned > 0) awardXP(xpEarned, `Maze Level ${levelIdx + 1}`);
    setTimeout(() => setScreen('results'), 800);
  }

  if (screen === 'levels') return <LevelSelect gameTitle="LOGIC MAZE" progress={progress} user={user!} onSelect={startLevel} />;

  if (!user) return null;
  if (screen === 'results') {
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  if (!maze) return null;
  const cfg = getMazeConfig(levelIdx + 1);
  const cellSize = Math.min(40, Math.floor(320 / maze.gridSize));

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="font-medium text-foreground">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
          <span className="text-destructive font-medium">Mistakes: {wrongMoves}</span>
          {cfg.timeLimit > 0 && (
            <span className={timeLeft <= 10 ? 'text-destructive font-bold' : 'text-primary font-medium'}>⏱ {timeLeft}s</span>
          )}
        </div>
      </div>

      {/* Maze grid */}
      <div className="pixel-card p-3 mb-4 overflow-auto">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${maze.gridSize}, ${cellSize}px)`, gap: 2 }}>
          {maze.grid.flat().map(cell => {
            const isPlayer = cell.row === maze.playerRow && cell.col === maze.playerCol;
            return (
              <div key={`${cell.row}-${cell.col}`}
                style={{ width: cellSize, height: cellSize }}
                className={`flex items-center justify-center text-xs rounded-sm border ${
                  cell.isWall ? 'bg-muted-foreground border-muted-foreground' :
                  isPlayer ? 'bg-primary border-primary text-primary-foreground' :
                  cell.isExit ? 'bg-accent border-accent text-accent-foreground' :
                  cell.solved ? 'bg-accent/20 border-accent/50' :
                  cell.gate ? 'bg-amber-100 border-amber-400' :
                  'bg-card border-border'
                }`}>
                {isPlayer ? '🧍' : cell.isExit ? '🚪' : cell.isWall ? '' :
                  cell.gate && !cell.solved ? (
                    <span style={{ fontSize: Math.max(8, cellSize / 4) }}>?</span>
                  ) : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gate puzzle prompt */}
      {pendingCell && (
        <div className="pixel-card p-4 mb-4 border-2 border-amber-400 bg-amber-50">
          <p className="text-amber-800 font-semibold text-sm mb-2">Gate Puzzle — Solve to Proceed</p>
          <p className="text-foreground text-sm mb-3">
            {pendingCell.gate} gate: A={pendingCell.inputA}
            {pendingCell.inputB !== undefined ? `, B=${pendingCell.inputB}` : ''} → Output Y = ?
          </p>
          <div className="flex gap-4">
            <button onClick={() => answerGate(0)}
              className="w-20 py-4 text-3xl font-bold rounded-lg border-2 border-border bg-muted text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              0
            </button>
            <button onClick={() => answerGate(1)}
              className="w-20 py-4 text-3xl font-bold rounded-lg border-2 border-border bg-muted text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              1
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && !pendingCell && (
        <div className="pixel-card p-2 mb-3 text-center text-sm">
          <span className={feedback.includes('Correct') ? 'text-accent font-medium' : feedback.includes('Wrong') ? 'text-destructive font-medium' : 'text-muted-foreground'}>
            {feedback}
          </span>
        </div>
      )}

      {/* D-pad controls */}
      <div className="flex flex-col items-center gap-1">
        <button onClick={() => tryMove('up')} className="pixel-btn w-12 h-12 flex items-center justify-center">
          <ArrowUp size={20} />
        </button>
        <div className="flex gap-1">
          <button onClick={() => tryMove('left')} className="pixel-btn w-12 h-12 flex items-center justify-center">
            <ArrowLeftIcon size={20} />
          </button>
          <div className="w-12 h-12 bg-muted border border-border rounded flex items-center justify-center">
            <span style={{ fontSize: 20 }}>🧍</span>
          </div>
          <button onClick={() => tryMove('right')} className="pixel-btn w-12 h-12 flex items-center justify-center">
            <ArrowRight size={20} />
          </button>
        </div>
        <button onClick={() => tryMove('down')} className="pixel-btn w-12 h-12 flex items-center justify-center">
          <ArrowDown size={20} />
        </button>
      </div>
      <p className="text-center text-muted-foreground text-xs mt-2">
        Legend: 🧍 You · 🚪 Exit · ■ Wall · ? Gate Puzzle · WASD or arrows
      </p>
    </div>
  );
}
