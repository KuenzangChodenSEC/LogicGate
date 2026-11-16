import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty, getStarsForScore,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getBlitzConfig, generateBlitzQuestion } from '@/lib/gameLevels';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import { ArrowLeft } from 'lucide-react';
import { playGameSound } from '@/lib/gameAudio';

type Screen = 'levels' | 'playing' | 'results';

export default function BlitzGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [question, setQuestion] = useState({ expression: '', variables: [] as string[], rows: [] as { inputs: number[]; output: number }[] });
  const [selectedOutputs, setSelectedOutputs] = useState<(number | null)[]>([]);
  const [roundNum, setRoundNum] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [totalRounds, setTotalRounds] = useState(10);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [needsMoreInputs, setNeedsMoreInputs] = useState(false);

  const progress = user ? getGameProgress(user, 'blitz') : [];

  function startLevel(idx: number) {
    const cfg = getBlitzConfig(idx + 1);
    setLevelIdx(idx);
    setRoundNum(0);
    setCorrect(0);
    setScore(0);
    setTotalRounds(cfg.rounds);
    setTimeLeft(cfg.timePerRound);
    const nextQuestion = generateBlitzQuestion(cfg);
    setQuestion(nextQuestion);
    setSelectedOutputs(nextQuestion.rows.map(() => null));
    setFeedback(null);
    setAnswered(false);
    setNeedsMoreInputs(false);
    setScreen('playing');
  }

  function nextRound(wasCorrect: boolean, points = 0) {
    const cfg = getBlitzConfig(levelIdx + 1);
    const nextRoundNum = roundNum + 1;
    if (nextRoundNum >= totalRounds) {
      finishLevel(correct + (wasCorrect ? 1 : 0), totalRounds, score + points);
      return;
    }
    setRoundNum(nextRoundNum);
    setTimeLeft(cfg.timePerRound);
    const nextQuestion = generateBlitzQuestion(cfg);
    setQuestion(nextQuestion);
    setSelectedOutputs(nextQuestion.rows.map(() => null));
    setFeedback(null);
    setAnswered(false);
    setNeedsMoreInputs(false);
  }

  useEffect(() => {
    if (screen !== 'playing' || answered) return;
    if (timeLeft <= 0) {
      setFeedback('wrong');
      playGameSound('wrong');
      setAnswered(true);
      setTimeout(() => nextRound(false), 1000);
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 0.1), 100);
    return () => clearTimeout(t);
  }, [timeLeft, screen, answered]);

  function selectOutput(rowIndex: number, output: number) {
    if (answered) return;
    setSelectedOutputs(outputs => outputs.map((value, index) => index === rowIndex ? output : value));
    setNeedsMoreInputs(false);
  }

  function handleSubmit() {
    if (answered) return;
    if (selectedOutputs.some(output => output === null)) {
      setNeedsMoreInputs(true);
      return;
    }

    const correctRows = question.rows.filter((row, index) => selectedOutputs[index] === row.output).length;
    const isCorrect = correctRows === question.rows.length;
    const points = correctRows * Math.round(100 + timeLeft * 4);
    setAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    playGameSound(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setCorrect(c => c + 1);
    }
    setScore(s => s + points);
    setTimeout(() => nextRound(isCorrect, points), 1200);
  }

  function finishLevel(correctCount: number, total: number, finalScore = score) {
    const acc = Math.round((correctCount / total) * 100);
    const stars = acc >= 90 ? 3 : acc >= 60 ? 2 : acc > 0 ? 1 : 0;
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (stars === 3 ? 10 : 0);
    const prev = progress[levelIdx];
    const newData = { completed: correctCount > 0, bestScore: Math.max(finalScore, prev?.bestScore ?? 0), stars: Math.max(stars, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'blitz', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Blitz Level ${levelIdx + 1}`);
    setScreen('results');
  }

  if (screen === 'levels') return <LevelSelect gameTitle="TRUTH TABLE BLITZ" progress={progress} user={user!} gameId="blitz" onSelect={startLevel} />;

  if (!user) return null;

  if (screen === 'results') {
    const acc = Math.round((correct / totalRounds) * 100);
    const stars = acc >= 90 ? 3 : acc >= 60 ? 2 : acc > 0 ? 1 : 0;
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  const cfg = getBlitzConfig(levelIdx + 1);
  const timePct = (timeLeft / cfg.timePerRound) * 100;
  const correctRows = question.rows.filter((row, index) => selectedOutputs[index] === row.output).length;

  return (
    <div className="blitz-game p-4 md:p-8 max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="font-medium text-foreground">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
          <span className="text-accent font-medium">Round {roundNum + 1}/{totalRounds}</span>
          <span className="text-primary font-medium">Score: {score}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
        <div className={`h-full rounded-full transition-all ${timePct < 30 ? 'bg-destructive' : timePct < 60 ? 'bg-amber-400' : 'bg-accent'}`}
          style={{ width: `${timePct}%`, transition: 'width 0.1s linear' }} />
      </div>

      {/* Question */}
      <div className={`pixel-card blitz-question p-8 text-center mb-6 ${
        feedback === 'correct' ? 'border-accent bg-accent/10' :
        feedback === 'wrong' ? 'border-destructive bg-destructive/10' : ''
      }`}>
        <p className="text-muted-foreground text-xs mb-3 uppercase tracking-wide">Complete the truth table</p>
        <p className="text-muted-foreground text-sm mb-2">Fill in every output for:</p>
        <p className="text-foreground text-xl font-semibold font-mono">{question.expression}</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                {question.variables.map(variable => <th key={variable} scope="col" className="px-3 py-2 font-semibold">{variable}</th>)}
                <th scope="col" className="px-3 py-2 font-semibold">Output (Y)</th>
              </tr>
            </thead>
            <tbody>
              {question.rows.map((row, rowIndex) => (
                <tr key={row.inputs.join('')} className="border-b border-border/60 last:border-0">
                  {row.inputs.map((input, inputIndex) => (
                    <td key={question.variables[inputIndex]} className="px-3 py-2 text-foreground">{input}</td>
                  ))}
                  <td className="px-3 py-2">
                    <div className="flex justify-center gap-2">
                      {[0, 1].map(output => {
                        const selected = selectedOutputs[rowIndex] === output;
                        const isExpected = answered && row.output === output;
                        const isWrongSelection = answered && selected && !isExpected;
                        return (
                          <button
                            key={output}
                            type="button"
                            onClick={() => selectOutput(rowIndex, output)}
                            disabled={answered}
                            aria-label={`Row ${rowIndex + 1} output ${output}`}
                            aria-pressed={selected}
                            className={`min-w-10 rounded-md border px-3 py-1 font-bold transition-colors disabled:cursor-default ${
                              isExpected ? 'border-accent bg-accent/15 text-accent' :
                              isWrongSelection ? 'border-destructive bg-destructive/10 text-destructive' :
                              selected ? 'border-primary bg-primary text-primary-foreground' :
                              'border-border bg-muted text-foreground hover:border-primary'
                            }`}
                          >
                            {output}
                          </button>
                        );
                      })}
                      {answered && selectedOutputs[rowIndex] !== row.output && (
                        <span className="self-center text-xs text-muted-foreground">Correct: {row.output}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!answered && (
          <div className="mt-5">
            <button type="button" onClick={handleSubmit} className="pixel-btn-primary px-6 py-2.5">
              Check truth table
            </button>
            {needsMoreInputs && <p className="mt-2 text-sm text-destructive">Choose an output for every row first.</p>}
          </div>
        )}
        {feedback && (
          <p className={`mt-4 font-semibold text-base ${feedback === 'correct' ? 'text-accent' : 'text-destructive'}`}>
            {feedback === 'correct'
              ? '✓ Perfect table!'
              : `✗ ${correctRows} of ${question.rows.length} rows correct. Correct outputs are shown above.`}
          </p>
        )}
      </div>

      {/* Accuracy */}
      <div className="mt-6 text-center text-muted-foreground text-sm">
        Tables completed perfectly: {correct}/{roundNum}
      </div>
    </div>
  );
}
