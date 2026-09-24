import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { GateType, evaluateGate } from '@/lib/gateData';
import { GATE_TOPICS } from '@/lib/storage';
import GateSVG from '@/components/GateSVG';

type Mode = 'truth' | 'boolean';

export default function PracticePage() {
  const [mode, setMode] = useState<Mode>('truth');
  const [gateId, setGateId] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const { user, awardXP } = useApp();


  const isSingleInput = ['NOT', 'BUFFER'].includes(gateId);
  const correctOutput = evaluateGate(gateId, inputA, isSingleInput ? undefined : inputB);

  function randomize() {
    setInputA(Math.random() > 0.5 ? 1 : 0);
    setInputB(Math.random() > 0.5 ? 1 : 0);
    setAnswer('');
    setFeedback(null);
  }

  function checkAnswer() {
    if (answer === '') return;
    const userOut = parseInt(answer, 10);
    const correct = userOut === correctOutput;
    setSessionTotal(t => t + 1);
    if (correct) {
      setSessionCorrect(c => c + 1);
      awardXP(5, 'Practice correct answer');
    }
    setFeedback({
      correct,
      msg: correct
        ? `Correct! ${gateId} with A=${inputA}${!isSingleInput ? `, B=${inputB}` : ''} → ${correctOutput}`
        : `Not quite. ${gateId} with A=${inputA}${!isSingleInput ? `, B=${inputB}` : ''} → ${correctOutput}. Try again!`,
    });
  }

  // Boolean mode state
  const [boolGate, setBoolGate] = useState<GateType>('AND');
  const [boolAnswer, setBoolAnswer] = useState('');
  const [boolFeedback, setBoolFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const GATE_EXPRESSIONS: Record<GateType, string> = {
    AND: 'A · B', OR: 'A + B', NOT: "A'", NAND: "(A · B)'",
    NOR: "(A + B)'", XOR: 'A ⊕ B', XNOR: "(A ⊕ B)'", BUFFER: 'A',
  };

  function checkBoolAnswer() {
    const correct = boolAnswer === boolGate;
    setBoolFeedback({
      correct,
      msg: correct
        ? `Correct! ${GATE_EXPRESSIONS[boolGate]} represents the ${boolGate} gate.`
        : `Not quite. ${GATE_EXPRESSIONS[boolGate]} represents the ${boolGate} gate.`,
    });
    if (correct) awardXP(5, 'Boolean practice');
  }

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Practice</h1>
        <p className="text-muted-foreground text-sm">Test your knowledge with truth table and Boolean expression practice.</p>
      </div>

      {/* Mode selector */}
      <div className="flex mb-6 border border-border rounded-lg overflow-hidden max-w-xs">
        {(['truth', 'boolean'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setFeedback(null); setBoolFeedback(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}>
            {m === 'truth' ? 'Truth Table' : 'Boolean Expr'}
          </button>
        ))}
      </div>

      {/* Session stats */}
      {sessionTotal > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Session: {sessionCorrect}/{sessionTotal}</span>
          <div className="flex-1 pixel-progress">
            <div className="pixel-progress-fill bg-accent" style={{ width: `${Math.round((sessionCorrect / sessionTotal) * 100)}%` }} />
          </div>
        </div>
      )}

      {mode === 'truth' ? (
        <div className="pixel-card p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Choose Gate</label>
            <div className="flex flex-wrap gap-2">
              {GATE_TOPICS.filter(g => user.unlockedTopics.includes(g)).map(g => (
                <button key={g} onClick={() => { setGateId(g); setFeedback(null); setAnswer(''); }}
                  className={`px-3 py-1.5 text-xs rounded border font-medium transition-colors ${gateId === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg border border-border p-5 text-center">
            <div className="flex justify-center mb-3">
              <GateSVG gate={gateId} size={70} active inputA={inputA} inputB={isSingleInput ? undefined : inputB} />
            </div>
            <p className="text-foreground text-sm font-medium mb-1">
              {gateId} gate: A = <span className="text-primary font-bold">{inputA}</span>
              {!isSingleInput && <>, B = <span className="text-primary font-bold">{inputB}</span></>}
            </p>
            <p className="text-muted-foreground text-xs">What is the output (Y)?</p>
          </div>

          <div className="flex gap-4 justify-center">
            {['0', '1'].map(val => (
              <button key={val} onClick={() => setAnswer(val)}
                className={`w-20 py-4 text-2xl font-bold rounded-lg border-2 transition-colors ${
                  answer === val ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-primary'
                }`}>
                {val}
              </button>
            ))}
          </div>

          {feedback && (
            <div className={`rounded-lg p-3 text-sm font-medium ${feedback.correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {feedback.correct ? '✓ ' : '✗ '}{feedback.msg}
              {feedback.correct && <span className="ml-2 text-primary text-xs font-bold">+5 XP</span>}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={checkAnswer} disabled={!answer}
              className="pixel-btn-primary px-6 py-2 text-sm disabled:opacity-50">
              Check
            </button>
            <button onClick={randomize} className="pixel-btn px-6 py-2 text-sm">
              Next Question
            </button>
          </div>
        </div>
      ) : (
        <div className="pixel-card p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Choose Expression</label>
            <div className="flex flex-wrap gap-2">
              {GATE_TOPICS.filter(g => user.unlockedTopics.includes(g)).map(g => (
                <button key={g} onClick={() => { setBoolGate(g); setBoolFeedback(null); setBoolAnswer(''); }}
                  className={`px-3 py-1.5 text-xs rounded border font-medium transition-colors ${boolGate === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg border border-border p-5 text-center">
            <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wide">Which gate does this expression represent?</p>
            <code className="text-primary text-2xl font-mono font-semibold">Y = {GATE_EXPRESSIONS[boolGate]}</code>
          </div>

          <div className="flex flex-wrap gap-2">
            {GATE_TOPICS.filter(g => user.unlockedTopics.includes(g)).map(g => (
              <button key={g} onClick={() => setBoolAnswer(g)}
                className={`px-4 py-2 text-sm rounded border font-medium transition-colors ${boolAnswer === g ? 'bg-accent text-accent-foreground border-accent' : 'bg-background text-foreground border-border hover:border-accent'}`}>
                {g}
              </button>
            ))}
          </div>

          {boolFeedback && (
            <div className={`rounded-lg p-3 text-sm font-medium ${boolFeedback.correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {boolFeedback.correct ? '✓ ' : '✗ '}{boolFeedback.msg}
              {boolFeedback.correct && <span className="ml-2 text-primary text-xs font-bold">+5 XP</span>}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={checkBoolAnswer} disabled={!boolAnswer}
              className="pixel-btn-primary px-6 py-2 text-sm disabled:opacity-50">
              Check
            </button>
            <button onClick={() => { setBoolFeedback(null); setBoolAnswer(''); }}
              className="pixel-btn px-6 py-2 text-sm">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
