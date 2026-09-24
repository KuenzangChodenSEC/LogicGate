// localStorage keys
export const KEYS = {
  USERS: 'lglh_users',
  SESSION: 'lglh_session',
  SETTINGS: 'lglh_settings',
} as const;

export interface User {
  id: string;
  identifier: string; // email or phone
  password: string;
  displayName: string;
  avatar: number;
  xp: number;
  level: number;
  badges: string[];
  unlockedTopics: string[];
  quizScores: Record<string, number>;
  practiceStreak: number;
  lastPracticeDate: string;
  gameProgress: Record<string, GameLevelData[]>;
  circuitSave: string | null;
  createdAt: string;
}

export interface GameLevelData {
  completed: boolean;
  bestScore: number;
  stars: number;
}

export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
}

export function storageAvailable(): boolean {
  try {
    const key = '__test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  } catch { return []; }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getSession(): string | null {
  return localStorage.getItem(KEYS.SESSION);
}

export function setSession(userId: string): void {
  localStorage.setItem(KEYS.SESSION, userId);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION);
}

export function getCurrentUser(): User | null {
  const id = getSession();
  if (!id) return null;
  return getUsers().find(u => u.id === id) || null;
}

export function updateUser(updated: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx >= 0) users[idx] = updated;
  else users.push(updated);
  saveUsers(users);
}

export function getSettings(): Settings {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || 'null') || { darkMode: false, soundEnabled: false };
  } catch { return { darkMode: false, soundEnabled: false }; }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
}

// XP thresholds
export const XP_THRESHOLDS = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700];
export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return level;
}
export function getXPForNextLevel(level: number): number {
  return XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1] + 500;
}

// Gate topics in unlock order
export const GATE_TOPICS = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'] as const;
import type { GateType } from './gateData';
export type { GateType };

export function createNewUser(identifier: string, password: string, displayName: string): User {
  const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    identifier,
    password,
    displayName,
    avatar: 1,
    xp: 0,
    level: 1,
    badges: [],
    unlockedTopics: [...GATE_TOPICS], // all topics unlocked from the start
    quizScores: {},
    practiceStreak: 0,
    lastPracticeDate: '',
    gameProgress: {},
    circuitSave: null,
    createdAt: new Date().toISOString(),
  };
}

export function addXP(user: User, amount: number): User {
  const newXP = user.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  return { ...user, xp: newXP, level: newLevel };
}

export function unlockNextTopic(user: User, currentTopic: GateType): User {
  const idx = GATE_TOPICS.indexOf(currentTopic);
  if (idx < 0 || idx >= GATE_TOPICS.length - 1) return user;
  const nextTopic = GATE_TOPICS[idx + 1];
  if (user.unlockedTopics.includes(nextTopic)) return user;
  return { ...user, unlockedTopics: [...user.unlockedTopics, nextTopic] };
}

// Game helpers
export const GAMES = ['gateMatch', 'blitz', 'gatePuzzle', 'boolBuilder', 'maze', 'sorter'] as const;
export type GameId = typeof GAMES[number];

export const GAME_LEVELS = 60; // 60 levels per game

export function getGameProgress(user: User, gameId: GameId): GameLevelData[] {
  const data = user.gameProgress[gameId] || [];
  // ensure array is GAME_LEVELS long
  const result: GameLevelData[] = [];
  for (let i = 0; i < GAME_LEVELS; i++) {
    result.push(data[i] || { completed: false, bestScore: 0, stars: 0 });
  }
  return result;
}

export function setGameLevel(user: User, gameId: GameId, levelIdx: number, data: GameLevelData): User {
  const progress = getGameProgress(user, gameId);
  progress[levelIdx] = data;
  return { ...user, gameProgress: { ...user.gameProgress, [gameId]: progress } };
}

// All levels are always unlocked
export function isLevelUnlocked(_user: User, _gameId: GameId, _levelIdx: number): boolean {
  return true;
}

export function getDifficulty(levelIdx: number): 'Easy' | 'Medium' | 'Hard' | 'Expert' {
  if (levelIdx < 12) return 'Easy';
  if (levelIdx < 25) return 'Medium';
  if (levelIdx < 40) return 'Hard';
  return 'Expert';
}

export function getXPForDifficulty(diff: ReturnType<typeof getDifficulty>): number {
  return { Easy: 10, Medium: 20, Hard: 35, Expert: 50 }[diff];
}

export function getStarsForScore(score: number, maxScore: number): number {
  const ratio = score / maxScore;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  if (ratio > 0) return 1;
  return 0;
}

// Badge definitions
export const BADGE_DEFS = [
  { id: 'first_login', name: 'First Step', desc: 'Logged in for the first time', icon: '🔑' },
  { id: 'complete_and_quiz', name: 'AND Master', desc: 'Completed the AND Gate quiz', icon: '⚡' },
  { id: 'complete_all_quizzes', name: 'Quiz Champion', desc: 'Completed all 8 quizzes', icon: '🏆' },
  { id: 'perfect_quiz', name: 'Perfectionist', desc: 'Scored 100% on any quiz', icon: '💎' },
  { id: 'first_circuit', name: 'Circuit Maker', desc: 'Built your first circuit', icon: '🔌' },
  { id: 'play_all_games', name: 'Gamer', desc: 'Played all 6 games', icon: '🎮' },
  { id: 'level_5', name: 'Rising Star', desc: 'Reached Level 5', icon: '⭐' },
  { id: 'earn_500xp', name: 'XP Hunter', desc: 'Earned 500 total XP', icon: '💰' },
  { id: 'complete_tutorials', name: 'Scholar', desc: 'Completed all tutorials', icon: '📚' },
  { id: 'practice_streak', name: 'Dedicated', desc: 'Practiced 5 sessions in a row', icon: '🔥' },
  { id: 'unlock_all', name: 'Unlocker', desc: 'Unlocked all gate topics', icon: '🗝️' },
  { id: 'game_level_10', name: 'Challenger', desc: 'Reached level 10 in any game', icon: '🎯' },
  { id: 'game_level_50', name: 'Legend', desc: 'Reached level 50 in any game', icon: '👑' },
  { id: 'earn_1000xp', name: 'XP Legend', desc: 'Earned 1000 total XP', icon: '🌟' },
  { id: 'three_star', name: '3-Star Master', desc: 'Got 3 stars on 10 game levels', icon: '✨' },
];

export function checkAndAwardBadges(user: User): { user: User; newBadges: string[] } {
  const newBadges: string[] = [];
  let updated = { ...user };

  const award = (id: string) => {
    if (!updated.badges.includes(id)) {
      updated = addXP(updated, 25);
      updated = { ...updated, badges: [...updated.badges, id] };
      newBadges.push(id);
    }
  };

  // first_login
  award('first_login');

  // quiz-based
  if (updated.quizScores['AND'] !== undefined) award('complete_and_quiz');
  if (GATE_TOPICS.every(t => updated.quizScores[t] !== undefined)) award('complete_all_quizzes');
  if (Object.values(updated.quizScores).some(s => s === 100)) award('perfect_quiz');
  if (updated.unlockedTopics.length === GATE_TOPICS.length) award('unlock_all');

  // level
  if (updated.level >= 5) award('level_5');

  // xp
  if (updated.xp >= 500) award('earn_500xp');
  if (updated.xp >= 1000) award('earn_1000xp');

  // game
  const allGamesPlayed = GAMES.every(g => {
    const prog = getGameProgress(updated, g);
    return prog.some(p => p.completed);
  });
  if (allGamesPlayed) award('play_all_games');

  // game level 10 in any game
  const anyLevel10 = GAMES.some(g => {
    const prog = getGameProgress(updated, g);
    return prog[9]?.completed === true;
  });
  if (anyLevel10) award('game_level_10');

  // game level 50 in any game
  const anyLevel50 = GAMES.some(g => {
    const prog = getGameProgress(updated, g);
    return prog[49]?.completed === true;
  });
  if (anyLevel50) award('game_level_50');

  // 3 stars
  let threeStarCount = 0;
  GAMES.forEach(g => {
    const prog = getGameProgress(updated, g);
    prog.forEach(p => { if (p.stars === 3) threeStarCount++; });
  });
  if (threeStarCount >= 10) award('three_star');

  return { user: updated, newBadges };
}
