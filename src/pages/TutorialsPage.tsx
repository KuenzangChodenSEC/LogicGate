import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GATES } from '@/lib/gateData';
import GateSVG from '@/components/GateSVG';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TutorialsPage() {
  const [expanded, setExpanded] = useState<string | null>('intro');

  const INTRO_STEPS = [
    'A logic gate is an electronic device that performs a Boolean operation on one or more binary inputs and produces a single binary output.',
    'Binary means there are only two possible values: 0 (LOW, FALSE, OFF) and 1 (HIGH, TRUE, ON).',
    'Logic gates are the building blocks of all digital circuits — computers, phones, calculators all use them.',
    'We use truth tables to show all possible input combinations and their corresponding output.',
    'Boolean algebra (named after George Boole) is the mathematical system for analyzing logic gate circuits.',
    'The three basic gates are AND, OR, and NOT. All other gates can be derived from these.',
    'NAND and NOR are called universal gates because they can replace any other gate.',
    'XOR (Exclusive OR) detects differences between bits — used in adders and error checking.',
    'XNOR (Exclusive NOR) detects equality between bits — used in comparators.',
    'BUFFER gates strengthen signals without changing their logic value.',
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Tutorials</h1>
        <p className="text-muted-foreground text-sm">Step-by-step guides for each logic gate. No login required.</p>
      </div>

      {/* Intro Tutorial */}
      <TutorialEntry
        id="intro"
        title="Introduction to Logic Gates"
        tag="INTRO"
        tagColor="bg-primary/20 text-primary border-primary"
        desc="What are logic gates? Why do we need them? Learn the fundamentals of digital logic."
        expanded={expanded === 'intro'}
        onToggle={() => setExpanded(expanded === 'intro' ? null : 'intro')}
      >
        <ol className="space-y-3 mt-4">
          {INTRO_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-foreground text-sm pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 p-4 bg-muted rounded-md border border-border">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">Key Formula</p>
          <code className="text-primary text-sm font-mono">Output = f(Inputs) where f is the gate's Boolean function</code>
        </div>
      </TutorialEntry>

      {/* Gate tutorials */}
      {GATES.map(gate => {
        const isSingleInput = ['NOT', 'BUFFER'].includes(gate.id);
        return (
          <TutorialEntry
            key={gate.id}
            id={gate.id}
            title={gate.name}
            tag={gate.id}
            tagColor="bg-muted text-foreground border-border"
            desc={gate.description.slice(0, 100) + '…'}
            expanded={expanded === gate.id}
            onToggle={() => setExpanded(expanded === gate.id ? null : gate.id)}
          >
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center bg-muted rounded-md border border-border p-4">
                <GateSVG gate={gate.id} size={70} active />
                <p className="text-muted-foreground text-xs mt-2 font-medium">Gate Symbol</p>
              </div>
              <div className="bg-muted rounded-md border border-border p-4 flex flex-col justify-center">
                <p className="text-muted-foreground text-xs font-medium mb-2">Boolean Expression</p>
                <code className="text-primary text-lg font-mono font-semibold">{gate.booleanExpression}</code>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="truth-table">
                <thead>
                  <tr>
                    <th>A</th>
                    {!isSingleInput && <th>B</th>}
                    <th>Y (Output)</th>
                  </tr>
                </thead>
                <tbody>
                  {gate.truthTable.map((row, i) => (
                    <tr key={i}>
                      <td>{row.a}</td>
                      {!isSingleInput && <td>{row.b}</td>}
                      <td className={row.out === 1 ? 'text-accent font-bold' : ''}>{row.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Step-by-Step</p>
              <ol className="space-y-2">
                {gate.tutorialSteps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="shrink-0 text-primary font-semibold">{i + 1}.</span>
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-4 p-3 border-l-4 bg-muted rounded-r-md" style={{ borderLeftColor: gate.color }}>
              <p className="text-muted-foreground text-xs font-medium mb-1">Real-World Example</p>
              <p className="text-foreground text-sm">{gate.realWorldExample}</p>
            </div>

            <div className="mt-4">
              <Link to={`/learn/${gate.id.toLowerCase()}`} className="pixel-btn-primary px-4 py-2 text-sm inline-block">
                Full Lesson →
              </Link>
            </div>
          </TutorialEntry>
        );
      })}
    </div>
  );
}

function TutorialEntry({
  id, title, tag, tagColor, desc, expanded, onToggle, children
}: {
  id: string; title: string; tag: string; tagColor: string; desc: string;
  expanded: boolean; onToggle: () => void; children?: React.ReactNode;
}) {
  return (
    <div className="pixel-card mb-4 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${tagColor}`}>{tag}</span>
            <h3 className="text-foreground font-semibold text-sm">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
        <div className="shrink-0 text-muted-foreground mt-1">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-border animate-pixel-fade">
          {children}
        </div>
      )}
    </div>
  );
}
