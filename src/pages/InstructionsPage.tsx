import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Zap, Target, Gamepad2, Trophy, LockKeyhole, ChartNoAxesColumnIncreasing } from 'lucide-react';

const steps = [
  { icon: BookOpen, title: '1. Learn the basics', text: 'Open Learn to read short explanations of AND, OR, NOT and other logic gates. Start with a topic you want to understand.' },
  { icon: Zap, title: '2. Experiment', text: 'Use the Simulator or Circuit Builder to change inputs, connect gates and see how the output changes.' },
  { icon: Target, title: '3. Practise and take quizzes', text: 'Try Practice activities, then take a quiz to check what you remember. Review a lesson if a question feels difficult.' },
  { icon: Gamepad2, title: '4. Play the games', text: 'Choose a game and start at Level 1. Finish a level to unlock the next level in that same game. Locked levels open one at a time.' },
  { icon: Trophy, title: '5. Earn rewards', text: 'Successful game challenges award XP and stars. Keep practising to increase your level and earn badges.' },
  { icon: ChartNoAxesColumnIncreasing, title: '6. Check your progress', text: 'Visit Progress to see completed game levels, stars, quiz results and XP. Your progress is saved in this browser for your account.' },
];

export default function InstructionsPage() {
  return <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pixel-fade">
    <div className="mb-7"><p className="text-xs uppercase tracking-[.16em] text-accent font-bold mb-2">Quick start guide</p><h1 className="text-3xl font-extrabold mb-2">How to use LogicLab</h1><p className="text-sm text-muted-foreground leading-6">Follow these simple steps to learn logic gates, try challenges and track how far you have come.</p></div>
    <div className="rounded-xl overflow-hidden border border-border mb-5 h-36 sm:h-48 bg-cover bg-center" role="img" aria-label="Uploaded LogicLab learning illustration" style={{ backgroundImage: "url('/LogicGate/images/PD4.png')" }} />
    <div className="grid sm:grid-cols-2 gap-4">{steps.map(({icon: Icon, title, text}) => <section key={title} className="pixel-card p-5 bg-card"><div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon size={22}/></div><h2 className="font-bold mb-2">{title}</h2><p className="text-sm text-muted-foreground leading-6">{text}</p></section>)}</div>
    <section className="pixel-card p-5 mt-5 border-l-4 border-l-amber-400"><div className="flex items-start gap-3"><LockKeyhole className="text-amber-500 mt-1" size={20}/><div><h2 className="font-bold mb-1">Remember</h2><p className="text-sm text-muted-foreground leading-6">You only need to unlock levels in order. If a level is locked, complete the previous level first. Game XP and completed levels contribute to your Progress page.</p></div></div></section>
    <div className="flex flex-wrap gap-3 mt-6"><Link to="/learn" className="pixel-btn-primary inline-flex items-center gap-2">Start learning <ArrowRight size={16}/></Link><Link to="/games" className="pixel-btn inline-flex items-center gap-2">Explore games <Gamepad2 size={16}/></Link></div>
  </div>;
}
