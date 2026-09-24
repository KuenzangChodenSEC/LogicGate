import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GATE_TOPICS, updateUser, checkAndAwardBadges } from '@/lib/storage';
import { QUIZ_DATA, GATES, getMixedQuizQuestions } from '@/lib/gateData';
import type { GateType, QuizQuestion } from '@/lib/gateData';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type Screen = 'hub' | 'quiz' | 'results';

interface QuizSession {
  gateId: GateType | 'mixed';
  questions: QuizQuestion[];
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
}

export default function QuizPage() {
  const { user, awardXP, refreshUser } = useApp();
  const navigate = useNavigate();
  const { gateId: gateIdParam } = useParams<{ gateId?: string }>();
  const [screen, setScreen] = useState<Screen>('hub');
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  // Auto-start quiz when navigated to /quiz/:gateId
  useEffect(() => {
    if (!gateIdParam) return;
    const resolved = gateIdParam.toUpperCase() as GateType;
    if (GATE_TOPICS.includes(resolved)) {
      startQuizImmediate(resolved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateIdParam]);

  if (!user) return null;

  function startQuizImmediate(gateId: GateType | 'mixed') {
    const questions = gateId === 'mixed' ? getMixedQuizQuestions() : [...QUIZ_DATA[gateId]];
    setSession({ gateId, questions, answers: {}, submitted: {} });
    setCurrentQ(0);
    setScore(0);
    setScreen('quiz');
  }

  function startQuiz(gateId: GateType | 'mixed') {
    const questions = gateId === 'mixed' ? getMixedQuizQuestions() : [...QUIZ_DATA[gateId]];
    setSession({ gateId, questions, answers: {}, submitted: {} });
    setCurrentQ(0);
    setScore(0);
    setScreen('quiz');
  }

  function handleAnswer(qId: string, answer: string) {
    if (!session || session.submitted[qId]) return;
    const q = session.questions.find(q => q.id === qId)!;
    const isCorrect = answer === q.answer;
    if (isCorrect) {
      setScore(s => s + 1);
      awardXP(5, `Correct: ${q.id}`);
    }
    setSession(prev => prev ? {
      ...prev,
      answers: { ...prev.answers, [qId]: answer },
      submitted: { ...prev.submitted, [qId]: true },
    } : prev);
  }

  function finishQuiz() {
    if (!session || !user) return;
    const total = session.questions.length;
    const pct = Math.round((score / total) * 100);
    awardXP(15, 'Quiz completion bonus');
    const gateId = session.gateId;
    let updatedUser = { ...user, quizScores: { ...user.quizScores, [gateId]: pct } };
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    setScreen('results');
  }

  // Navigate to next gate lesson after quiz
  function goToNextLesson() {
    if (!session || session.gateId === 'mixed') { navigate('/learn'); return; }
    const idx = GATE_TOPICS.indexOf(session.gateId as GateType);
    const nextGate = idx >= 0 && idx < GATE_TOPICS.length - 1 ? GATE_TOPICS[idx + 1] : null;
    if (nextGate) {
      toast.success(`Moving to ${nextGate} Gate lesson`);
      navigate(`/learn/${nextGate.toLowerCase()}`);
    } else {
      navigate('/learn');
    }
  }

  // ── Hub ────────────────────────────────────────────────────────────────────
  if (screen === 'hub') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Quiz</h1>
          <p className="text-muted-foreground text-sm">10 questions per gate. Test your understanding of each logic gate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {GATE_TOPICS.map(gateId => {
            const quizScore = user.quizScores[gateId];
            const gateInfo = GATES.find(g => g.id === gateId)!;
            const passed = quizScore !== undefined && quizScore >= 60;
            return (
              <div key={gateId} className="pixel-card p-4 flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{gateId.slice(0,2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground text-sm">{gateInfo.name}</span>
                    {quizScore !== undefined && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {quizScore}%
                      </span>
                    )}
                  </div>
                  {quizScore !== undefined && (
                    <div className="pixel-progress mb-2">
                      <div className={`pixel-progress-fill ${passed ? 'bg-accent' : 'bg-destructive'}`} style={{ width: `${quizScore}%` }} />
                    </div>
                  )}
                  <span className="text-muted-foreground text-xs">10 questions</span>
                </div>
                <button
                  onClick={() => startQuiz(gateId)}
                  className="pixel-btn-primary px-3 py-1.5 text-sm shrink-0">
                  {quizScore !== undefined ? 'Retake' : 'Start'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mixed quiz */}
        <div className="pixel-card p-5 border-l-4 border-primary">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-foreground mb-0.5">Mixed Challenge</h3>
              <p className="text-muted-foreground text-sm">10 random questions from all 8 gate types</p>
              {user.quizScores['mixed'] !== undefined && (
                <span className="text-primary text-sm font-medium">Best: {user.quizScores['mixed']}%</span>
              )}
            </div>
            <button onClick={() => startQuiz('mixed')} className="pixel-btn-primary px-5 py-2">
              Start Mixed Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  if (screen === 'quiz' && session) {
    const q = session.questions[currentQ];
    const isSubmitted = session.submitted[q.id];
    const userAnswer = session.answers[q.id];
    const isCorrect = userAnswer === q.answer;
    const totalQ = session.questions.length;
    const answeredCount = Object.keys(session.submitted).length;

    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto animate-pixel-fade">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <button onClick={() => { gateIdParam ? navigate('/quiz') : setScreen('hub'); }} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
            <ArrowLeft size={14} /> Quit
          </button>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Question {currentQ + 1} of {totalQ}</span>
            <span className="text-accent font-medium">{score}/{answeredCount} correct</span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
              {session.gateId === 'mixed' ? 'Mixed' : `${session.gateId} Gate`}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pixel-progress mb-5">
          <div className="pixel-progress-fill" style={{ width: `${((currentQ + 1) / totalQ) * 100}%` }} />
        </div>

        {/* Question */}
        <div className={`pixel-card p-6 mb-4 ${isSubmitted ? (isCorrect ? 'border-green-300' : 'border-red-300') : ''}`}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            {q.type === 'mcq' ? 'Multiple Choice' : 'True / False'}
          </p>
          <p className="text-foreground text-base leading-relaxed font-medium mb-5">{q.question}</p>

          {q.options && (
            <div className="space-y-2">
              {q.options.map(opt => {
                let cls = 'w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ';
                if (isSubmitted) {
                  if (opt === q.answer) cls += 'border-green-400 bg-green-50 text-green-800';
                  else if (opt === userAnswer && !isCorrect) cls += 'border-red-400 bg-red-50 text-red-800';
                  else cls += 'border-border bg-muted text-muted-foreground';
                } else {
                  cls += 'border-border bg-background text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer';
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(q.id, opt)} disabled={isSubmitted} className={cls}>
                    <span className="flex items-center gap-2">
                      {isSubmitted && opt === q.answer && <CheckCircle size={14} className="text-green-600 shrink-0" />}
                      {isSubmitted && opt === userAnswer && !isCorrect && <XCircle size={14} className="text-red-600 shrink-0" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {isSubmitted && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
              <p className="font-semibold mb-0.5">{isCorrect ? 'Correct!' : `Incorrect — Answer: ${q.answer}`}</p>
              <p className="text-xs opacity-80">{q.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 justify-between">
          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(c => c - 1)} className="pixel-btn px-4 py-2 text-sm">
              ← Previous
            </button>
          )}
          <div className="ml-auto flex gap-2">
            {isSubmitted && currentQ < totalQ - 1 && (
              <button onClick={() => setCurrentQ(c => c + 1)} className="pixel-btn-primary px-5 py-2 text-sm flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            )}
            {isSubmitted && currentQ === totalQ - 1 && (
              <button onClick={finishQuiz} className="pixel-btn-primary px-5 py-2 text-sm flex items-center gap-1">
                Finish <CheckCircle size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (screen === 'results' && session) {
    const total = session.questions.length;
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 60;
    const gateIdx = session.gateId !== 'mixed' ? GATE_TOPICS.indexOf(session.gateId as GateType) : -1;
    const nextGate = gateIdx >= 0 && gateIdx < GATE_TOPICS.length - 1 ? GATE_TOPICS[gateIdx + 1] : null;

    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto animate-pixel-fade">
        <div className="pixel-card p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {pct}%
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Quiz Complete</h2>
          <p className="text-muted-foreground text-sm mb-1">{score} of {total} correct</p>
          {passed
            ? <p className="text-green-600 text-sm font-medium mb-4">Great work! You passed.</p>
            : <p className="text-amber-600 text-sm mb-4">Keep studying — aim for 60% or higher.</p>
          }

          {/* Per-question summary */}
          <div className="text-left mb-6 space-y-1.5 max-h-44 overflow-y-auto">
            {session.questions.map((q, i) => {
              const correct = session.answers[q.id] === q.answer;
              return (
                <div key={q.id} className={`flex items-start gap-2 text-xs p-2 rounded ${correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {correct ? <CheckCircle size={12} className="shrink-0 mt-0.5" /> : <XCircle size={12} className="shrink-0 mt-0.5" />}
                  <span className="flex-1 min-w-0 line-clamp-1">Q{i + 1}: {q.question}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            {nextGate && (
              <button onClick={goToNextLesson} className="pixel-btn-primary py-2.5 w-full flex items-center justify-center gap-2">
                Next Lesson: {nextGate} Gate <ChevronRight size={16} />
              </button>
            )}
            <button onClick={() => startQuiz(session.gateId)} className="pixel-btn py-2 w-full">
              Retake Quiz
            </button>
            <button onClick={() => setScreen('hub')} className="pixel-btn py-2 w-full text-muted-foreground">
              Back to Quiz Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
