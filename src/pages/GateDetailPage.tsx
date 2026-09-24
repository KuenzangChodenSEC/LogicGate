import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { getGateInfo } from '@/lib/gateData';
import { GateType } from '@/lib/gateData';
import GateSVG from '@/components/GateSVG';
import { ArrowLeft, PlayCircle, HelpCircle, Zap, Wrench } from 'lucide-react';

export default function GateDetailPage() {
  const { gateId } = useParams<{ gateId: string }>();
  const { user } = useApp();

  const gate = getGateInfo((gateId?.toUpperCase() as GateType) || 'AND');
  if (!user) return null;

  const isSingleInput = ['NOT', 'BUFFER'].includes(gate.id);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to Learn
      </Link>

      {/* Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="pixel-card p-3">
          <GateSVG gate={gate.id} size={56} active />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{gate.name}</h1>
          <code className="text-primary text-sm bg-primary/8 px-2 py-0.5 rounded font-mono">
            {gate.booleanExpression}
          </code>
        </div>
      </div>

      <div className="pixel-divider mb-6" />

      {/* Description */}
      <div className="pixel-card p-5 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Description</h2>
        <p className="text-foreground leading-relaxed">{gate.description}</p>
      </div>

      {/* Boolean Expression + Symbol */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="pixel-card p-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Boolean Expression</h2>
          <div className="bg-muted p-4 rounded-md text-center">
            <code className="text-primary text-lg font-mono font-semibold">{gate.booleanExpression}</code>
          </div>
        </div>
        <div className="pixel-card p-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Gate Symbol</h2>
          <div className="flex justify-center items-center py-4">
            <GateSVG gate={gate.id} size={90} active />
          </div>
        </div>
      </div>

      {/* Truth Table */}
      <div className="pixel-card p-5 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Truth Table</h2>
        <div className="overflow-x-auto">
          <table className="truth-table">
            <thead>
              <tr>
                <th>A</th>
                {!isSingleInput && <th>B</th>}
                <th>Output (Y)</th>
              </tr>
            </thead>
            <tbody>
              {gate.truthTable.map((row, i) => (
                <tr key={i}>
                  <td className={row.a === 1 ? 'text-primary font-semibold' : ''}>{row.a}</td>
                  {!isSingleInput && <td className={(row.b ?? 0) === 1 ? 'text-primary font-semibold' : ''}>{row.b}</td>}
                  <td className={`font-bold ${row.out === 1 ? 'text-accent' : 'text-foreground'}`}>{row.out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-world example */}
      <div className="pixel-card p-5 mb-4 border-l-4" style={{ borderLeftColor: gate.color }}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Real-World Example</h2>
        <p className="text-foreground">{gate.realWorldExample}</p>
      </div>

      {/* Tutorial Steps */}
      <div className="pixel-card p-5 mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Step-by-Step Notes</h2>
        <ol className="space-y-3">
          {gate.tutorialSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-foreground text-sm pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Embedded video */}
      <div className="pixel-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <PlayCircle size={14} className="text-primary" /> Video Tutorial
        </h2>
        <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${gate.videoId}?rel=0`}
            title={`${gate.name} Tutorial`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/quiz/${gate.id.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <HelpCircle size={14} /> Take {gate.id} Quiz
        </Link>
        <Link
          to="/simulator"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          <Zap size={14} /> Simulator
        </Link>
        <Link
          to="/practice"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          <Wrench size={14} /> Practice
        </Link>
      </div>
    </div>
  );
}

