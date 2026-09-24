import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GATES } from '@/lib/gateData';
import { GATE_TOPICS } from '@/lib/storage';
import GateSVG from '@/components/GateSVG';
import { ChevronRight, BookOpen, HelpCircle } from 'lucide-react';

export default function LearnPage() {
  const { user } = useApp();
  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Logic Gates</h1>
        <p className="text-muted-foreground text-sm">Select any gate to study its behavior, truth table, and real-world uses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GATE_TOPICS.map((gateId) => {
          const gate = GATES.find(g => g.id === gateId)!;
          const quizScore = user.quizScores[gateId];
          const passed = quizScore !== undefined && quizScore >= 60;

          return (
            <div key={gateId} className="pixel-card p-4 flex items-start gap-4">
              <div className="shrink-0 mt-1">
                <GateSVG gate={gateId} size={48} active />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{gate.name}</h3>
                  {quizScore !== undefined && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      Quiz: {quizScore}%
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{gate.description.slice(0, 90)}…</p>
                <code className="text-primary text-xs bg-primary/5 px-2 py-0.5 rounded font-mono">
                  {gate.booleanExpression}
                </code>
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to={`/learn/${gateId.toLowerCase()}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <BookOpen size={13} /> Study
                  </Link>
                  <Link
                    to={`/quiz/${gateId.toLowerCase()}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <HelpCircle size={13} /> Quiz
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
