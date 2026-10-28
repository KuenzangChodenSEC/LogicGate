import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GATES, LEARNING_MODULES } from '@/lib/gateData';
import { GATE_TOPICS } from '@/lib/storage';
import GateSVG from '@/components/GateSVG';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function LearnPage() {
  const { user } = useApp();
  const [openLesson, setOpenLesson] = useState<string | null>('tt-intro');
  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Logic Gates</h1>
        <p className="text-muted-foreground text-sm">Select any gate to study its behavior, truth table, and real-world uses.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground mb-1">Explore Individual Logic Gates</h2>
        <p className="text-muted-foreground text-sm">Your original gate lessons, truth tables, quizzes, and simulator are still available below.</p>
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

      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-1">Structured Learning Pathway</h2>
          <p className="text-muted-foreground text-sm">Follow the five modules in order. Each module builds on skills learned in the previous one.</p>
        </div>
        <div className="space-y-5">
          {[...LEARNING_MODULES].sort((a, b) => a.order - b.order).map((module) => (
            <section key={module.id} className="pixel-card p-4 md:p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold">{module.order}</span>
                <div>
                  <h3 className="font-bold text-foreground">{module.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{module.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{module.lessons.length} lessons</p>
                </div>
              </div>
              <div className="space-y-3">
                {module.lessons.map((lesson, index) => {
                  const expanded = openLesson === lesson.id;
                  return (
                    <article key={lesson.id} className="border border-border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenLesson(expanded ? null : lesson.id)}
                        aria-expanded={expanded}
                        className="w-full flex items-start gap-3 p-3 md:p-4 text-left hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-xs font-semibold text-primary bg-primary/10 rounded px-2 py-1">{module.order}.{index + 1}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-foreground">{lesson.title}</span>
                          <span className="block text-sm text-muted-foreground mt-1">{lesson.description}</span>
                        </span>
                        {expanded ? <ChevronUp size={17} className="shrink-0 mt-1" /> : <ChevronDown size={17} className="shrink-0 mt-1" />}
                      </button>
                      {expanded && (
                        <div className="border-t border-border p-4 space-y-5">
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-2">Learning objectives</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                              {lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-2">Learn the concept</h4>
                            <div className="space-y-3 text-sm text-foreground leading-relaxed">
                              {lesson.explanation.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                            </div>
                          </div>
                          {lesson.expression && (
                            <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">Key expression</p>
                              <code className="font-mono text-primary text-sm break-words">{lesson.expression}</code>
                            </div>
                          )}
                          {lesson.example.length > 0 && (
                            <div>
                              <h4 className="text-sm font-bold text-foreground mb-2">Worked example</h4>
                              <ol className="list-decimal pl-5 space-y-2 text-sm text-foreground">
                                {lesson.example.map((step, i) => <li key={i}>{step}</li>)}
                              </ol>
                            </div>
                          )}
                          {lesson.table && (
                            <div className="overflow-x-auto">
                              <table className="truth-table min-w-full">
                                <thead><tr>{lesson.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                                <tbody>
                                  {lesson.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={`${i}-${j}`} className={j === row.length - 1 && cell === '1' ? 'font-bold text-accent' : ''}>{cell}</td>)}</tr>)}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-2">Try it yourself</h4>
                            <div className="space-y-3">
                              {lesson.practice.map((item, i) => (
                                <div key={i} className="rounded-md border border-border p-3">
                                  <p className="text-sm font-medium text-foreground">{item.question}</p>
                                  <details className="mt-2">
                                    <summary className="cursor-pointer text-sm text-primary font-medium">Show answer and explanation</summary>
                                    <div className="mt-2 text-sm space-y-1">
                                      <p className="text-foreground"><strong>Answer:</strong> {item.answer}</p>
                                      <p className="text-muted-foreground">{item.explanation}</p>
                                    </div>
                                  </details>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2"><CheckCircle2 size={15} className="text-primary" /> Key takeaways</h4>
                            <ul className="space-y-1 text-sm text-foreground">
                              {lesson.summary.map((item) => <li key={item}>• {item}</li>)}
                            </ul>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2"><PlayCircle size={15} className="text-primary" /> Video lesson</h4>
                            <p className="text-sm font-medium text-foreground mt-2">{lesson.video.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{lesson.video.description}</p>
                            <a href={lesson.video.url} target="_blank" rel="noreferrer" className="inline-flex items-center mt-3 text-sm text-primary underline underline-offset-4">Find/watch on YouTube ↗</a>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

    </div>
  );
}
