import type { GateType, DetectiveLevel, RushLevel, DefuserLevel } from '../types';

export const evalGate = (type: GateType, a: number, b: number): number => {
  switch (type) {
    case 'AND': return (a && b) ? 1 : 0;
    case 'OR': return (a || b) ? 1 : 0;
    case 'XOR': return (a ^ b) ? 1 : 0;
    case 'NAND': return !(a && b) ? 1 : 0;
    case 'NOR': return !(a || b) ? 1 : 0;
    case 'XNOR': return (a === b) ? 1 : 0;
    case 'NOT': return a === 0 ? 1 : 0;
    default: return 0;
  }
};

// 40 Levels of Truth Detective
export const getDetectiveLevels = (): DetectiveLevel[] => {
  const gates: GateType[] = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'];
  const levels: DetectiveLevel[] = [];

  for (let i = 1; i <= 40; i++) {
    const gateType = gates[(i - 1) % gates.length];
    const is3Input = i > 15;
    // Determine required target output
    const target = (i % 3 === 0) ? 0 : 1;
    
    let diff = 'Cadet';
    if (i > 12 && i <= 26) diff = 'Officer';
    else if (i > 26) diff = 'Mastermind';

    let hint = '';
    if (gateType === 'AND') hint = target === 1 ? 'Both inputs must be ON!' : 'At least one input must be 0.';
    else if (gateType === 'OR') hint = target === 1 ? 'Turn any input ON.' : 'Both inputs must be turned OFF.';
    else if (gateType === 'XOR') hint = target === 1 ? 'Inputs must be DIFFERENT.' : 'Inputs must MATCH.';
    else if (gateType === 'NAND') hint = target === 0 ? 'Only turns 0 if BOTH are 1.' : 'Keep at least one switch 0.';
    else if (gateType === 'NOR') hint = target === 1 ? 'Only 1 if BOTH are 0!' : 'Turn on any switch.';
    else if (gateType === 'XNOR') hint = target === 1 ? 'Make inputs MATCH each other.' : 'Make inputs DIFFERENT.';

    levels.push({
      level: i,
      title: `Sector ${String(i).padStart(2, '0')}: The ${gateType} Enigma`,
      gateType,
      target,
      description: is3Input 
        ? `Configure input switches to produce Output Q = ${target} for this logic sector.` 
        : `Adjust Switch A and Switch B to force the ${gateType} gate into Output Q = ${target}.`,
      difficulty: diff,
      inputsNeeded: is3Input ? ['A', 'B', 'C'] : ['A', 'B'],
      hint
    });
  }

  return levels;
};

// 40 Levels of Logic Rush
export const getRushLevels = (): RushLevel[] => {
  const gates: GateType[] = ['AND', 'OR', 'XOR', 'NAND', 'NOR'];
  const levels: RushLevel[] = [];

  for (let i = 1; i <= 40; i++) {
    const gate = gates[(i - 1) % gates.length];
    const a = (i % 2 === 0) ? 1 : 0;
    const b = (Math.floor(i / 2) % 2 === 0) ? 1 : 0;
    const correct = evalGate(gate, a, b);

    // Timer scales from 12s down to 4.5s
    const timeLimit = Math.max(4, Math.round(12 - (i * 0.2)));

    levels.push({
      level: i,
      gate,
      inputA: a,
      inputB: b,
      correct,
      timeLimit
    });
  }

  return levels;
};

// 40 Levels of Circuit Defuser
export const getDefuserLevels = (): DefuserLevel[] => {
  const levels: DefuserLevel[] = [];

  for (let i = 1; i <= 40; i++) {
    const switchCount = i <= 12 ? 3 : i <= 26 ? 4 : 5;
    
    // Deterministic bit combination
    const targetCombo: number[] = [];
    for (let c = 0; c < switchCount; c++) {
      const bit = ((i * 3) + (c * 2) + 1) % 2;
      targetCombo.push(bit);
    }

    const timerSec = Math.max(8, 25 - Math.floor(i * 0.4));
    const codeHint = targetCombo.join(' ');
    const voltage = (targetCombo.filter(b => b === 1).length * 1.6 + 1.2).toFixed(1) + 'V';

    levels.push({
      level: i,
      switchCount,
      targetCombo,
      timerSec,
      requiredVoltage: voltage,
      codeHint
    });
  }

  return levels;
};
