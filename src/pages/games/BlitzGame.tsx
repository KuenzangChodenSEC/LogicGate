import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty, getStarsForScore,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getBlitzConfig, generateBlitzQuestion } from '@/lib/gameLevels';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import { ArrowLeft } from 'lucide-react';

type Screen = 'levels' | 'playing' | 'results';

export default function BlitzGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [roundNum, setRoundNum] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [totalRounds, setTotalRounds] = useState(10);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [answered, setAnswered] = useState(false);

  const progress = user ? getGameProgress(user, 'blitz') : [];

  function startLevel(idx: number) {
    const cfg = getBlitzConfig(idx + 1);
    setLevelIdx(idx);
    setRoundNum(0);
    setCorrect(0);
    setScore(0);
    setTotalRounds(cfg.rounds);
    setTimeLeft(cfg.timePerRound);
    setQuestion(generateBlitzQuestion(cfg));
    setFeedback(null);
    setAnswered(false);
    setScreen('playing');
  }

  function nextRound(wasCorrect: boolean) {
    const cfg = getBlitzConfig(levelIdx + 1);
    const nextRoundNum = roundNum + 1;
    if (nextRoundNum >= totalRounds) {
      finishLevel(correct + (wasCorrect ? 1 : 0), totalRounds);
      return;
    }
    setRoundNum(nextRoundNum);
    setTimeLeft(cfg.timePerRound);
    setQuestion(generateBlitzQuestion(cfg));
    setFeedback(null);
    setAnswered(false);
  }

  useEffect(() => {
    if (screen !== 'playing' || answered) return;
    if (timeLeft <= 0) {
      setFeedback('wrong');
      setAnswered(true);
      setTimeout(() => nextRound(false), 800);
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 0.1), 100);
    return () => clearTimeout(t);
  }, [timeLeft, screen, answered]);

  function handleAnswer(ans: number) {
    if (answered) return;
    setAnswered(true);
    const isCorrect = ans === question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setCorrect(c => c + 1);
      setScore(s => s + Math.round(100 + timeLeft * 10));
    }
    setTimeout(() => nextRound(isCorrect), 700);
  }

  function finishLevel(correctCount: number, total: number) {
    const acc = Math.round((correctCount / total) * 100);
    const stars = acc >= 90 ? 3 : acc >= 60 ? 2 : acc > 0 ? 1 : 0;
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (stars === 3 ? 10 : 0);
    const finalScore = score;
    const prev = progress[levelIdx];
    const newData = { completed: correctCount > 0, bestScore: Math.max(finalScore, prev?.bestScore ?? 0), stars: Math.max(stars, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'blitz', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Blitz Level ${levelIdx + 1}`);
    setScreen('results');
  }

  if (screen === 'levels') return <LevelSelect gameTitle="TRUTH TABLE BLITZ" progress={progress} user={user!} onSelect={startLevel} />;

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

  return (
    <div className="p-4 md:p-8 max-w-lg mx-auto">
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
      <div className={`pixel-card p-8 text-center mb-6 ${
        feedback === 'correct' ? 'border-accent bg-accent/10' :
        feedback === 'wrong' ? 'border-destructive bg-destructive/10' : ''
      }`}>
        <p className="text-muted-foreground text-xs mb-3 uppercase tracking-wide">What is the output?</p>
        <p className="text-foreground text-xl font-semibold">{question.text}</p>
        {feedback && (
          <p className={`mt-4 font-semibold text-base ${feedback === 'correct' ? 'text-accent' : 'text-destructive'}`}>
            {feedback === 'correct' ? `✓ Correct! Answer: ${question.answer}` : `✗ Wrong! Answer was: ${question.answer}`}
          </p>
        )}
      </div>

      {/* Answer buttons */}
      <div className="flex gap-6 justify-center">
        {[0, 1].map(val => (
          <button key={val} onClick={() => handleAnswer(val)} disabled={answered}
            className={`w-28 py-8 text-5xl font-bold rounded-lg border-2 transition-colors disabled:opacity-60 ${
              answered && val === question.answer ? 'bg-accent text-accent-foreground border-accent' :
              answered ? 'bg-muted text-muted-foreground border-border' : 'bg-muted text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary'
            }`}>
            {val}
          </button>
        ))}
      </div>

      {/* Accuracy */}
      <div className="mt-6 text-center text-muted-foreground text-sm">
        Accuracy: {roundNum > 0 ? Math.round((correct / roundNum) * 100) : 100}% · Correct: {correct}/{roundNum}
      </div>
    </div>
  );
}
