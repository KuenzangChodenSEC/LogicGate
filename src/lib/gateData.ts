export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'BUFFER';

export interface TruthRow {
  a: number;
  b?: number;
  out: number;
}

export interface GateInfo {
  id: GateType;
  name: string;
  description: string;
  booleanExpression: string;
  symbol: string;
  truthTable: TruthRow[];
  realWorldExample: string;
  videoId: string; // YouTube video ID
  tutorialSteps: string[];
  color: string;
}

export function evaluateGate(gate: GateType, a: number, b?: number): number {
  switch (gate) {
    case 'AND': return (a === 1 && b === 1) ? 1 : 0;
    case 'OR': return (a === 1 || b === 1) ? 1 : 0;
    case 'NOT': return a === 1 ? 0 : 1;
    case 'NAND': return (a === 1 && b === 1) ? 0 : 1;
    case 'NOR': return (a === 1 || b === 1) ? 0 : 1;
    case 'XOR': return (a !== b) ? 1 : 0;
    case 'XNOR': return (a === b) ? 1 : 0;
    case 'BUFFER': return a;
    default: return 0;
  }
}

export const GATES: GateInfo[] = [
  {
    id: 'AND',
    name: 'AND Gate',
    description: 'The AND gate outputs 1 only when ALL inputs are 1. Think of it as a series circuit — every switch must be ON for the light to turn on. It is the most fundamental logic gate and forms the basis of all digital computing.',
    booleanExpression: 'Y = A · B (or A AND B)',
    symbol: 'AND',
    truthTable: [
      { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 }, { a: 1, b: 1, out: 1 },
    ],
    realWorldExample: 'A safety system that activates only when both the key is turned AND the button is pressed simultaneously.',
    videoId: 'JiViND-bpmw',
    color: '#f59e0b',
    tutorialSteps: [
      'The AND gate has two inputs (A and B) and one output (Y).',
      'The Boolean expression is Y = A · B, meaning A multiplied by B in binary.',
      'The output is 1 ONLY when both A=1 AND B=1.',
      'In all other combinations, the output is 0.',
      'The gate symbol looks like a D-shape with a flat back.',
      'Real use: AND gates appear in address decoders and enable signals in CPUs.',
    ],
  },
  {
    id: 'OR',
    name: 'OR Gate',
    description: 'The OR gate outputs 1 when AT LEAST ONE input is 1. It is like a parallel circuit — if any switch is ON, the light turns on. It is used in alarm systems and input selection.',
    booleanExpression: 'Y = A + B (or A OR B)',
    symbol: 'OR',
    truthTable: [
      { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 1 },
    ],
    realWorldExample: 'A home alarm that triggers when the front door OR the back door is opened.',
    videoId: 'JiViND-bpmw',
    color: '#ef4444',
    tutorialSteps: [
      'The OR gate has two inputs (A and B) and one output (Y).',
      'The Boolean expression is Y = A + B.',
      'The output is 1 when A=1, OR B=1, OR both are 1.',
      'The only time output is 0 is when BOTH inputs are 0.',
      'The gate symbol has a curved back and a pointed front.',
      'Real use: OR gates appear in interrupt logic and data routing in processors.',
    ],
  },
  {
    id: 'NOT',
    name: 'NOT Gate',
    description: 'The NOT gate (Inverter) has only ONE input and outputs the opposite value. If input is 1, output is 0; if input is 0, output is 1. It is the simplest logic gate and is used to invert signals.',
    booleanExpression: "Y = A' (or NOT A or Ā)",
    symbol: 'NOT',
    truthTable: [
      { a: 0, out: 1 }, { a: 1, out: 0 },
    ],
    realWorldExample: "A street light that turns ON when it's NOT daytime (darkness sensor inverted).",
    videoId: 'JiViND-bpmw',
    color: '#8b5cf6',
    tutorialSteps: [
      'The NOT gate has ONE input (A) and one output (Y).',
      "The Boolean expression is Y = A' (A-bar or NOT A).",
      'It simply inverts the input: 0 becomes 1, 1 becomes 0.',
      'The symbol is a triangle pointing right with a small circle (bubble) at the output.',
      'The circle (bubble) is the inversion indicator.',
      'Real use: NOT gates are used in clock signal generation and to create enable/disable logic.',
    ],
  },
  {
    id: 'NAND',
    name: 'NAND Gate',
    description: 'The NAND gate is a NOT-AND gate. It outputs 0 only when ALL inputs are 1 — the opposite of AND. It is called a universal gate because any other logic gate can be built using only NAND gates.',
    booleanExpression: "Y = (A · B)' (NOT of A AND B)",
    symbol: 'NAND',
    truthTable: [
      { a: 0, b: 0, out: 1 }, { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 0 },
    ],
    realWorldExample: 'The safety interlock in industrial machinery: the machine stops ONLY when all safety conditions are met (both guards closed).',
    videoId: 'JiViND-bpmw',
    color: '#06b6d4',
    tutorialSteps: [
      'NAND = NOT + AND. It is the complement of the AND gate.',
      "Boolean expression: Y = (A · B)'",
      'Output is 0 ONLY when both A=1 AND B=1.',
      'In all other cases, output is 1.',
      'Symbol: AND gate shape with a bubble (circle) at the output.',
      'NAND is a universal gate — you can build ANY logic circuit using only NAND gates.',
      'Real use: Most digital circuits in CPUs and RAM chips are built from NAND gates.',
    ],
  },
  {
    id: 'NOR',
    name: 'NOR Gate',
    description: 'The NOR gate is a NOT-OR gate. It outputs 1 only when ALL inputs are 0. Like NAND, NOR is also a universal gate. It is used in flip-flops and sequential circuits.',
    booleanExpression: "Y = (A + B)' (NOT of A OR B)",
    symbol: 'NOR',
    truthTable: [
      { a: 0, b: 0, out: 1 }, { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 }, { a: 1, b: 1, out: 0 },
    ],
    realWorldExample: 'A system that sends an alert ONLY when all sensors show zero activity (total silence detector).',
    videoId: 'JiViND-bpmw',
    color: '#10b981',
    tutorialSteps: [
      'NOR = NOT + OR. It is the complement of the OR gate.',
      "Boolean expression: Y = (A + B)'",
      'Output is 1 ONLY when both A=0 AND B=0.',
      'If any input is 1, the output is 0.',
      'Symbol: OR gate shape with a bubble (circle) at the output.',
      'NOR is also a universal gate — any logic function can be built with NOR alone.',
      'Real use: NOR gates are used in SR latches (basic memory elements).',
    ],
  },
  {
    id: 'XOR',
    name: 'XOR Gate',
    description: 'The XOR (Exclusive OR) gate outputs 1 when the inputs are DIFFERENT. If both inputs are the same (both 0 or both 1), the output is 0. It is widely used in arithmetic circuits and error detection.',
    booleanExpression: "Y = A ⊕ B (A XOR B)",
    symbol: 'XOR',
    truthTable: [
      { a: 0, b: 0, out: 0 }, { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 }, { a: 1, b: 1, out: 0 },
    ],
    realWorldExample: 'A difference detector: the output is 1 only when the two inputs are different (used in binary adders).',
    videoId: 'JiViND-bpmw',
    color: '#f97316',
    tutorialSteps: [
      "XOR means 'Exclusive OR' — exclusive because it excludes the case when both are 1.",
      'Boolean expression: Y = A ⊕ B',
      'Output is 1 when A ≠ B (inputs are different).',
      'Output is 0 when A = B (inputs are the same).',
      'Symbol: OR gate shape with an extra curved line at the input.',
      'Real use: XOR is the core of binary adders in ALUs and parity checkers in data communication.',
    ],
  },
  {
    id: 'XNOR',
    name: 'XNOR Gate',
    description: 'The XNOR (Exclusive NOR) gate outputs 1 when inputs are THE SAME. It is the complement of XOR. Also called an equivalence gate because it checks if inputs are equal.',
    booleanExpression: "Y = (A ⊕ B)' (NOT of XOR)",
    symbol: 'XNOR',
    truthTable: [
      { a: 0, b: 0, out: 1 }, { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 }, { a: 1, b: 1, out: 1 },
    ],
    realWorldExample: 'A digital comparator that outputs 1 when two bit values are equal (used in equality checkers).',
    videoId: 'JiViND-bpmw',
    color: '#ec4899',
    tutorialSteps: [
      'XNOR = NOT + XOR. It is the complement of the XOR gate.',
      "Boolean expression: Y = (A ⊕ B)'",
      'Output is 1 when A = B (inputs are equal).',
      'Output is 0 when A ≠ B (inputs are different).',
      'Symbol: XOR gate shape with a bubble at the output.',
      'Real use: XNOR gates are used in digital comparators and error-checking circuits.',
    ],
  },
  {
    id: 'BUFFER',
    name: 'BUFFER Gate',
    description: 'The BUFFER gate has one input and outputs the SAME value. It does not change the logic level but strengthens (amplifies) the signal. It is used when a signal needs to drive many outputs or travel a long distance.',
    booleanExpression: 'Y = A (output equals input)',
    symbol: 'BUFFER',
    truthTable: [
      { a: 0, out: 0 }, { a: 1, out: 1 },
    ],
    realWorldExample: 'A signal repeater in a long cable run that boosts the signal without changing its logic value.',
    videoId: 'JiViND-bpmw',
    color: '#84cc16',
    tutorialSteps: [
      'The BUFFER has ONE input (A) and one output (Y).',
      'Boolean expression: Y = A',
      'The output is IDENTICAL to the input — no logic change.',
      'Purpose: to amplify or isolate a signal, not to change its value.',
      'Symbol: a triangle pointing right (like NOT but without the bubble).',
      'Real use: BUFFERs are used in clock distribution networks and bus drivers to handle electrical loading.',
    ],
  },
];

export function getGateInfo(id: GateType): GateInfo {
  return GATES.find(g => g.id === id) || GATES[0];
}

// Quiz questions per gate (10+ per gate)
export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'tf' | 'fib';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export const QUIZ_DATA: Record<GateType, QuizQuestion[]> = {
  AND: [
    { id: 'and1', type: 'mcq', question: 'What is the output of an AND gate when A=1 and B=0?', options: ['0','1','X','Z'], answer: '0', explanation: 'AND outputs 1 only when BOTH inputs are 1. Since B=0, output is 0.' },
    { id: 'and2', type: 'mcq', question: 'What is the Boolean expression for an AND gate?', options: ['Y = A + B','Y = A · B',"Y = A'","Y = A ⊕ B"], answer: 'Y = A · B', explanation: 'AND uses multiplication (·) notation in Boolean algebra.' },
    { id: 'and3', type: 'tf', question: 'An AND gate outputs 1 when at least one input is 1.', options: ['True','False'], answer: 'False', explanation: 'AND requires ALL inputs to be 1. That describes OR gate.' },
    { id: 'and4', type: 'mcq', question: 'How many rows does a 2-input AND gate truth table have?', options: ['2','4','6','8'], answer: '4', explanation: 'With 2 inputs, there are 2² = 4 possible combinations.' },
    { id: 'and5', type: 'mcq', question: 'Which gate can be used to implement masking in digital circuits?', options: ['OR','NOT','AND','XOR'], answer: 'AND', explanation: 'AND is used for masking: ANDing with 0 masks (clears) bits.' },
    { id: 'and6', type: 'tf', question: 'A·A = A for any value of A.', options: ['True','False'], answer: 'True', explanation: 'Idempotent law: A AND A = A.' },
    { id: 'and7', type: 'mcq', question: 'If A=1, B=1 for AND gate, output is:', options: ['0','1','Undefined','Same as input A'], answer: '1', explanation: 'AND outputs 1 only when ALL inputs are 1.' },
    { id: 'and8', type: 'mcq', question: 'A·0 = ?', options: ['A','1','0','Undefined'], answer: '0', explanation: 'Any value AND 0 always gives 0.' },
    { id: 'and9', type: 'mcq', question: 'The AND gate symbol looks like:', options: ['D-shape with flat back','Curved with pointed front','Triangle with bubble','Triangle without bubble'], answer: 'D-shape with flat back', explanation: 'The standard AND gate symbol is a D-shape with a flat left side and rounded right side.' },
    { id: 'and10', type: 'tf', question: 'A·1 = A for any value of A.', options: ['True','False'], answer: 'True', explanation: 'Identity law: A AND 1 = A.' },
  ],
  OR: [
    { id: 'or1', type: 'mcq', question: 'What is the output of OR gate when A=0 and B=0?', options: ['0','1','X','Same as A'], answer: '0', explanation: 'OR outputs 0 only when ALL inputs are 0.' },
    { id: 'or2', type: 'mcq', question: 'What is the Boolean expression for OR gate?', options: ['Y = A · B','Y = A + B',"Y = A'","Y = A ⊕ B"], answer: 'Y = A + B', explanation: 'OR uses addition (+) notation in Boolean algebra.' },
    { id: 'or3', type: 'tf', question: 'OR gate outputs 1 when both inputs are 0.', options: ['True','False'], answer: 'False', explanation: 'OR outputs 0 when all inputs are 0.' },
    { id: 'or4', type: 'mcq', question: 'A+1 = ?', options: ['A','0','1',"A'"], answer: '1', explanation: 'Annulment law: A OR 1 always gives 1.' },
    { id: 'or5', type: 'mcq', question: 'A+0 = ?', options: ['A','0','1',"A'"], answer: 'A', explanation: 'Identity law: A OR 0 = A.' },
    { id: 'or6', type: 'tf', question: 'A+A = A for any value of A.', options: ['True','False'], answer: 'True', explanation: 'Idempotent law: A OR A = A.' },
    { id: 'or7', type: 'mcq', question: 'OR gate is used in:', options: ['Masking operations','Alarm systems','Signal buffering','Parity checking'], answer: 'Alarm systems', explanation: 'OR gates trigger when any input condition is true — like any door opening in an alarm.' },
    { id: 'or8', type: 'mcq', question: 'How many output 1s are in a 2-input OR gate truth table?', options: ['1','2','3','4'], answer: '3', explanation: 'Three of four combinations give output 1: (01, 10, 11).' },
    { id: 'or9', type: 'mcq', question: 'The OR gate symbol has:', options: ['Flat back, rounded front','Curved back, pointed front','Triangle with bubble','D-shape'], answer: 'Curved back, pointed front', explanation: 'OR gate has a distinctive curved input side and pointed output.' },
    { id: 'or10', type: 'mcq', question: "A+A' = ?", options: ['A','0','1',"A'"], answer: '1', explanation: "Complement law: A OR NOT-A always gives 1." },
  ],
  NOT: [
    { id: 'not1', type: 'mcq', question: 'How many inputs does a NOT gate have?', options: ['1','2','3','4'], answer: '1', explanation: 'NOT gate is a single-input inverter.' },
    { id: 'not2', type: 'mcq', question: "What is NOT(1)?", options: ['0','1','X','Z'], answer: '0', explanation: 'NOT inverts the input: NOT(1) = 0.' },
    { id: 'not3', type: 'tf', question: 'NOT gate is also called an inverter.', options: ['True','False'], answer: 'True', explanation: 'NOT gate inverts (complements) the input signal.' },
    { id: 'not4', type: 'mcq', question: "What is NOT(NOT(A))?", options: ['A',"A'",'0','1'], answer: 'A', explanation: 'Double negation law: NOT(NOT(A)) = A.' },
    { id: 'not5', type: 'mcq', question: "Boolean expression for NOT gate:", options: ['Y = A + B','Y = A · B',"Y = A'","Y = A ⊕ B"], answer: "Y = A'", explanation: "NOT is denoted with a prime (') or overbar." },
    { id: 'not6', type: 'mcq', question: 'NOT gate symbol is a:', options: ['D-shape with flat back','Triangle with a bubble (circle) at output','Curved shape with pointed front','D-shape with bubble'], answer: 'Triangle with a bubble (circle) at output', explanation: 'The bubble (inversion bubble) on the output is the key identifier.' },
    { id: 'not7', type: 'tf', question: "NOT(0) = 1", options: ['True','False'], answer: 'True', explanation: 'NOT inverts: NOT(0) = 1.' },
    { id: 'not8', type: 'mcq', question: "What does the bubble on a gate symbol represent?", options: ['Power supply','Inversion','AND function','Ground'], answer: 'Inversion', explanation: 'A bubble (circle) on any gate symbol indicates logical inversion at that point.' },
    { id: 'not9', type: 'mcq', question: 'A NOT gate can be used to:', options: ['Combine two signals','Invert a clock signal','Add two binary numbers','Store a bit'], answer: 'Invert a clock signal', explanation: 'NOT gates invert signals, making them useful for generating complementary clock signals.' },
    { id: 'not10', type: 'mcq', question: 'How many rows are in a NOT gate truth table?', options: ['2','4','6','8'], answer: '2', explanation: 'With 1 input, there are 2¹ = 2 combinations: 0 and 1.' },
  ],
  NAND: [
    { id: 'nand1', type: 'mcq', question: 'NAND gate is equivalent to:', options: ['OR followed by NOT','AND followed by NOT','NOT followed by AND','XOR followed by NOT'], answer: 'AND followed by NOT', explanation: 'NAND = NOT(AND). The AND output is inverted.' },
    { id: 'nand2', type: 'mcq', question: 'What is NAND output when A=1 and B=1?', options: ['0','1','X','Z'], answer: '0', explanation: 'NAND gives 0 ONLY when all inputs are 1.' },
    { id: 'nand3', type: 'tf', question: 'NAND is a universal gate.', options: ['True','False'], answer: 'True', explanation: 'Any logic function can be implemented using only NAND gates.' },
    { id: 'nand4', type: 'mcq', question: "Boolean expression for NAND:", options: ['Y = A + B','Y = A · B',"Y = (A · B)'",'Y = A ⊕ B'], answer: "Y = (A · B)'", explanation: "NAND = complement of AND = (A·B)'" },
    { id: 'nand5', type: 'mcq', question: 'NAND output when A=0 and B=0 is:', options: ['0','1','X','Undefined'], answer: '1', explanation: 'NAND outputs 0 only when both are 1; otherwise 1.' },
    { id: 'nand6', type: 'mcq', question: 'The NAND gate symbol is:', options: ['AND shape with bubble at output','OR shape with bubble at input','Triangle with bubble','D-shape plain'], answer: 'AND shape with bubble at output', explanation: 'NAND is AND gate symbol with a circle (bubble) at the output.' },
    { id: 'nand7', type: 'tf', question: 'NAND gate can implement a NOT gate.', options: ['True','False'], answer: 'True', explanation: 'Connect both NAND inputs to the same signal: NAND(A,A) = NOT(A).' },
    { id: 'nand8', type: 'mcq', question: 'How many output 0s in a 2-input NAND truth table?', options: ['1','2','3','4'], answer: '1', explanation: 'Only the (1,1) input combination gives output 0.' },
    { id: 'nand9', type: 'mcq', question: 'NAND gates are preferred in IC fabrication because:', options: ['They are slower','They use fewer transistors than others','They are easier to test','They have no propagation delay'], answer: 'They use fewer transistors than others', explanation: 'NAND and NOR gates are simpler to build in CMOS technology.' },
    { id: 'nand10', type: 'mcq', question: 'How can you build an AND gate from NAND gates?', options: ['Use two NAND gates','Use one NAND gate','Use three NAND gates and an OR','Use NAND + NOR'], answer: 'Use two NAND gates', explanation: 'AND = NOT(NAND). Connect output of NAND to another NAND with both inputs tied.' },
  ],
  NOR: [
    { id: 'nor1', type: 'mcq', question: 'NOR gate is equivalent to:', options: ['AND followed by NOT','OR followed by NOT','NOT followed by OR','XOR followed by NOT'], answer: 'OR followed by NOT', explanation: 'NOR = NOT(OR). The OR output is inverted.' },
    { id: 'nor2', type: 'mcq', question: 'NOR output when A=0 and B=0 is:', options: ['0','1','X','Z'], answer: '1', explanation: 'NOR outputs 1 ONLY when ALL inputs are 0.' },
    { id: 'nor3', type: 'tf', question: 'NOR is a universal gate.', options: ['True','False'], answer: 'True', explanation: 'Any logic function can be built using only NOR gates.' },
    { id: 'nor4', type: 'mcq', question: "Boolean expression for NOR:", options: ['Y = A + B','Y = A · B',"Y = (A + B)'",'Y = A ⊕ B'], answer: "Y = (A + B)'", explanation: "NOR = complement of OR = (A+B)'" },
    { id: 'nor5', type: 'mcq', question: 'NOR output when A=1 and B=1 is:', options: ['0','1','X','Undefined'], answer: '0', explanation: 'NOR outputs 0 whenever any input is 1.' },
    { id: 'nor6', type: 'mcq', question: 'The NOR gate symbol is:', options: ['OR shape with bubble at output','AND shape with bubble at output','Triangle with bubble','Curved shape plain'], answer: 'OR shape with bubble at output', explanation: 'NOR is OR gate symbol with a circle (bubble) at the output.' },
    { id: 'nor7', type: 'tf', question: 'NOR gate can implement a NOT gate.', options: ['True','False'], answer: 'True', explanation: 'Connect both NOR inputs to the same signal: NOR(A,A) = NOT(A).' },
    { id: 'nor8', type: 'mcq', question: 'How many output 1s in a 2-input NOR truth table?', options: ['1','2','3','4'], answer: '1', explanation: 'Only the (0,0) combination gives output 1.' },
    { id: 'nor9', type: 'mcq', question: 'NOR gates are used to build:', options: ['Analog amplifiers','SR Latches (memory)','Multiplication circuits','Floating point units'], answer: 'SR Latches (memory)', explanation: 'Cross-coupled NOR gates form the basic SR latch flip-flop.' },
    { id: 'nor10', type: 'mcq', question: 'NOR output when A=0 and B=1 is:', options: ['0','1','X','Z'], answer: '0', explanation: 'NOR outputs 0 whenever any input is 1.' },
  ],
  XOR: [
    { id: 'xor1', type: 'mcq', question: 'XOR outputs 1 when:', options: ['Both inputs are 1','Both inputs are 0','Inputs are different','Inputs are the same'], answer: 'Inputs are different', explanation: 'XOR = Exclusive OR. Output is 1 only when inputs differ.' },
    { id: 'xor2', type: 'mcq', question: 'XOR output when A=1 and B=1 is:', options: ['0','1','X','Z'], answer: '0', explanation: 'XOR outputs 0 when both inputs are the same (both 1 here).' },
    { id: 'xor3', type: 'mcq', question: "Boolean expression for XOR:", options: ['Y = A + B','Y = A · B',"Y = (A + B)'",'Y = A ⊕ B'], answer: 'Y = A ⊕ B', explanation: 'XOR uses the ⊕ (circled plus) symbol.' },
    { id: 'xor4', type: 'tf', question: 'XOR gate is used in binary adders.', options: ['True','False'], answer: 'True', explanation: 'XOR computes the sum bit in binary addition.' },
    { id: 'xor5', type: 'mcq', question: 'A ⊕ A = ?', options: ['A','1','0',"A'"], answer: '0', explanation: 'XOR of a value with itself is always 0.' },
    { id: 'xor6', type: 'mcq', question: 'A ⊕ 0 = ?', options: ['A','0','1',"A'"], answer: 'A', explanation: 'XOR with 0 leaves the value unchanged.' },
    { id: 'xor7', type: 'mcq', question: 'A ⊕ 1 = ?', options: ['A','0','1',"A'"], answer: "A'", explanation: "XOR with 1 inverts the value — same as NOT." },
    { id: 'xor8', type: 'mcq', question: 'XOR is used for:', options: ['Signal buffering','Parity checking and error detection','Clock distribution','Power switching'], answer: 'Parity checking and error detection', explanation: 'XOR of multiple bits produces a parity bit for error detection.' },
    { id: 'xor9', type: 'tf', question: 'XOR(0,1) = 1', options: ['True','False'], answer: 'True', explanation: 'Inputs are different (0 ≠ 1), so XOR = 1.' },
    { id: 'xor10', type: 'mcq', question: 'The XOR symbol looks like:', options: ['OR gate with extra curved input line','AND gate with bubble','Triangle with bubble','D-shape'], answer: 'OR gate with extra curved input line', explanation: 'XOR symbol is the OR gate with an additional curved vertical line at the input side.' },
  ],
  XNOR: [
    { id: 'xnor1', type: 'mcq', question: 'XNOR outputs 1 when:', options: ['Inputs are different','Inputs are the same','Both inputs are 0 only','Both inputs are 1 only'], answer: 'Inputs are the same', explanation: 'XNOR is the complement of XOR: outputs 1 when inputs are equal.' },
    { id: 'xnor2', type: 'mcq', question: 'XNOR output when A=1 and B=1 is:', options: ['0','1','X','Z'], answer: '1', explanation: 'Inputs are equal (both 1), so XNOR = 1.' },
    { id: 'xnor3', type: 'mcq', question: "Boolean expression for XNOR:", options: ['Y = A ⊕ B',"Y = (A ⊕ B)'",'Y = A + B','Y = A · B'], answer: "Y = (A ⊕ B)'", explanation: "XNOR = NOT(XOR) = (A ⊕ B)'" },
    { id: 'xnor4', type: 'tf', question: 'XNOR is also called an equivalence gate.', options: ['True','False'], answer: 'True', explanation: 'XNOR checks if inputs are equivalent (equal).' },
    { id: 'xnor5', type: 'mcq', question: 'XNOR output when A=0 and B=0 is:', options: ['0','1','X','Z'], answer: '1', explanation: 'Inputs are equal (both 0), so XNOR = 1.' },
    { id: 'xnor6', type: 'mcq', question: 'XNOR output when A=1 and B=0 is:', options: ['0','1','X','Z'], answer: '0', explanation: 'Inputs differ (1 ≠ 0), so XNOR = 0.' },
    { id: 'xnor7', type: 'mcq', question: 'The XNOR symbol looks like:', options: ['XOR gate with bubble at output','AND gate with bubble','OR gate plain','Triangle plain'], answer: 'XOR gate with bubble at output', explanation: 'XNOR is XOR gate symbol with a circle (bubble) at the output.' },
    { id: 'xnor8', type: 'tf', question: 'XNOR is used in digital comparators.', options: ['True','False'], answer: 'True', explanation: 'XNOR checks equality — the core operation in bit comparators.' },
    { id: 'xnor9', type: 'mcq', question: 'How many output 1s in a 2-input XNOR truth table?', options: ['1','2','3','4'], answer: '2', explanation: 'XNOR gives 1 for (0,0) and (1,1) — two combinations.' },
    { id: 'xnor10', type: 'mcq', question: 'XNOR(A,A) = ?', options: ['A','0','1',"A'"], answer: '1', explanation: 'Any value XNORed with itself gives 1 (they are always equal).' },
  ],
  BUFFER: [
    { id: 'buf1', type: 'mcq', question: 'What does a BUFFER gate do to the logic level?', options: ['Inverts it','Doubles it','Passes it unchanged','Adds one'], answer: 'Passes it unchanged', explanation: 'BUFFER output equals input — no logic change.' },
    { id: 'buf2', type: 'mcq', question: 'BUFFER output when A=1 is:', options: ['0','1','X','Z'], answer: '1', explanation: 'BUFFER passes the input directly: output = input = 1.' },
    { id: 'buf3', type: 'mcq', question: 'Boolean expression for BUFFER:', options: ['Y = A + 1','Y = A',"Y = A'","Y = A · 1"], answer: 'Y = A', explanation: 'BUFFER: output equals input.' },
    { id: 'buf4', type: 'tf', question: 'BUFFER is used to amplify signal strength.', options: ['True','False'], answer: 'True', explanation: 'While the logic level stays same, BUFFER boosts electrical drive strength.' },
    { id: 'buf5', type: 'mcq', question: 'The BUFFER symbol is a:', options: ['D-shape','Triangle with bubble at output','Triangle WITHOUT bubble','Curved shape'], answer: 'Triangle WITHOUT bubble', explanation: 'BUFFER = triangle shape pointing right, no inversion bubble.' },
    { id: 'buf6', type: 'mcq', question: 'BUFFER output when A=0 is:', options: ['0','1','X','Z'], answer: '0', explanation: 'BUFFER passes input through: output = 0.' },
    { id: 'buf7', type: 'mcq', question: 'How many rows in a BUFFER truth table?', options: ['2','4','6','8'], answer: '2', explanation: 'One input → 2 combinations: A=0 or A=1.' },
    { id: 'buf8', type: 'tf', question: 'BUFFER changes the logic value of the signal.', options: ['True','False'], answer: 'False', explanation: 'BUFFER does NOT change logic value — it only strengthens it.' },
    { id: 'buf9', type: 'mcq', question: 'BUFFER is primarily used in:', options: ['Logic inversion','Bus drivers and clock distribution networks','Binary addition','Parity checking'], answer: 'Bus drivers and clock distribution networks', explanation: 'BUFFERs drive high-fanout signals like buses and clocks.' },
    { id: 'buf10', type: 'mcq', question: 'What is the difference between BUFFER and NOT gate?', options: ['BUFFER is faster','BUFFER does NOT invert; NOT inverts the signal','NOT is for analog signals','They are identical'], answer: 'BUFFER does NOT invert; NOT inverts the signal', explanation: 'BUFFER: Y=A. NOT: Y=A\'. The only difference is inversion.' },
  ],
};

// Mixed quiz: 10 random questions from all gates
export function getMixedQuizQuestions(): QuizQuestion[] {
  const all = Object.values(QUIZ_DATA).flat();
  return [...all].sort(() => Math.random() - 0.5).slice(0, 10);
}

// Mixed quiz questions
export const MIXED_QUIZ: QuizQuestion[] = [
  { id: 'mix1', type: 'mcq', question: 'Which gate is called the universal gate?', options: ['AND','OR','NAND','XOR'], answer: 'NAND', explanation: 'Both NAND and NOR are universal gates, but NAND is most commonly referenced.' },
  { id: 'mix2', type: 'mcq', question: 'Which gate outputs 1 when inputs are different?', options: ['AND','XNOR','XOR','NOR'], answer: 'XOR', explanation: 'XOR = Exclusive OR. Outputs 1 when inputs differ.' },
  { id: 'mix3', type: 'mcq', question: 'What is A+A\' = ?', options: ['0','A','1',"A'"], answer: '1', explanation: 'A OR NOT-A always equals 1 (complement law).' },
  { id: 'mix4', type: 'mcq', question: 'Which gate passes the input unchanged?', options: ['NOT','BUFFER','AND','NOR'], answer: 'BUFFER', explanation: 'BUFFER: Y = A (no change to logic level).' },
  { id: 'mix5', type: 'mcq', question: 'NOR output when A=0, B=0:', options: ['0','1','X','Z'], answer: '1', explanation: 'NOR outputs 1 only when all inputs are 0.' },
  { id: 'mix6', type: 'tf', question: 'NAND(1,1) = 0', options: ['True','False'], answer: 'True', explanation: 'NAND gives 0 only when all inputs are 1.' },
  { id: 'mix7', type: 'mcq', question: 'How many inputs does a NOT gate have?', options: ['1','2','3','4'], answer: '1', explanation: 'NOT gate is a single-input inverter.' },
  { id: 'mix8', type: 'mcq', question: 'Which gate is used in binary adder sum computation?', options: ['AND','NAND','NOR','XOR'], answer: 'XOR', explanation: 'XOR computes the sum bit; AND computes the carry.' },
  { id: 'mix9', type: 'mcq', question: 'De Morgan\'s theorem: NOT(A AND B) = ?', options: ["A' AND B'","A' OR B'",'NOT-A OR NOT-B (same as A\' OR B\')','A AND B'], answer: "A' OR B'", explanation: "De Morgan's: NOT(A·B) = A' + B'" },
  { id: 'mix10', type: 'mcq', question: 'XNOR output for A=0, B=1:', options: ['0','1','X','Z'], answer: '0', explanation: 'Inputs differ (0 ≠ 1), so XNOR = 0.' },
  { id: 'mix11', type: 'tf', question: 'OR gate output can be 1 when only one input is 1.', options: ['True','False'], answer: 'True', explanation: 'OR gives 1 whenever AT LEAST ONE input is 1.' },
  { id: 'mix12', type: 'mcq', question: 'How many gates can be created from NAND gates alone?', options: ['Only NOT','NOT and AND','All basic logic gates','Only AND and OR'], answer: 'All basic logic gates', explanation: 'NAND is universal — all logic gates can be built from NAND.' },
];
