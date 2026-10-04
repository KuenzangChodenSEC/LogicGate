import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GATE_TOPICS, getLevelFromXP, getXPForNextLevel, XP_THRESHOLDS, BADGE_DEFS } from '@/lib/storage';
import GateSVG from '@/components/GateSVG';
import { BookOpen, Zap, Gamepad2, HelpCircle, Trophy, Star, TrendingUp, ArrowRight, PlayCircle, Target, Sparkles, CheckCircle2, Mountain, Lightbulb } from 'lucide-react';

const QUICK_ACCESS = [
  { to: '/learn', icon: <BookOpen size={21} />, label: 'Learn', desc: 'Understand the gates step by step' },
  { to: '/simulator', icon: <Zap size={21} />, label: 'Simulate', desc: 'Change inputs and see outputs' },
  { to: '/games', icon: <Gamepad2 size={21} />, label: 'Play', desc: 'Learn through interactive challenges' },
  { to: '/quiz', icon: <HelpCircle size={21} />, label: 'Quiz', desc: 'Check what you have learned' },
];

const HOW_IT_WORKS = [
  { n:'01', icon:<BookOpen size={22}/>, title:'Learn', text:'Start with clear explanations of binary values and logic gates.' },
  { n:'02', icon:<Zap size={22}/>, title:'Explore', text:'Interact with gate diagrams and test different input combinations.' },
  { n:'03', icon:<Target size={22}/>, title:'Practise', text:'Complete truth tables and circuit activities to build confidence.' },
  { n:'04', icon:<Trophy size={22}/>, title:'Track progress', text:'Earn XP, badges and quiz results as you move through the hub.' },
];

const PROVIDES = [
  ['Lessons', 'Short, visual explanations for the main logic gates.'],
  ['Simulator', 'A hands-on place to experiment with inputs and outputs.'],
  ['Practice', 'Truth tables, prediction tasks and circuit challenges.'],
  ['Games', 'Interactive activities that turn revision into practice.'],
  ['Quizzes', 'Quick checks that help you identify what to review.'],
  ['Progress', 'XP, badges and activity tracking in one place.'],
];

export default function HomePage() {
  const { user } = useApp();
  if (!user) return null;
  const xp = user.xp;
  const level = getLevelFromXP(xp);
  const nextXP = getXPForNextLevel(level);
  const prevXP = XP_THRESHOLDS[level - 1] ?? 0;
  const xpPct = nextXP > prevXP ? Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100) : 100;
  const quizDone = Object.keys(user.quizScores).length;
  const totalTopics = GATE_TOPICS.length;
  const badgesCount = user.badges.length;
  const recentBadges = BADGE_DEFS.filter(b => user.badges.includes(b.id)).slice(-3);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-7 py-6 md:py-8 space-y-10 animate-pixel-fade">
      <section className="relative overflow-hidden rounded-2xl border bhutan-frame min-h-[330px] flex items-center" style={{ borderColor:'hsl(var(--border))' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage:"url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Punakha%20dzong.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4f1716]/95 via-[#6d2720]/78 to-[#6d2720]/25" />
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5f1d1b] via-[#e0a22c] to-[#5f1d1b]" />
        <div className="absolute right-6 top-6 opacity-30"><Mountain size={95} /></div>
        <div className="relative z-10 p-7 md:p-10 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#f0c15b] mb-4"><Sparkles size={14}/> Bhutan-inspired learning space</div>
          <p className="text-white/70 text-sm mb-1">Welcome back,</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{user.displayName}</h1>
          <p className="text-white/80 leading-7 max-w-xl">Discover logic gates through visual lessons, interactive experiments, practice activities, games and quizzes — all in one learning hub.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/learn" className="pixel-btn-accent"><BookOpen size={17} className="mr-2"/> Start Learning</Link>
            <Link to="/simulator" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md border border-white/30 bg-white/10 hover:bg-white/15">Try Simulator <ArrowRight size={16} className="ml-2"/></Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label:'Level', value:level, icon:<Star size={17}/> },{ label:'Total XP', value:xp, icon:<TrendingUp size={17}/> },{ label:'Badges', value:badgesCount, icon:<Trophy size={17}/> },{ label:'Quizzes Done', value:`${quizDone}/${totalTopics}`, icon:<HelpCircle size={17}/> }].map(stat => (
          <div key={stat.label} className="pixel-card p-4 text-center bg-card/95"><div className="flex justify-center mb-2 text-accent">{stat.icon}</div><div className="text-xl font-extrabold">{stat.value}</div><div className="text-muted-foreground text-xs mt-1">{stat.label}</div></div>
        ))}
      </section>

      <section className="bhutan-section">
        <div className="flex items-end justify-between mb-4"><div><p className="text-xs uppercase tracking-[.16em] text-accent font-bold">Your learning path</p><h2 className="text-2xl font-extrabold mt-1">Quick Access</h2></div></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACCESS.map(item => <Link key={item.to} to={item.to} className="pixel-card p-5 bg-card/95 group"><div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition">{item.icon}</div><div className="font-bold mb-1">{item.label}</div><div className="text-xs text-muted-foreground leading-5">{item.desc}</div></Link>)}
        </div>
      </section>

      <section className="pixel-card overflow-hidden bg-card/95">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-[.16em] text-accent font-bold">How it works</p>
            <h2 className="text-2xl font-extrabold mt-1 mb-3">A simple path from learning to doing</h2>
            <p className="text-sm text-muted-foreground leading-6 mb-6">The website is organised so you can learn a concept, experiment with it, practise it, and then check your understanding.</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {HOW_IT_WORKS.map(step => <div key={step.n} className="flex gap-3"><div className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">{step.n}</div><div><div className="flex items-center gap-2 font-bold text-sm">{step.icon}{step.title}</div><p className="text-xs text-muted-foreground mt-1 leading-5">{step.text}</p></div></div>)}
            </div>
          </div>
          <div className="min-h-[300px] bg-cover bg-center" style={{ backgroundImage:"linear-gradient(rgba(94,29,27,.35),rgba(94,29,27,.5)), url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Prayer_Flags%2C_Bhutan.jpg')" }} />
        </div>
      </section>

      <section>
        <div className="mb-4"><p className="text-xs uppercase tracking-[.16em] text-accent font-bold">Inside the hub</p><h2 className="text-2xl font-extrabold mt-1">What this website provides</h2></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROVIDES.map(([title,text], i) => <div key={title} className="pixel-card p-5 bg-card/95"><div className="flex items-center gap-3 mb-2"><span className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center"><CheckCircle2 size={16}/></span><h3 className="font-bold">{title}</h3></div><p className="text-xs text-muted-foreground leading-5 pl-11">{text}</p></div>)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4"><div><p className="text-xs uppercase tracking-[.16em] text-accent font-bold">Explore the basics</p><h2 className="text-2xl font-extrabold mt-1">Logic Gate Topics</h2></div><Link to="/learn" className="text-primary text-sm font-semibold hover:underline">View all <ArrowRight size={14} className="inline ml-1"/></Link></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GATE_TOPICS.map(gate => { const score=user.quizScores[gate]; const passed=score!==undefined&&score>=60; return <Link key={gate} to={`/learn/${gate.toLowerCase()}`} className="pixel-card p-4 text-center bg-card/95 hover:-translate-y-0.5 transition-transform"><div className="flex justify-center mb-2"><GateSVG gate={gate} size={38} active/></div><div className="font-bold text-sm mb-1">{gate}</div>{score!==undefined?<span className={`text-xs px-2 py-0.5 rounded-full ${passed?'bg-green-100 text-green-700':'bg-amber-100 text-amber-700'}`}>{score}%</span>:<span className="text-xs text-muted-foreground">Not taken</span>}</Link> })}
        </div>
      </section>

      <section className="pixel-card p-5 bg-card/95">
        <div className="flex items-center justify-between mb-3"><h2 className="font-extrabold">Your XP journey</h2><span className="xp-pill">Level {level}</span></div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2"><span>{xp} XP</span><span>{nextXP} XP to next level</span></div><div className="pixel-progress"><div className="pixel-progress-fill" style={{width:`${xpPct}%`}}/></div>
      </section>

      {recentBadges.length > 0 && <section><h2 className="text-2xl font-extrabold mb-4">Recent Badges</h2><div className="flex gap-3 flex-wrap">{recentBadges.map(b=><div key={b.id} className="pixel-card px-4 py-3 flex items-center gap-3 badge-earned bg-card/95"><span className="text-2xl">{b.icon}</span><div><div className="font-bold text-sm">{b.name}</div><div className="text-muted-foreground text-xs">{b.desc}</div></div></div>)}</div></section>}

      <section className="rounded-2xl overflow-hidden text-white relative min-h-[190px] flex items-center" style={{ backgroundImage:"linear-gradient(90deg,rgba(79,23,22,.95),rgba(101,42,31,.75)), url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taktsang%20Monastery%2C%20Bhutan%2001.jpg')", backgroundSize:'cover', backgroundPosition:'center' }}>
        <div className="p-7 md:p-9"><Lightbulb className="text-[#e8b34c] mb-2" size={24}/><h2 className="text-2xl font-extrabold">Ready to explore?</h2><p className="text-white/75 text-sm mt-1 mb-4">Choose a lesson, simulator, practice task or game and keep building your understanding.</p><Link to="/learn" className="pixel-btn-accent">Continue Learning <ArrowRight size={16} className="ml-2"/></Link></div>
      </section>
    </div>
  );
}
