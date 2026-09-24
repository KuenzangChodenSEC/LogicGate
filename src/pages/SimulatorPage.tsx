import React, { useState } from 'react';
import { GATES, GateType, evaluateGate } from '@/lib/gateData';

export default function SimulatorPage() {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const gate = GATES.find(g => g.id === selectedGate)!;
  const isSingleInput = ['NOT', 'BUFFER'].includes(selectedGate);
  const output = evaluateGate(selectedGate, inputA, isSingleInput ? undefined : inputB);

  function findHighlightedRow() {
    return gate.truthTable.findIndex(row => {
      if (isSingleInput) return row.a === inputA;
      return row.a === inputA && row.b === inputB;
    });
  }
  const highlightedRow = findHighlightedRow();

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Gate Simulator</h1>
        <p className="text-muted-foreground text-sm">Toggle inputs and see the output in real time.</p>
      </div>

      {/* Gate selector */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Select Gate</label>
        <div className="flex flex-wrap gap-2">
          {GATES.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelectedGate(g.id); setInputA(0); setInputB(0); }}
              className={`pixel-btn px-3 py-1.5 text-sm ${selectedGate === g.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
            >
              {g.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="pixel-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Inputs &amp; Output</h3>

          <div className="flex items-center gap-4 mb-3">
            <span className="w-6 text-foreground font-bold text-sm">A</span>
            <button
              onClick={() => setInputA(v => v === 0 ? 1 : 0)}
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 font-semibold text-sm transition-colors ${
                inputA === 1 ? 'bg-accent text-accent-foreground border-accent' : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {inputA === 1 ? 'ON (1)' : 'OFF (0)'}
            </button>
          </div>

          {!isSingleInput && (
            <div className="flex items-center gap-4 mb-3">
              <span className="w-6 text-foreground font-bold text-sm">B</span>
              <button
                onClick={() => setInputB(v => v === 0 ? 1 : 0)}
                className={`flex items-center gap-2 px-4 py-2 rounded border-2 font-semibold text-sm transition-colors ${
                  inputB === 1 ? 'bg-accent text-accent-foreground border-accent' : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {inputB === 1 ? 'ON (1)' : 'OFF (0)'}
              </button>
            </div>
          )}

          <div className="border-t border-border pt-4 mt-4 flex items-center gap-4">
            <span className="text-foreground font-semibold text-sm">Output Y =</span>
            <div className={`w-14 h-14 flex items-center justify-center rounded-lg border-2 text-2xl font-bold transition-colors ${
              output === 1 ? 'bg-accent border-accent text-accent-foreground' : 'bg-muted border-border text-muted-foreground'
            }`}>
              {output}
            </div>
            <span className={`text-sm font-medium ${output === 1 ? 'text-accent' : 'text-muted-foreground'}`}>
              {output === 1 ? 'HIGH / TRUE' : 'LOW / FALSE'}
            </span>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-md border border-border">
            <code className="text-primary text-sm font-mono">{gate.booleanExpression}</code>
          </div>
        </div>

        {/* Truth table with highlighting */}
        <div className="pixel-card p-5">
          <h3 className="font-semibold text-foreground text-sm mb-4">Truth Table</h3>
          <div className="overflow-x-auto">
            <table className="truth-table w-full">
              <thead>
                <tr><th>A</th>{!isSingleInput && <th>B</th>}<th>Y</th></tr>
              </thead>
              <tbody>
                {gate.truthTable.map((row, i) => (
                  <tr key={i} className={i === highlightedRow ? 'highlighted' : ''}>
                    <td className={i === highlightedRow ? 'font-bold text-primary' : ''}>{row.a}</td>
                    {!isSingleInput && <td className={i === highlightedRow ? 'font-bold text-primary' : ''}>{row.b}</td>}
                    <td className={`font-bold ${row.out === 1 ? 'text-accent' : ''}`}>{row.out}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {highlightedRow >= 0 && (
            <p className="mt-2 text-xs text-primary">↑ Current state highlighted</p>
          )}
        </div>
      </div>

      {/* Circuit state visual */}
      <div className="mt-6 pixel-card px-6 py-4 flex items-center gap-4 flex-wrap">
        <span className="text-muted-foreground text-sm">Circuit state:</span>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full border-2 transition-all ${inputA === 1 ? 'bg-primary border-primary' : 'bg-muted border-border'}`} />
          <span className="text-muted-foreground text-sm">A</span>
        </div>
        {!isSingleInput && (
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full border-2 transition-all ${inputB === 1 ? 'bg-primary border-primary' : 'bg-muted border-border'}`} />
            <span className="text-muted-foreground text-sm">B</span>
          </div>
        )}
        <span className="text-muted-foreground text-sm">→ {selectedGate} →</span>
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
            output === 1 ? 'bg-accent border-accent text-accent-foreground' : 'bg-muted border-border text-muted-foreground'
          }`}>{output}</div>
          <span className="text-muted-foreground text-sm">Y</span>
        </div>
      </div>
    </div>
  );
}
