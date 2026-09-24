import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'basics': [
    {
      id: 1,
      question: 'In computer electronics, what does a binary "1" represent?',
      options: [
        'No electricity / Circuit is completely open',
        'Electricity is flowing (HIGH voltage / Power ON)',
        'The computer encountered a fatal error',
        'A negative electrical charge'
      ],
      answer: 1,
      hint: 'Think of turning a bedside lamp ON!',
      explanation: 'Binary 1 indicates HIGH signal state (nominal power voltage, such as 3.3V or 5V).'
    },
    {
      id: 2,
      question: 'When will an AND gate output an electrical signal of 1 (ON)?',
      options: [
        'Whenever any single input is turned ON',
        'ONLY when BOTH Switch A and Switch B are turned ON',
        'When both switches are turned OFF',
        'AND gates never output 1'
      ],
      answer: 1,
      hint: 'Remember the two astronauts turning both keys simultaneously.',
      explanation: 'The AND gate performs logical multiplication: 1 · 1 = 1. If any input is 0, the output is 0.'
    },
    {
      id: 3,
      question: 'If Switch A is 1 (ON) and Switch B is 0 (OFF), what will an OR gate output?',
      options: [
        '0 (OFF)',
        '1 (ON)',
        'Both 0 and 1 at the same time',
        'Undefined voltage'
      ],
      answer: 1,
      hint: 'The friendly OR gate only requires at least one switch to be active.',
      explanation: 'An OR gate performs logical addition: 1 + 0 = 1. The light bulb illuminates.'
    },
    {
      id: 4,
      question: 'What does a NOT gate (Inverter) do to an incoming signal of 0?',
      options: [
        'Leaves it as 0',
        'Flips it into a 1',
        'Doubles the voltage to 2',
        'Disables the battery'
      ],
      answer: 1,
      hint: 'NOT always outputs the exact opposite of whatever enters.',
      explanation: 'A NOT gate flips 0 to 1, and 1 to 0.'
    },
    {
      id: 5,
      question: 'In an XOR (Exclusive OR) gate, what is the output if Switch A = 1 and Switch B = 1?',
      options: [
        'Output is 1',
        'Output is 0',
        'Output oscillates back and forth',
        'Output exceeds 10 volts'
      ],
      answer: 1,
      hint: 'XOR only turns ON when the inputs are DIFFERENT from each other.',
      explanation: 'Because both inputs match (1 and 1), the XOR gate outputs 0.'
    },
    {
      id: 6,
      question: 'Which logic gate represents the carry bit when adding two binary numbers together?',
      options: [
        'OR Gate',
        'NOT Gate',
        'AND Gate',
        'BUFFER'
      ],
      answer: 2,
      hint: 'A carry only occurs when 1 + 1 happens, so both inputs must be 1.',
      explanation: '1 + 1 produces 0 in the sum (XOR) and generates a carry of 1 (AND).'
    },
    {
      id: 7,
      question: 'Why are NAND and NOR called "Universal Gates"?',
      options: [
        'Because they are made of gold wire',
        'Because you can build any other logic gate using ONLY NAND or NOR gates',
        'Because they only work in outer space',
        'Because they use infinite electricity'
      ],
      answer: 1,
      hint: 'Think of standard Lego bricks making any shape.',
      explanation: 'NAND and NOR have functional completeness: any Boolean expression can be synthesized solely from them.'
    },
    {
      id: 8,
      question: 'What is the Boolean expression for an OR gate with inputs A and B?',
      options: [
        'Q = A · B',
        'Q = A + B',
        'Q = A ⊕ B',
        'Q = ¬(A · B)'
      ],
      answer: 1,
      hint: 'OR is represented by the plus (+) mathematical operator.',
      explanation: 'Logical addition (disjunction) is represented as Q = A + B.'
    },
    {
      id: 9,
      question: 'According to Boolean algebra, what is A · 0 always equal to?',
      options: [
        'A',
        '1',
        '0',
        'Undefined'
      ],
      answer: 2,
      hint: 'Anything multiplied by 0 in arithmetic or logic becomes 0.',
      explanation: 'Dominance Law states that in an AND gate, any 0 input forces the entire output to 0.'
    },
    {
      id: 10,
      question: 'What is A + 1 always equal to?',
      options: [
        'A',
        '1',
        '0',
        '2'
      ],
      answer: 1,
      hint: 'If one input to an OR gate is already 1, does the other input matter?',
      explanation: 'Dominance Law for OR states that any 1 input guarantees an output of 1.'
    },
    {
      id: 11,
      question: 'How many possible input combinations does a 3-input truth table have (A, B, C)?',
      options: [
        '3 combinations',
        '6 combinations',
        '8 combinations (2³)',
        '9 combinations'
      ],
      answer: 2,
      hint: 'Calculate 2 raised to the power of the number of inputs.',
      explanation: 'For N binary inputs, the number of table rows is 2^N. For 3 inputs: 2³ = 8.'
    },
    {
      id: 12,
      question: 'On a schematic diagram, what does a small circle "bubble" on a gate output mean?',
      options: [
        'The gate is turned OFF',
        'Inversion (NOT operation is applied)',
        'The pin is grounded to earth',
        'A test measurement point'
      ],
      answer: 1,
      hint: 'It turns an AND into a NAND, or an OR into a NOR.',
      explanation: 'An inversion bubble denotes logical negation (NOT).'
    },
    {
      id: 13,
      question: 'What is De Morgan’s rule for the formula ¬(A · B)?',
      options: [
        '¬A · ¬B',
        '¬A + ¬B',
        'A + B',
        'A · B'
      ],
      answer: 1,
      hint: '"Break the bar, change the sign!" - the dot turns into a plus.',
      explanation: 'De Morgan’s First Law: The negation of a conjunction is the disjunction of the negations.'
    },
    {
      id: 14,
      question: 'If A = 1, what is A · Ā (A AND NOT A) equal to?',
      options: [
        '1',
        '0',
        'A',
        'Depends on temperature'
      ],
      answer: 1,
      hint: 'Can something be true AND false at the same split second?',
      explanation: 'Law of Contradiction: 1 · 0 = 0. A signal cannot be both HIGH and LOW simultaneously.'
    },
    {
      id: 15,
      question: 'Which gate is commonly used in hallway staircases with 2 independent switches?',
      options: [
        'NOT Gate',
        'XOR Gate',
        'NAND Gate',
        'None'
      ],
      answer: 1,
      hint: 'Flipping either switch alternates the lamp on or off.',
      explanation: 'An XOR circuit allows either switch flip to toggle the current light state.'
    },
    {
      id: 16,
      question: 'What was the famous space computer built almost entirely from 5,600 NOR gates?',
      options: [
        'The Hubble Space Telescope',
        'The Apollo Guidance Computer (Apollo 11)',
        'The Mars Rover Curiosity',
        'Voyager 1'
      ],
      answer: 1,
      hint: 'It took the first humans to the surface of the Moon in 1969.',
      explanation: 'MIT engineers chose standard 3-input NOR gates to maximize Apollo computer reliability.'
    },
    {
      id: 17,
      question: 'What is the output of an XNOR gate when inputs are A=0 and B=0?',
      options: [
        '1',
        '0',
        'High-Z',
        'Meta-stable'
      ],
      answer: 0,
      hint: 'XNOR is the inverse of XOR; it outputs 1 when inputs are EQUAL.',
      explanation: 'XNOR is an Equivalence gate. Since 0 equals 0, the output is 1.'
    },
    {
      id: 18,
      question: 'What physical micro-electronic component acts as the switch inside modern chips?',
      options: [
        'Resistor',
        'Inductor',
        'MOSFET Transistor',
        'Transformer'
      ],
      answer: 2,
      hint: 'Silicon chips contain billions of these three-terminal semiconductor switches.',
      explanation: 'Field Effect Transistors (MOSFETs) switch electric current at billions of cycles per second.'
    },
    {
      id: 19,
      question: 'If A = 0, B = 1, and C = 1, what is (A + B) · C?',
      options: [
        '0',
        '1',
        'Undefined',
        '2'
      ],
      answer: 1,
      hint: 'First calculate inside the parentheses: (0 + 1) = 1. Then 1 · 1 = ?',
      explanation: '(0 + 1) = 1; then 1 · 1 = 1. The result is 1.'
    },
    {
      id: 20,
      question: 'What happens to a NOT gate output if its input wire is toggled from 1 to 0?',
      options: [
        'Output stays at 0',
        'Output flips from 0 to 1',
        'The gate burns out',
        'Nothing changes'
      ],
      answer: 1,
      hint: 'NOT always outputs the inverted state.',
      explanation: 'When the input drops from 1 to 0, the NOT gate output promptly rises from 0 to 1.'
    }
  ]
};
