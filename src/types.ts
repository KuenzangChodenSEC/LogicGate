export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

export interface Lesson {
  id: string;
  title: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  shortDescription: string;
  analogy: string;
  explanation: string;
  realWorldExample: string;
  booleanExpr: string;
  ruleSummary: string;
  truthTable: {
    headers: string[];
    rows: (string | number)[][];
  };
  videoUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export interface DetectiveLevel {
  level: number;
  title: string;
  gateType: GateType;
  target: number;
  description: string;
  difficulty: string;
  inputsNeeded: string[];
  hint: string;
}

export interface RushLevel {
  level: number;
  gate: GateType;
  inputA: number;
  inputB: number;
  correct: number;
  timeLimit: number;
}

export interface DefuserLevel {
  level: number;
  switchCount: number;
  targetCombo: number[];
  timerSec: number;
  requiredVoltage: string;
  codeHint: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  xp: number;
  category: 'Lessons' | 'Games' | 'Simulator' | 'Streaks';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isGuest: boolean;
  avatarId: string;
}
