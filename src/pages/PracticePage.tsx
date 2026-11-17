import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getGateInfo, type GateType } from '@/lib/gateData';
import { GATE_TOPICS } from '@/lib/storage';

type Mode = 'truth' | 'boolean';

export default function PracticePage() {
  const { user, awardXP } = useApp();
  const availableBooleanGates = user
    ? GATE_TOPICS.filter(g => user.unlockedTopics.includes(g))
    : [];
  const [mode, setMode] = useState<Mode>('truth');
  const [gateId, setGateId] = useState<GateType>('AND');
  const [targetRow, setTargetRow] = useState(0);
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const truthTable = getGateInfo(gateId).truthTable;
  const isSingleInput = gateId === 'NOT';
  const targetTruthRow = truthTable[targetRow] ?? truthTable[0];

  function randomize() {
    setTargetRow(Math.floor(Math.random() * truthTable.length));
    setAnswer('');
    setFeedback(null);
  }

  function checkAnswer() {
    if (answer === '' || feedback || !targetTruthRow) return;
    const userOut = parseInt(answer, 10);
    const correctOutput = targetTruthRow.out;
    const correct = userOut === correctOutput;
    const inputValues = targetTruthRow.b === undefined
      ? `A=${targetTruthRow.a}`
      : `A=${targetTruthRow.a}, B=${targetTruthRow.b}`;
    setSessionTotal(t => t + 1);
    if (correct) {
      setSessionCorrect(c => c + 1);
      awardXP(5, 'Practice correct answer');
    }
    setFeedback({
      correct,
      msg: correct
        ? `Correct! ${gateId} outputs ${correctOutput} when ${inputValues}.`
        : `Not quite. ${gateId} outputs ${correctOutput} when ${inputValues}.`,
    });
  }

  // Boolean mode state
  const [boolGate, setBoolGate] = useState<GateType>(
    () => availableBooleanGates[Math.floor(Math.random() * availableBooleanGates.length)] ?? 'AND',
  );
  const [boolAnswer, setBoolAnswer] = useState('');
  const [boolFeedback, setBoolFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const GATE_EXPRESSIONS: Record<GateType, string> = {
    AND: 'A · B', OR: 'A + B', NOT: "A'", NAND: "(A · B)'",
    NOR: "(A + B)'", XOR: 'A ⊕ B', XNOR: "(A ⊕ B)'",
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

  function nextBooleanQuestion() {
    const choices = availableBooleanGates.filter(g => g !== boolGate);
    const nextGate = choices[Math.floor(Math.random() * choices.length)]
      ?? availableBooleanGates[0];
    if (nextGate) setBoolGate(nextGate);
    setBoolAnswer('');
    setBoolFeedback(null);
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
                <button key={g} onClick={() => { setGateId(g); setTargetRow(0); setFeedback(null); setAnswer(''); }}
                  className={`px-3 py-1.5 text-xs rounded border font-medium transition-colors ${gateId === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:border-primary'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border p-5">
            <p className="text-foreground text-sm font-medium mb-3 text-center">
              Complete the missing output in the {gateId} truth table.
            </p>
            <div className="overflow-x-auto">
              <table className="mx-auto w-full max-w-sm table-fixed border-collapse text-center">
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th scope="col" className="px-4 py-2 font-semibold">A</th>
                    {!isSingleInput && <th scope="col" className="px-4 py-2 font-semibold">B</th>}
                    <th scope="col" className="px-4 py-2 font-semibold">Y</th>
                  </tr>
                </thead>
                <tbody>
                  {truthTable.map((row, index) => {
                    const isTarget = index === targetRow;
                    return (
                      <tr
                        key={`${row.a}-${row.b ?? ''}`}
                        className={`border-b border-border/60 last:border-0 ${isTarget ? 'bg-primary/10' : ''}`}
                      >
                        <td className={`px-4 py-2 ${isTarget ? 'font-bold text-primary' : ''}`}>{row.a}</td>
                        {!isSingleInput && <td className={`px-4 py-2 ${isTarget ? 'font-bold text-primary' : ''}`}>{row.b}</td>}
                        <td className={`px-4 py-2 font-bold ${isTarget ? 'text-primary' : ''}`}>
                          {isTarget ? (feedback ? row.out : answer || '?') : row.out}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground text-xs mt-3 text-center">
              Choose the missing Y value for the highlighted input row.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            {['0', '1'].map(val => (
              <button key={val} onClick={() => setAnswer(val)} disabled={!!feedback}
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
            <button onClick={checkAnswer} disabled={!answer || !!feedback}
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
          <div className="bg-muted rounded-lg border border-border p-5 text-center">
            <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wide">Which gate does this expression represent?</p>
            <code className="text-primary text-2xl font-mono font-semibold">Y = {GATE_EXPRESSIONS[boolGate]}</code>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableBooleanGates.map(g => (
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
            <button onClick={nextBooleanQuestion}
              className="pixel-btn px-6 py-2 text-sm">
              Next Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
