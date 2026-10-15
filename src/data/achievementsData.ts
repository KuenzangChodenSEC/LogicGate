import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Silicon Spark',
    desc: 'Completed your very first logic gate lesson!',
    iconName: 'Zap',
    xp: 60,
    category: 'Lessons'
  },
  {
    id: 'circuit_architect',
    title: 'Circuit Builder',
    desc: 'Simulated 5 unique circuits in the interactive simulator.',
    iconName: 'Cpu',
    xp: 100,
    category: 'Simulator'
  },
  {
    id: 'quiz_master',
    title: 'Logic Whiz',
    desc: 'Scored 80% or higher on a module quiz.',
    iconName: 'Award',
    xp: 120,
    category: 'Lessons'
  },
  {
    id: 'quiz_perfect',
    title: 'Perfect Truth',
    desc: 'Achieved a flawless 100% score on the 10-question exam!',
    iconName: 'Star',
    xp: 200,
    category: 'Lessons'
  },
  {
    id: 'detective_10',
    title: 'Gate Inspector',
    desc: 'Cleared 10 levels of Truth Detective.',
    iconName: 'Search',
    xp: 150,
    category: 'Games'
  },
  {
    id: 'detective_40',
    title: 'Master Detective',
    desc: 'Conquered all 40 levels of Truth Detective!',
    iconName: 'Crown',
    xp: 500,
    category: 'Games'
  },
  {
    id: 'rush_10',
    title: 'Quick Reflexes',
    desc: 'Solved 10 fast-paced rounds in Logic Rush.',
    iconName: 'Flame',
    xp: 150,
    category: 'Games'
  },
  {
    id: 'rush_40',
    title: 'Speed of Light',
    desc: 'Finished all 40 levels of Logic Rush!',
    iconName: 'Rocket',
    xp: 500,
    category: 'Games'
  },
  {
    id: 'defuser_10',
    title: 'Wire Specialist',
    desc: 'Successfully defused 10 circuits before overload.',
    iconName: 'ShieldCheck',
    xp: 150,
    category: 'Games'
  },
  {
    id: 'defuser_40',
    title: 'Chief Demolitionist',
    desc: 'Disarmed all 40 levels of Circuit Defuser!',
    iconName: 'Trophy',
    xp: 500,
    category: 'Games'
  },
  {
    id: 'streak_3',
    title: 'Consistent Current',
    desc: 'Maintained a 3-day learning streak.',
    iconName: 'Activity',
    xp: 100,
    category: 'Streaks'
  },
  {
    id: 'universal_sage',
    title: 'Universal Gate Master',
    desc: 'Mastered the NAND & NOR universal synthesis lesson.',
    iconName: 'CheckCircle',
    xp: 180,
    category: 'Lessons'
  }
];
