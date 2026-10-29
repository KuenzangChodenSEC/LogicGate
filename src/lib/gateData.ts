export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

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
    videoId: 'N4yu37cekCo',
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
    videoId: 'A1rpn_IVRyo',
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
    videoId: 'jN1mEyGJXdo',
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
    videoId: 'KCxj9gTJkp0',
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
    videoId: 'Fa8VyXrT4hM',
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
    videoId: 'AGS3cULg-kA',
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
    videoId: 'FWM2t-0wFBQ',
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
    { id: 'or7', type: 'mcq', question: 'OR gate is used in:', options: ['Masking operations','Alarm systems','Signal routing','Parity checking'], answer: 'Alarm systems', explanation: 'OR gates trigger when any input condition is true — like any door opening in an alarm.' },
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
    { id: 'xor8', type: 'mcq', question: 'XOR is used for:', options: ['Signal routing','Parity checking and error detection','Clock distribution','Power switching'], answer: 'Parity checking and error detection', explanation: 'XOR of multiple bits produces a parity bit for error detection.' },
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
  { id: 'mix5', type: 'mcq', question: 'NOR output when A=0, B=0:', options: ['0','1','X','Z'], answer: '1', explanation: 'NOR outputs 1 only when all inputs are 0.' },
  { id: 'mix6', type: 'tf', question: 'NAND(1,1) = 0', options: ['True','False'], answer: 'True', explanation: 'NAND gives 0 only when all inputs are 1.' },
  { id: 'mix7', type: 'mcq', question: 'How many inputs does a NOT gate have?', options: ['1','2','3','4'], answer: '1', explanation: 'NOT gate is a single-input inverter.' },
  { id: 'mix8', type: 'mcq', question: 'Which gate is used in binary adder sum computation?', options: ['AND','NAND','NOR','XOR'], answer: 'XOR', explanation: 'XOR computes the sum bit; AND computes the carry.' },
  { id: 'mix9', type: 'mcq', question: 'De Morgan\'s theorem: NOT(A AND B) = ?', options: ["A' AND B'","A' OR B'",'NOT-A OR NOT-B (same as A\' OR B\')','A AND B'], answer: "A' OR B'", explanation: "De Morgan's: NOT(A·B) = A' + B'" },
  { id: 'mix10', type: 'mcq', question: 'XNOR output for A=0, B=1:', options: ['0','1','X','Z'], answer: '0', explanation: 'Inputs differ (0 ≠ 1), so XNOR = 0.' },
  { id: 'mix11', type: 'tf', question: 'OR gate output can be 1 when only one input is 1.', options: ['True','False'], answer: 'True', explanation: 'OR gives 1 whenever AT LEAST ONE input is 1.' },
  { id: 'mix12', type: 'mcq', question: 'How many gates can be created from NAND gates alone?', options: ['Only NOT','NOT and AND','All basic logic gates','Only AND and OR'], answer: 'All basic logic gates', explanation: 'NAND is universal — all logic gates can be built from NAND.' },
];


/**
 * Class 9 learning pathway. These lessons are kept alongside the original gate
 * data so the existing gate tutorials, quizzes, and simulator remain unchanged.
 * Video links use topic-specific YouTube searches where a single video could not
 * be independently verified; this avoids publishing guessed video IDs.
 */
export interface LearningVideo {
  title: string;
  description: string;
  url: string;
}
export interface LearningPractice {
  question: string;
  answer: string;
  explanation: string;
}
export interface LearningLesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  explanation: string[];
  example: string[];
  table?: { headers: string[]; rows: string[][] };
  expression?: string;
  practice: LearningPractice[];
  summary: string[];
  video: LearningVideo;
}
export interface LearningModule {
  id: string;
  order: number;
  title: string;
  description: string;
  lessons: LearningLesson[];
}
const videoSearch = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'truth-tables', order: 1, title: 'Module 1: Understanding Truth Tables',
    description: 'Learn binary inputs, outputs, the seven common gates, and how to read or build truth tables.',
    lessons: [
      {
        id: 'tt-intro', title: '1.1 Introduction to Truth Tables',
        description: 'What a truth table shows and why digital systems use them.',
        objectives: ['Define a truth table, input, and output.', 'Explain binary 0 and 1.', 'Describe how a table records a gate’s behaviour.'],
        explanation: [
          'A truth table is a table that lists every possible input combination for a logic function and shows the output for each combination.',
          'Digital logic uses two values: 0 means LOW or FALSE, and 1 means HIGH or TRUE. They represent logical states, not ordinary decimal numbers in a calculation.',
          'Inputs are the values sent into a gate. The output is the result produced by the gate. A truth table makes the gate rule easy to check and compare.'
        ],
        example: ['For an AND gate, the output is 1 only when both A and B are 1.', 'The four possible pairs are 00, 01, 10, and 11. Each pair gets exactly one output.'],
        table: { headers: ['A', 'B', 'Y = A · B'], rows: [['0','0','0'],['0','1','0'],['1','0','0'],['1','1','1']] },
        practice: [{ question: 'What does one row of a truth table represent?', answer: 'One possible input combination and its output.', explanation: 'Every row records the result for one set of input values.' }],
        summary: ['A truth table lists all input combinations.', '0 = LOW/FALSE; 1 = HIGH/TRUE.', 'Truth tables describe gate behaviour without ambiguity.'],
        video: { title: 'Truth tables: introduction', description: 'A beginner-friendly search for lessons explaining truth tables, inputs, outputs, and binary logic.', url: videoSearch('truth tables digital logic introduction beginners inputs outputs') }
      },
      {
        id: 'tt-binary', title: '1.2 Binary Inputs, Outputs, and Number of Rows',
        description: 'Understand input combinations and use 2ⁿ to calculate the number of rows.',
        objectives: ['Distinguish LOW/FALSE from HIGH/TRUE.', 'List combinations in a systematic order.', 'Use 2ⁿ when a function has n inputs.'],
        explanation: [
          'For each input, there are two choices: 0 or 1. With one input there are 2 combinations; with two inputs there are 4; with three inputs there are 8.',
          'The number of rows is 2ⁿ, where n is the number of independent binary inputs. This works because each additional input doubles the number of combinations.',
          'For three inputs A, B, and C, list A in groups of four, B in groups of two, and C alternating every row. This creates all eight combinations exactly once.'
        ],
        example: ['n = 2: 2² = 4 rows: 00, 01, 10, 11.', 'n = 3: 2³ = 8 rows: 000, 001, 010, 011, 100, 101, 110, 111.'],
        table: { headers: ['Number of inputs (n)', 'Calculation', 'Rows'], rows: [['1','2¹','2'],['2','2²','4'],['3','2³','8'],['4','2⁴','16']] },
        practice: [{ question: 'How many rows are needed for four inputs?', answer: '16 rows.', explanation: 'Use 2ⁿ: 2⁴ = 2 × 2 × 2 × 2 = 16.' }],
        summary: ['Every input has two possible values.', 'The row count is 2ⁿ.', 'List combinations systematically so none are missed.'],
        video: { title: 'Binary combinations and truth-table rows', description: 'Find lessons showing why n binary inputs produce 2ⁿ combinations.', url: videoSearch('digital logic truth table number of rows 2 to the power n binary inputs') }
      },
      {
        id: 'tt-gates', title: '1.3 Truth Tables for the Seven Basic Gates',
        description: 'Compare AND, OR, NOT, NAND, NOR, XOR, and XNOR.',
        objectives: ['State the rule for each common gate.', 'Read gate outputs from a truth table.', 'Compare XOR and XNOR with OR and NOR.'],
        explanation: [
          'AND is 1 only when both inputs are 1. OR is 1 when at least one input is 1. NOT reverses its single input.',
          'NAND is the opposite of AND; NOR is the opposite of OR. XOR is 1 when the inputs differ. XNOR is 1 when the inputs match.',
          'NOT has one input and therefore two rows. The other gates shown here have two inputs and four rows.'
        ],
        table: { headers: ['A','B','AND','OR','NAND','NOR','XOR','XNOR'], rows: [['0','0','0','0','1','1','0','1'],['0','1','0','1','1','0','1','0'],['1','0','0','1','1','0','1','0'],['1','1','1','1','0','0','0','1']] },
        example: ['For A=1 and B=0: AND=0, OR=1, NAND=1, NOR=0, XOR=1, XNOR=0.', 'For NOT A, input 0 gives output 1 and input 1 gives output 0.'],
        practice: [{ question: 'A=1 and B=1. What are XOR and XNOR?', answer: 'XOR = 0; XNOR = 1.', explanation: 'The inputs are equal, so XOR is 0 and XNOR is 1.' }],
        summary: ['NAND and NOR invert AND and OR.', 'XOR detects different inputs; XNOR detects matching inputs.', 'Always apply the gate’s rule row by row.'],
        video: { title: 'Truth tables for all logic gates', description: 'Topic-specific YouTube results for worked truth tables of the basic and universal gates.', url: videoSearch('AND OR NOT NAND NOR XOR XNOR gate truth tables explained') }
      },
      {
        id: 'tt-construct', title: '1.4 How to Construct a Truth Table',
        description: 'Build a table in a repeatable sequence and calculate each output.',
        objectives: ['Choose the correct number of rows.', 'Write every input combination.', 'Calculate outputs using the gate rule.'],
        explanation: [
          'Step 1: Count the input variables. Step 2: calculate 2ⁿ rows. Step 3: write all input combinations in binary order.',
          'Step 4: apply the logic rule to each row. For a larger expression, add intermediate columns so each small operation is visible.',
          'Step 5: check that every combination appears once and that the output follows the stated rule.'
        ],
        example: ['Construct Y = A + B. The OR rule says Y is 1 if A or B or both are 1.', 'Rows: 00 → 0; 01 → 1; 10 → 1; 11 → 1.'],
        table: { headers: ['A','B','Y = A + B'], rows: [['0','0','0'],['0','1','1'],['1','0','1'],['1','1','1']] },
        practice: [{ question: 'What is the first thing to calculate when making a truth table?', answer: 'The number of rows, 2ⁿ.', explanation: 'Knowing the row count helps ensure that all input combinations are included.' }],
        summary: ['Count inputs, calculate rows, list combinations, calculate outputs, then check.', 'Intermediate columns help with multi-step expressions.'],
        video: { title: 'How to construct a truth table', description: 'Worked examples for listing input combinations and evaluating gate outputs.', url: videoSearch('how to construct a truth table digital logic worked examples') }
      },
      {
        id: 'tt-read', title: '1.5 Reading and Interpreting Truth Tables',
        description: 'Find patterns and understand tables with two or three inputs.',
        objectives: ['Read an output for a given input row.', 'Describe output patterns.', 'Explain how a table describes a whole circuit.'],
        explanation: [
          'To read a table, find the row with the input values you are given, then read the output column. Do not mix up the input columns and output column.',
          'Patterns reveal the gate rule. AND has only one output 1 in its two-input table. OR has only one output 0. XOR has output 1 for the two rows where inputs differ.',
          'A three-input table has eight rows. For Y = A · B · C, the output is 1 only in row 111. For Y = A + B + C, the output is 0 only in row 000.',
          'A circuit can be described by its truth table because the table records its output for every possible input combination.'
        ],
        example: ['For the row A=1, B=0 in an XOR table, the output is 1 because the inputs differ.', 'For three-input Y=A·B·C, only row A=1, B=1, C=1 gives output 1; all other rows contain at least one 0.'],
        table: { headers: ['A','B','C','A · B · C','A + B + C'], rows: [['0','0','0','0','0'],['0','0','1','0','1'],['0','1','0','0','1'],['0','1','1','0','1'],['1','0','0','0','1'],['1','0','1','0','1'],['1','1','0','0','1'],['1','1','1','1','1']] },
        practice: [{ question: 'For Y = A · B · C, what is Y when A=1, B=1, C=0?', answer: 'Y = 0.', explanation: 'AND requires all three inputs to be 1, but C is 0.' }],
        summary: ['Read across one row to find its output.', 'Patterns help identify the logic function.', 'Three inputs require eight rows.'],
        video: { title: 'Interpreting two-input and three-input truth tables', description: 'Examples that identify patterns and calculate outputs for three-input gates.', url: videoSearch('three input truth tables digital logic examples interpretation') }
      }
    ]
  },
  {
    id: 'truth-to-boolean', order: 2, title: 'Module 2: Truth Tables to Boolean Expressions',
    description: 'Derive canonical Sum of Products and Product of Sums, then simplify expressions.',
    lessons: [
      {
        id: 'tb-basics', title: '2.1 Boolean Algebra and Notation',
        description: 'Learn variables, operators, and how expressions describe logic.',
        objectives: ['Define Boolean variable and expression.', 'Recognise AND, OR, and NOT notation.', 'Connect an expression to its truth table.'],
        explanation: [
          'Boolean algebra is mathematics for values that are only 0 or 1. A Boolean variable such as A can hold either value.',
          'AND is written A · B (or AB); OR is written A + B; NOT A is written Ā or A′. The dot is not ordinary decimal multiplication, and plus is not ordinary arithmetic addition: these symbols mean logical operations.',
          'A Boolean expression gives a rule for an output. A truth table shows the result of that rule for every possible input combination.'
        ],
        example: ['For Y = A · B, only the input row A=1, B=1 gives Y=1.', 'For Y = Ā, each output is the opposite of A.'],
        practice: [{ question: 'Write “NOT A OR B” using standard notation.', answer: 'Y = Ā + B.', explanation: 'The bar means NOT, and + means OR.' }],
        summary: ['Boolean variables contain 0 or 1.', 'Dot = AND, plus = OR, bar/apostrophe = NOT.', 'Expressions and truth tables describe the same logic in different forms.'],
        video: { title: 'Boolean algebra basics', description: 'Beginner lessons on Boolean variables and AND, OR, NOT notation.', url: videoSearch('Boolean algebra basics AND OR NOT variables digital logic beginners') }
      },
      {
        id: 'tb-sop', title: '2.2 Sum of Products (SOP) and Minterms',
        description: 'Use rows with output 1 to build an SOP expression.',
        objectives: ['Define a minterm.', 'Turn an output-1 row into an AND term.', 'Combine minterms with OR.'],
        explanation: [
          'A product term uses AND. A minterm contains every input variable exactly once, either complemented or uncomplemented, and is 1 for exactly one input row.',
          'To create SOP, find every row where output Y=1. For each row, write a minterm: input 1 is written normally; input 0 is complemented.',
          'Join all minterms with OR (+). This is called Sum of Products because product terms are summed (ORed) together.'
        ],
        example: ['Suppose Y=1 for rows 01 and 10.', 'Row A=0, B=1 gives ĀB. Row A=1, B=0 gives A B̄.', 'Therefore Y = ĀB + AB̄. This is also A XOR B.'],
        table: { headers: ['A','B','Y','Minterm if Y=1'], rows: [['0','0','0','—'],['0','1','1','ĀB'],['1','0','1','AB̄'],['1','1','0','—']] },
        expression: 'Y = ĀB + AB̄',
        practice: [{ question: 'For row A=1, B=1, what is its minterm?', answer: 'AB.', explanation: 'Both inputs are 1, so neither variable is complemented.' }],
        summary: ['SOP uses rows where Y=1.', 'For a 0 input, complement that variable.', 'OR all selected minterms together.'],
        video: { title: 'Sum of Products and minterms', description: 'Worked examples deriving SOP expressions from truth tables.', url: videoSearch('sum of products SOP minterms truth table worked examples') }
      },
      {
        id: 'tb-pos', title: '2.3 Product of Sums (POS) and Maxterms',
        description: 'Use rows with output 0 to build a POS expression.',
        objectives: ['Define a maxterm.', 'Turn an output-0 row into an OR term.', 'Combine maxterms with AND.'],
        explanation: [
          'A sum term uses OR. A maxterm contains every variable once and is 0 for exactly one input row.',
          'For POS, select rows where Y=0. In a maxterm, an input 0 is written normally and an input 1 is complemented. This makes the OR term evaluate to 0 for that row.',
          'Join all selected maxterms with AND (·). POS means Product of Sums.'
        ],
        example: ['For Y=1 only when A=B=1, the zero rows are 00, 01, and 10.', 'The maxterms are (A+B), (A+B̄), and (Ā+B).', 'So the canonical POS is Y=(A+B)(A+B̄)(Ā+B), which simplifies to AB.'],
        table: { headers: ['A','B','Y','Maxterm if Y=0'], rows: [['0','0','0','(A+B)'],['0','1','0','(A+B̄)'],['1','0','0','(Ā+B)'],['1','1','1','—']] },
        expression: 'Y = (A + B)(A + B̄)(Ā + B) = AB',
        practice: [{ question: 'For output-zero row A=1, B=0, what maxterm is used?', answer: '(Ā + B).', explanation: 'In a maxterm, input 1 is complemented and input 0 is uncomplemented, so the term becomes 0 for this row.' }],
        summary: ['POS uses rows where Y=0.', 'For a 1 input, complement that variable.', 'AND all selected maxterms together.'],
        video: { title: 'Product of Sums and maxterms', description: 'Examples constructing POS from output-zero rows.', url: videoSearch('product of sums POS maxterms truth table worked examples') }
      },
      {
        id: 'tb-convert', title: '2.4 Complete SOP and POS Conversions',
        description: 'Convert two- and three-variable truth tables using both methods.',
        objectives: ['Derive canonical SOP from output-1 rows.', 'Derive canonical POS from output-0 rows.', 'Check the result against the original table.'],
        explanation: [
          'Consider three inputs A, B, C. For SOP, each output-1 row becomes a three-literal minterm. For example, row 101 becomes AB̄C.',
          'For POS, each output-0 row becomes a three-literal maxterm. For example, row 101 becomes (Ā + B + C̄).',
          'After writing the expression, test each input row. The expression should reproduce the original output column exactly.'
        ],
        example: ['Example: Y=1 for 001 and 111 only.', '001 → ĀB̄C; 111 → ABC.', 'Canonical SOP: Y = ĀB̄C + ABC.'],
        table: { headers: ['A','B','C','Y'], rows: [['0','0','0','0'],['0','0','1','1'],['0','1','0','0'],['0','1','1','0'],['1','0','0','0'],['1','0','1','0'],['1','1','0','0'],['1','1','1','1']] },
        expression: 'SOP: Y = ĀB̄C + ABC',
        practice: [{ question: 'For a three-input SOP row 010, write its minterm.', answer: 'ĀBC.', explanation: 'A=0 gives Ā; B=1 gives B; C=0 gives C̄. Therefore the minterm is ĀBC̄.', }],
        summary: ['A three-input minterm/maxterm has three literals.', 'SOP selects 1 rows; POS selects 0 rows.', 'Verify by checking the expression against every row.'],
        video: { title: 'Truth table to SOP and POS: two and three variables', description: 'Step-by-step examples of both canonical conversion methods.', url: videoSearch('convert truth table to SOP and POS three variables minterms maxterms') }
      },
      {
        id: 'tb-simplify', title: '2.5 Simplifying Boolean Expressions',
        description: 'Use basic Boolean laws to make equivalent expressions shorter.',
        objectives: ['Recognise identity, null, idempotent, complement, and absorption laws.', 'Simplify a canonical expression.', 'Distinguish canonical from simplified forms.'],
        explanation: [
          'A canonical expression includes every variable in every minterm or maxterm. A simplified expression may use fewer terms or variables but must produce the same output for every input.',
          'Useful laws: A+0=A; A·1=A; A+1=1; A·0=0; A+A=A; A·A=A; A+Ā=1; A·Ā=0; A+AB=A; A(A+B)=A.',
          'Simplify one step at a time and name the law when possible. You can verify the simplified result by comparing truth tables.'
        ],
        example: ['Y = AB + AB̄', 'Factor A: Y = A(B + B̄).', 'Complement law: B + B̄ = 1, so Y = A·1 = A.'],
        expression: 'AB + AB̄ = A(B + B̄) = A',
        practice: [{ question: 'Simplify A + A·B.', answer: 'A.', explanation: 'By the absorption law, A + AB = A.' }],
        summary: ['Simplification keeps the same truth table.', 'Use Boolean laws carefully, one step at a time.', 'Canonical forms are systematic; simplified forms are often shorter.'],
        video: { title: 'Boolean algebra simplification rules', description: 'Beginner examples of Boolean laws and simplifying SOP expressions.', url: videoSearch('Boolean algebra simplification laws worked examples absorption complement') }
      }
    ]
  },
  {
    id: 'boolean-to-truth', order: 3, title: 'Module 3: Boolean Expressions to Truth Tables',
    description: 'Evaluate expressions row by row, using intermediate columns for complex expressions.',
    lessons: [
      {
        id: 'bt-evaluate', title: '3.1 Read an Expression Before Evaluating',
        description: 'Identify variables, operators, brackets, and the order of operations.',
        objectives: ['Identify variables and constants.', 'Apply brackets and NOT before AND before OR.', 'Plan intermediate columns.'],
        explanation: [
          'Variables are letters such as A, B, and C. Constants are 0 and 1. Operators include NOT (bar), AND (·), and OR (+).',
          'Evaluate brackets first. Then evaluate NOT, then AND, then OR, unless brackets explicitly change the order. For example, (A+B)·C means calculate A+B before ANDing the result with C.',
          'For a complex expression, make a column for each intermediate operation. This reduces mistakes and shows how the final output was obtained.'
        ],
        example: ['For Y = (A+B)·C, first calculate X=A+B, then calculate Y=X·C.', 'When A=0, B=1, C=1: X=1 and Y=1.'],
        expression: 'Brackets → NOT → AND → OR',
        practice: [{ question: 'In Y=(A+B)·C, which operation is calculated first?', answer: 'A+B.', explanation: 'The brackets require the OR operation to be evaluated first.' }],
        summary: ['Identify every operation before filling the table.', 'Brackets have priority.', 'Use intermediate columns for multi-operation expressions.'],
        video: { title: 'Evaluating Boolean expressions', description: 'Lessons on operator precedence and evaluating Boolean expressions step by step.', url: videoSearch('Boolean expression operator precedence brackets AND OR NOT examples') }
      },
      {
        id: 'bt-simple', title: '3.2 Truth Tables for Simple Expressions',
        description: 'Work through AND, OR, and NOT expressions.',
        objectives: ['List all input combinations.', 'Evaluate simple expressions row by row.', 'Use correct Boolean notation.'],
        explanation: [
          'For two inputs A and B, create four rows: 00, 01, 10, and 11. For a single input, create two rows: 0 and 1.',
          'Y=A·B uses the AND rule; Y=A+B uses the OR rule; Y=Ā reverses A. These are good first checks before working with longer expressions.'
        ],
        table: { headers: ['A','B','A·B','A+B'], rows: [['0','0','0','0'],['0','1','0','1'],['1','0','0','1'],['1','1','1','1']] },
        example: ['For Y=Ā, input A=0 gives Y=1; input A=1 gives Y=0.'],
        practice: [{ question: 'For A=1, B=0, calculate A·B and A+B.', answer: 'A·B=0 and A+B=1.', explanation: 'AND needs both inputs to be 1; OR needs at least one input to be 1.' }],
        summary: ['Two inputs need four rows; one input needs two.', 'Calculate each expression independently for every row.'],
        video: { title: 'Boolean expressions to truth tables: basics', description: 'Worked examples for A·B, A+B, and NOT A.', url: videoSearch('convert Boolean expressions into truth tables AND OR NOT examples') }
      },
      {
        id: 'bt-complex', title: '3.3 Complex Expressions and Intermediate Columns',
        description: 'Evaluate expressions with several operations without skipping steps.',
        objectives: ['Break expressions into smaller operations.', 'Fill intermediate columns accurately.', 'Evaluate bracketed and inverted expressions.'],
        explanation: [
          'For Y=A·B+C, calculate X=A·B first, then Y=X+C. AND is evaluated before OR.',
          'For Y=(A+B)·C, calculate X=A+B first, then Y=X·C because of the brackets.',
          'For Y=overline(A·B), calculate X=A·B and then invert X. This is NAND, so only input 11 produces output 0.'
        ],
        table: { headers: ['A','B','C','A·B','A·B+C','A+B','(A+B)·C'], rows: [['0','0','0','0','0','0','0'],['0','0','1','0','1','0','0'],['0','1','0','0','0','1','0'],['0','1','1','0','1','1','1'],['1','0','0','0','0','1','0'],['1','0','1','0','1','1','1'],['1','1','0','1','1','1','0'],['1','1','1','1','1','1','1']] },
        example: ['For A=1, B=1, C=0: A·B=1, so A·B+C = 1+0 = 1.', 'For the same inputs, (A+B)·C = 1·0 = 0. Brackets change the function.'],
        practice: [{ question: 'If A=0, B=1, C=0, find Y=(A+B)·C.', answer: 'Y=0.', explanation: 'First A+B=1, then 1·0=0.' }],
        summary: ['Use intermediate columns.', 'Respect brackets and operator precedence.', 'Different brackets can produce different outputs.'],
        video: { title: 'Complex Boolean expressions truth tables', description: 'Examples with three variables, brackets, and intermediate columns.', url: videoSearch('three variable complex Boolean expressions truth tables intermediate columns') }
      },
      {
        id: 'bt-three', title: '3.4 Three-Input Expressions',
        description: 'Build all eight combinations and evaluate a three-input function.',
        objectives: ['Explain why three inputs give eight rows.', 'List all combinations in order.', 'Evaluate a three-input expression.'],
        explanation: [
          'Three inputs have 2³=8 combinations. Write A as 00001111, B as 00110011, and C as 01010101 when reading down the table.',
          'For Y=A·B+C, first calculate A·B. Then OR that intermediate result with C. Remember that an OR with C=1 always gives 1.'
        ],
        example: ['For A=1, B=1, C=0, first calculate A·B=1·1=1, then Y=1+0=1.', 'For A=0, B=1, C=0, A·B=0·1=0, then Y=0+0=0.'],
        table: { headers: ['A','B','C','A·B','Y=A·B+C'], rows: [['0','0','0','0','0'],['0','0','1','0','1'],['0','1','0','0','0'],['0','1','1','0','1'],['1','0','0','0','0'],['1','0','1','0','1'],['1','1','0','1','1'],['1','1','1','1','1']] },
        practice: [{ question: 'Why are there eight rows for A, B, and C?', answer: '2³ = 8 combinations.', explanation: 'Each of the three inputs has two possible values, so 2×2×2=8.' }],
        summary: ['Three inputs require eight rows.', 'Use a systematic binary sequence.', 'Intermediate columns make the final result easier to verify.'],
        video: { title: 'Three-variable truth tables', description: 'Step-by-step construction and evaluation of three-input Boolean truth tables.', url: videoSearch('three input variables Boolean expression truth table step by step') }
      },
      {
        id: 'bt-mistakes', title: '3.5 Common Mistakes and Self-Check',
        description: 'Spot frequent errors and practise checking your own truth tables.',
        objectives: ['Avoid confusing AND and OR.', 'Apply NOT to the correct value or group.', 'Verify outputs by substituting inputs.'],
        explanation: [
          'Common mistake 1: treating OR like ordinary addition. In Boolean logic, 1+1=1 because OR means “at least one is true.”',
          'Common mistake 2: thinking AND gives 1 when either input is 1. AND needs every input to be 1.',
          'Common mistake 3: ignoring brackets or complement bars. A bar over AB means NOT the whole product; a bar over A alone means NOT A.',
          'To check a row, substitute its input values into the expression and evaluate each operation in the correct order.'
        ],
        example: ['For Y=overline(A·B), A=1 and B=1 gives A·B=1, then NOT 1 = 0.', 'For Y=Ā+B, A=1 and B=0 gives Ā=0, then 0+0=0.'],
        practice: [{ question: 'Find Y=Ā+B when A=0 and B=0.', answer: 'Y=1.', explanation: 'NOT A = 1, and 1 OR 0 = 1.' }],
        summary: ['OR is not ordinary arithmetic addition.', 'AND needs all inputs to be 1.', 'Evaluate NOT and brackets carefully, then check by substitution.'],
        video: { title: 'Truth table mistakes and practice', description: 'Practice-oriented examples for checking Boolean expression truth tables.', url: videoSearch('Boolean truth table practice questions answers common mistakes') }
      }
    ]
  },
  {
    id: 'boolean-to-circuit', order: 4, title: 'Module 4: Boolean Expressions to Logic Circuits',
    description: 'Translate operators into gates and connect gates in the correct order.',
    lessons: [
      {
        id: 'bc-intro', title: '4.1 Logic Circuit Symbols and Representation',
        description: 'Connect Boolean operators with their gate symbols.',
        objectives: ['Identify circuit inputs, gates, wires, and outputs.', 'Match operators to gates.', 'Explain signal flow.'],
        explanation: [
          'A logic circuit is a group of connected logic gates. Input wires carry 0 or 1 values; gates process those values; the final wire carries the output.',
          'AND corresponds to ·, OR corresponds to +, and NOT corresponds to a bar or apostrophe. NAND and NOR are AND/OR gates with an inversion bubble. XOR checks different inputs and XNOR checks matching inputs.',
          'Read a circuit from left to right: inputs enter the first gate, intermediate wires carry results to later gates, and the final gate produces Y.'
        ],
        example: ['Expression: Y=A·B. Draw A and B into an AND gate; label its output Y.', 'Expression: Y=Ā. Draw A into a NOT gate and label the output Y.'],
        practice: [{ question: 'Which gate represents the Boolean operator +?', answer: 'OR gate.', explanation: 'In Boolean algebra, + represents logical OR.' }],
        summary: ['Inputs enter gates through wires.', 'Each operator maps to a gate.', 'Signal flow is followed from inputs to output.'],
        video: { title: 'Boolean expressions and logic circuit symbols', description: 'Introductory lessons matching Boolean operators to gate symbols.', url: videoSearch('Boolean expressions logic circuit symbols AND OR NOT gates') }
      },
      {
        id: 'bc-simple', title: '4.2 Draw Circuits for Simple Expressions',
        description: 'Represent AND, OR, and NOT expressions as circuits.',
        objectives: ['Draw the correct gate for a simple expression.', 'Label inputs and output.', 'Explain each wire connection.'],
        explanation: [
          'For Y=A·B, connect A and B to an AND gate. The gate output is Y.',
          'For Y=A+B, connect A and B to an OR gate. For Y=Ā, connect A to a NOT gate.',
          'The circuit and expression should have the same behaviour. A truth table can be used to test this.'
        ],
        example: ['Y=A·B: A ─┐ and B ─┴→ AND → Y.', 'Y=A+B: A and B enter an OR gate → Y.', 'Y=Ā: A → NOT → Y.'],
        expression: 'A·B → AND; A+B → OR; Ā → NOT',
        practice: [{ question: 'How many input wires does the NOT circuit need?', answer: 'One input wire.', explanation: 'NOT reverses one input value.' }],
        summary: ['Use one gate for each simple operation.', 'Label the output wire Y.', 'Check the circuit against its truth table.'],
        video: { title: 'Drawing simple logic circuits from expressions', description: 'Examples converting AND, OR, and NOT expressions into circuit diagrams.', url: videoSearch('draw logic circuit from Boolean expression AND OR NOT worked examples') }
      },
      {
        id: 'bc-multiple', title: '4.3 Circuits with Multiple Operations',
        description: 'Build multi-gate circuits and understand how brackets affect connections.',
        objectives: ['Break expressions into gate-sized operations.', 'Connect intermediate outputs.', 'Use brackets to choose the first gate.'],
        explanation: [
          'For Y=A·B+C, first connect A and B to an AND gate. Feed that result and C into an OR gate.',
          'For Y=(A+B)·C, connect A and B to an OR gate first. Feed the OR output and C into an AND gate.',
          'For Y=overline(A+B), connect A and B to an OR gate, then invert its output with a NOT gate. Equivalently, use a NOR gate.'
        ],
        example: ['A·B+C: X=A·B; Y=X+C.', '(A+B)·C: X=A+B; Y=X·C.', 'overline(A+B): X=A+B; Y= X̄.'],
        practice: [{ question: 'For Y=(A+B)·C, which gate comes first?', answer: 'OR gate.', explanation: 'The brackets require A+B to be calculated before AND with C.' }],
        summary: ['Build the inner/bracketed operation first.', 'Use intermediate wires to connect gate outputs.', 'A final NOT can be replaced by a NAND/NOR gate when appropriate.'],
        video: { title: 'Multi-gate circuits from Boolean expressions', description: 'Worked circuit diagrams with intermediate gates and bracketed expressions.', url: videoSearch('convert Boolean expressions to logic circuits multiple gates brackets examples') }
      },
      {
        id: 'bc-universal', title: '4.4 Build Circuits with NAND and NOR',
        description: 'Use universal gates to create NOT, AND, and OR functions.',
        objectives: ['Explain why NAND and NOR are universal.', 'Implement NOT, AND, and OR with NAND.', 'Implement NOT, OR, and AND with NOR.'],
        explanation: [
          'A universal gate can be used by itself to build any Boolean function. NAND and NOR are universal gates.',
          'NAND as NOT: connect both inputs to A, giving Y=(A·A)̄=Ā. NAND as AND: NAND A and B, then invert that result with a second NAND used as an inverter.',
          'NOR as NOT: connect both inputs to A, giving Y=(A+A)̄=Ā. NOR as OR: NOR A and B, then invert the result. NOR can also build AND by inverting both inputs before a final NOR.'
        ],
        example: ['NAND inverter: Y=(A·A)̄=Ā.', 'NAND-based AND: X=(A·B)̄, then Y=(X·X)̄=A·B.'],
        expression: 'NAND: (A·A)̄ = Ā; NOR: (A+A)̄ = Ā',
        practice: [{ question: 'Why is NAND called a universal gate?', answer: 'Because combinations of NAND gates can implement any Boolean function.', explanation: 'NAND can construct NOT, AND, OR, and therefore more complex logic.' }],
        summary: ['NAND and NOR are universal gates.', 'Tying a gate’s inputs together can make an inverter.', 'Use a second gate to undo an inversion when needed.'],
        video: { title: 'Universal gates: NAND and NOR circuits', description: 'Beginner circuit demonstrations using only NAND or only NOR gates.', url: videoSearch('implement NOT AND OR using only NAND and NOR gates universal gates') }
      },
      {
        id: 'bc-test', title: '4.5 Test and Verify a Logic Circuit',
        description: 'Use truth tables to check whether a circuit matches an expression.',
        objectives: ['Trace a circuit from input to output.', 'Calculate intermediate signals.', 'Compare circuit and expression truth tables.'],
        explanation: [
          'Give each input combination to the circuit. Calculate the output of the first gate, then use that value as an input to the next gate.',
          'Build a truth table for the Boolean expression and compare the final output column with the circuit output. Matching outputs for every row means the two are logically equivalent.',
          'If a row differs, check gate type, wire connections, inversion bubbles, and the order of operations.'
        ],
        example: ['For Y=A·B+C, calculate X=A·B and then Y=X+C for each row.', 'At A=1, B=1, C=0: X=1 and Y=1.'],
        practice: [{ question: 'How can you prove a circuit and expression are equivalent?', answer: 'Compare their outputs for every possible input combination.', explanation: 'Equivalent logic has the same output for every row of the truth table.' }],
        summary: ['Test all input combinations.', 'Record intermediate outputs.', 'Equivalent circuits have identical truth tables.'],
        video: { title: 'Testing logic circuits with truth tables', description: 'Examples tracing gate outputs and checking circuits against truth tables.', url: videoSearch('verify logic circuit using truth table worked examples') }
      }
    ]
  },
  {
    id: 'circuit-to-boolean', order: 5, title: 'Module 5: Logic Circuits to Boolean Expressions',
    description: 'Read a circuit, name intermediate outputs, derive the final expression, and verify it.',
    lessons: [
      {
        id: 'cb-read', title: '5.1 Read a Logic Circuit Diagram',
        description: 'Identify signals, gates, wires, and intermediate results.',
        objectives: ['Find inputs and the final output.', 'Trace signals from left to right.', 'Recognise intermediate gate outputs.'],
        explanation: [
          'Input labels such as A, B, and C are the starting signals. Gate symbols show which operation is applied. Wires carry values between gates.',
          'An intermediate output is the result of a gate that becomes an input to another gate. It is often labelled X or Z to make the circuit easier to explain.',
          'Follow each wire carefully. A small inversion bubble means the signal is complemented.'
        ],
        example: ['If A and B enter an AND gate, label its output X=A·B.', 'If X and C then enter an OR gate, the final output is Y=X+C.'],
        practice: [{ question: 'Why label an intermediate wire X?', answer: 'It gives a name to the first gate’s output so it can be used in the next step.', explanation: 'Intermediate labels make multi-gate expressions easier to write and check.' }],
        summary: ['Trace signals from left to right.', 'Gate outputs can become inputs to later gates.', 'Bubbles indicate inversion.'],
        video: { title: 'How to read logic circuit diagrams', description: 'Beginner examples identifying gates, wires, and intermediate outputs.', url: videoSearch('how to read logic circuit diagrams inputs outputs intermediate signals') }
      },
      {
        id: 'cb-single', title: '5.2 Boolean Expressions for Single Gates',
        description: 'Write an expression for each common gate.',
        objectives: ['Write expressions for all seven basic gates.', 'Use consistent Boolean notation.', 'Recognise complemented outputs.'],
        explanation: [
          'AND: Y=A·B. OR: Y=A+B. NOT: Y=Ā. NAND: Y=overline(A·B). NOR: Y=overline(A+B).',
          'XOR: Y=A⊕B, which is also ĀB + AB̄. XNOR: Y=overline(A⊕B), which is AB + ĀB̄.',
          'When writing a gate’s expression, use the actual input labels shown in the diagram. A gate with inputs X and C should be written using X and C, not automatically A and B.'
        ],
        example: ['NAND with inputs A and B: Y=(A·B)̄.', 'XNOR with inputs P and Q: Y=P Q + P̄ Q̄.'],
        practice: [{ question: 'Write the expression for a NOR gate with inputs A and B.', answer: 'Y=overline(A+B), or (A+B)̄.', explanation: 'NOR performs OR first and then inverts the result.' }],
        summary: ['Match the gate type to its operator.', 'Use the labels actually connected to the gate.', 'An output bubble means NOT.'],
        video: { title: 'Writing Boolean expressions from single gates', description: 'Examples translating AND, OR, NOT, NAND, NOR, XOR, and XNOR symbols into expressions.', url: videoSearch('write Boolean expressions from logic gate symbols NAND NOR XOR XNOR') }
      },
      {
        id: 'cb-multigate', title: '5.3 Derive Expressions for Multi-Gate Circuits',
        description: 'Write one expression per gate and substitute until reaching Y.',
        objectives: ['Start with the first gate.', 'Use intermediate variables.', 'Substitute to obtain a final expression.'],
        explanation: [
          'Step 1: label the first gate output X and write its expression. Step 2: use X in the next gate expression. Step 3: continue until the final output Y.',
          'Finally, substitute the expression for X (and any other intermediate variable) into Y. Keep brackets so the order remains clear.'
        ],
        example: ['First gate AND: X=A·B.', 'Second gate OR with C: Y=X+C.', 'Substitute X: Y=A·B+C.'],
        expression: 'X=A·B; Y=X+C; therefore Y=A·B+C',
        practice: [{ question: 'X=A+B and Y=X·C. What is the final expression?', answer: 'Y=(A+B)·C.', explanation: 'Replace X with A+B and keep brackets because the OR result is ANDed with C.' }],
        summary: ['Write an expression at each gate.', 'Substitute intermediate expressions at the end.', 'Keep brackets where they affect operation order.'],
        video: { title: 'Multi-gate circuit to Boolean expression', description: 'Step-by-step derivations using intermediate variables and substitution.', url: videoSearch('derive Boolean expression from multi gate logic circuit intermediate variables') }
      },
      {
        id: 'cb-intermediate', title: '5.4 Intermediate Variables and Substitution',
        description: 'Use X, Z, and other labels to make long circuits manageable.',
        objectives: ['Label two or more intermediate outputs.', 'Substitute expressions in stages.', 'Keep the expression logically equivalent.'],
        explanation: [
          'For a circuit with several gates, assign a temporary name to each intermediate output. For example, X=A·B and Z=X+C.',
          'If the last gate is a NOT gate, Y=Z̄. Substitute in reverse order: Y=overline(X+C), then Y=overline(A·B+C).',
          'Do not remove brackets or move a complement bar unless you are applying a valid Boolean law.'
        ],
        example: ['X=A·B.', 'Z=X+C.', 'Y=Z̄.', 'Final: Y=overline(A·B+C).'],
        expression: 'X=A·B; Z=X+C; Y=Z̄ = overline(A·B+C)',
        practice: [{ question: 'X=A·B and Z= X̄. Write Z without X.', answer: 'Z=overline(A·B).', explanation: 'Substitute A·B for X, then complement the complete product.' }],
        summary: ['Intermediate variables shorten working.', 'Substitute from the earliest gate to the final output.', 'Preserve the scope of complement bars and brackets.'],
        video: { title: 'Intermediate variables in circuit expressions', description: 'Worked examples with two or more intermediate signals.', url: videoSearch('logic circuit Boolean expression intermediate outputs X Z substitution examples') }
      },
      {
        id: 'cb-verify', title: '5.5 Verify, Practise, and Assess',
        description: 'Check a derived expression against the circuit’s truth table.',
        objectives: ['Create a truth table for a derived expression.', 'Compare outputs row by row.', 'Explain whether the expression is correct.'],
        explanation: [
          'After deriving the expression, create its truth table. For each input combination, calculate intermediate values and the final output.',
          'Compare the expression’s output with the circuit output for every row. If all rows match, the expression is correct for that circuit.',
          'If they do not match, inspect the gate symbols, input labels, inversion bubbles, and brackets. A common error is complementing only one input when the circuit inverts the whole gate output.'
        ],
        example: ['Circuit: A and B enter AND, then its output enters NOT.', 'X=A·B; Y=X̄=overline(A·B). This is NAND.', 'Truth table outputs are 1, 1, 1, 0 for inputs 00, 01, 10, 11.'],
        table: { headers: ['A','B','A·B','Y=overline(A·B)'], rows: [['0','0','0','1'],['0','1','0','1'],['1','0','0','1'],['1','1','1','0']] },
        practice: [{ question: 'A circuit has X=A+B and Y=X̄. What is the final gate function?', answer: 'Y=overline(A+B), a NOR function.', explanation: 'The OR result is inverted by the NOT gate, which is exactly NOR.' }],
        summary: ['Use the truth table to verify your derivation.', 'Matching every row confirms equivalence.', 'Check bubbles, labels, and brackets when results differ.'],
        video: { title: 'Practice: circuit diagrams to Boolean expressions', description: 'Practice examples that derive and verify expressions from multi-gate diagrams.', url: videoSearch('logic circuit diagram to Boolean expression practice questions answers') }
      }
    ]
  }
];
