import type { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'intro-binary',
    title: '1. What are 1s and 0s? Binary & Electricity',
    category: 'Foundations',
    readTime: '4 min read',
    difficulty: 'Beginner',
    shortDescription: 'Discover why computers only think in ON (1) and OFF (0) using simple light switches.',
    analogy: 'Think of a bedside lamp: when you press the switch ON, electric current flows (1). Press it OFF, and the current stops (0). Everything a smartphone or supercomputer does is just billions of tiny switches flipping!',
    explanation: `
Computers do not speak human languages or understand photos directly. Deep inside every chip, processor, and graphics card is a tiny world made of microscopic electronic switches called **transistors**.

### The Two States:
- **1 (HIGH / TRUE):** Electricity is actively flowing through the wire (usually ~3.3 Volts or 5 Volts).
- **0 (LOW / FALSE):** No electricity is flowing (ground level, 0 Volts).

### Why Binary?
Why don't computers count from 0 to 9 like humans?
Because electrical signals are physical! It is vastly easier and 100% reliable to detect if a wire is **ON** or **OFF** than to guess subtle voltage fractions like 3.42V versus 3.45V.

A **Logic Gate** is a tiny physical device that takes one or two incoming electrical wires and decides whether to send electricity out on its output wire.
    `,
    realWorldExample: 'A smartphone touchscreen: when your finger touches glass, it connects a tiny circuit switch to 1 (HIGH), letting the phone detect your tap instantly!',
    booleanExpr: 'HIGH = 1 (Power ON)  |  LOW = 0 (Power OFF)',
    ruleSummary: 'Rule: 1 means electricity is ON; 0 means electricity is OFF.',
    videoUrl: 'https://www.youtube.com/embed/QZwneRb-zqA',
    truthTable: {
      headers: ['Physical State', 'Voltage Level', 'Binary Bit Value'],
      rows: [
        ['Switch Closed (ON)', '3.3V to 5.0V', '1 (TRUE)'],
        ['Switch Open (OFF)', '0.0V (Ground)', '0 (FALSE)']
      ]
    }
  },
  {
    id: 'and-gate',
    title: '2. The AND Gate: The Strict Team Player',
    category: 'Basic Gates',
    readTime: '5 min read',
    difficulty: 'Beginner',
    shortDescription: 'The AND gate only turns ON if BOTH inputs are turned ON at the exact same time.',
    analogy: 'To launch a spacecraft, the Commander AND the Pilot must both turn their safety keys simultaneously. If either key is released, the launch cancels.',
    explanation: `
The **AND Gate** is very strict. It acts like two switches placed one after another in a single line (in series).

Unless current can pass through Switch A **AND** Switch B, the light bulb stays dark.

### The 4 Possible Situations:
1. **0 AND 0:** Both switches OFF &rarr; Output is **0 (Dark)**
2. **0 AND 1:** Switch A is OFF &rarr; Output is **0 (Dark)**
3. **1 AND 0:** Switch B is OFF &rarr; Output is **0 (Dark)**
4. **1 AND 1:** BOTH are ON &rarr; Output lights up as **1 (ON ✨)**

In math, logical AND is written like multiplication: \`Q = A × B\` (or \`Q = A · B\`). Notice that 1 × 1 = 1, but any time you multiply by 0, the answer is 0!
    `,
    realWorldExample: 'Automatic cash ATM machine: You only get cash if your Debit Card is inserted (1) AND your PIN number is correct (1).',
    booleanExpr: 'Q = A · B (Logical Multiplication)',
    ruleSummary: 'Rule: Output is 1 ONLY when both A and B are 1.',
    videoUrl: 'https://www.youtube.com/embed/ITCdq_v5iEU',
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Q (A · B)'],
      rows: [
        ['0', '0', '0 (OFF)'],
        ['0', '1', '0 (OFF)'],
        ['1', '0', '0 (OFF)'],
        ['1', '1', '1 (ON ✨)']
      ]
    }
  },
  {
    id: 'or-gate',
    title: '3. The OR Gate: The Friendly Helper',
    category: 'Basic Gates',
    readTime: '5 min read',
    difficulty: 'Beginner',
    shortDescription: 'The OR gate turns ON if EITHER input is ON. It is happy with one or both.',
    analogy: 'Imagine a staircase light that has a switch at the bottom floor and another at the top floor. Flipping the downstairs switch OR the upstairs switch lights up the stairs!',
    explanation: `
The **OR Gate** is friendly and forgiving. It acts like two electrical switches wired side-by-side in parallel. Electricity only needs one clear pathway to reach the light.

### The 4 Situations:
1. **0 OR 0:** Neither switch is pressed &rarr; Output is **0 (Dark)**
2. **0 OR 1:** Switch B is pressed &rarr; Output turns **1 (ON ✨)**
3. **1 OR 0:** Switch A is pressed &rarr; Output turns **1 (ON ✨)**
4. **1 OR 1:** Both switches are pressed &rarr; Output stays **1 (ON ✨)**

In Boolean algebra, OR is represented with a plus sign (\`+\`): \`Q = A + B\`. As long as you have at least one 1, the total output is always 1!
    `,
    realWorldExample: 'Home smoke alarm: The siren sounds if the Kitchen sensor detects smoke (1) OR the Living Room sensor detects smoke (1).',
    booleanExpr: 'Q = A + B (Logical Addition)',
    ruleSummary: 'Rule: Output is 1 if ANY input is 1. Output is 0 only if ALL inputs are 0.',
    videoUrl: 'https://www.youtube.com/embed/sIn7n_Wb0bA',
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Q (A + B)'],
      rows: [
        ['0', '0', '0 (OFF)'],
        ['0', '1', '1 (ON ✨)'],
        ['1', '0', '1 (ON ✨)'],
        ['1', '1', '1 (ON ✨)']
      ]
    }
  },
  {
    id: 'not-gate',
    title: '4. The NOT Gate: The Inverter / Bit Flipper',
    category: 'Basic Gates',
    readTime: '4 min read',
    difficulty: 'Beginner',
    shortDescription: 'The NOT gate flips things: feed it a 0 and it outputs 1; feed it a 1 and it outputs 0.',
    analogy: 'An automatic nightlight: when daylight is present (1), the lamp turns OFF (0). When darkness falls (0), the lamp automatically illuminates (1)!',
    explanation: `
Unlike AND or OR gates which have two inputs, the **NOT Gate** (also called an **Inverter**) only has a single input line.

Whatever signal enters the gate, the exact opposite signal comes out!

- Input **0** &rarr; Output **1**
- Input **1** &rarr; Output **0**

### The Inversion Bubble
On schematic circuit diagrams, a NOT gate looks like a small triangle pointing forward with a tiny circle (called a **bubble**) at its tip. Whenever you see that bubble in digital electronics, it means *"invert this signal!"*
    `,
    realWorldExample: 'A refrigerator door sensor: when the door is closed (1), the inside light stays OFF (0). When the door opens (0), the light inverts and turns ON (1).',
    booleanExpr: 'Q = ¬A (or Q = Ā, NOT A)',
    ruleSummary: 'Rule: Flip 0 into 1, and flip 1 into 0.',
    videoUrl: 'https://www.youtube.com/embed/mK9k2a4B-X8',
    truthTable: {
      headers: ['Input A', 'Output Q (¬A)'],
      rows: [
        ['0', '1 (ON ✨)'],
        ['1', '0 (OFF)']
      ]
    }
  },
  {
    id: 'xor-gate',
    title: '5. The XOR Gate: The Difference Detector & Adder',
    category: 'Arithmetic Gates',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    shortDescription: 'XOR stands for Exclusive OR. It turns ON ONLY when the two inputs are DIFFERENT from each other.',
    analogy: 'A coin toss bet: You and a friend flip a coin. You win (1) only if the coins show DIFFERENT faces (Heads vs Tails). If both coins match (Heads-Heads or Tails-Tails), you get nothing (0).',
    explanation: `
The **XOR (Exclusive OR)** gate is the secret hero of computer processors. It answers the question: *"Are these two inputs different?"*

- If both inputs are equal (\`0 and 0\`, or \`1 and 1\`), the output is **0**.
- If the inputs are different (\`0 and 1\`, or \`1 and 0\`), the output is **1**!

### How Computers Add Numbers:
When you add two single binary bits together:
- 0 + 0 = 0
- 0 + 1 = 1
- 1 + 0 = 1
- 1 + 1 = 10 (which is 0 with a carry of 1!)

Notice that the sum bit matches an XOR gate, while the carry bit matches an AND gate! Together, an XOR gate and an AND gate form a **Half Adder**, which performs real arithmetic in your computer's CPU!
    `,
    realWorldExample: 'Binary calculator: The Arithmetic Logic Unit (ALU) uses XOR gates to add your homework numbers millions of times per second.',
    booleanExpr: 'Q = A ⊕ B = (A · B̄) + (Ā · B)',
    ruleSummary: 'Rule: Output is 1 if inputs are DIFFERENT. Output is 0 if inputs MATCH.',
    videoUrl: 'https://www.youtube.com/embed/Y341_XGqV58',
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Q (A ⊕ B)'],
      rows: [
        ['0', '0', '0 (Matches = 0)'],
        ['0', '1', '1 (Different = 1 ✨)'],
        ['1', '0', '1 (Different = 1 ✨)'],
        ['1', '1', '0 (Matches = 0)']
      ]
    }
  },
  {
    id: 'nand-nor',
    title: '6. Universal Gates: NAND & NOR (Silicon Lego Bricks)',
    category: 'Universal Logic',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    shortDescription: 'Learn how ANY digital computer can be built entirely out of NAND gates alone.',
    analogy: 'Lego bricks: You can build a house, a pirate ship, or a spaceship out of just standard 2x4 plastic bricks. NAND gates are the universal Lego bricks of the digital universe!',
    explanation: `
A **NAND Gate** is simply an **AND gate followed by a NOT bubble** (NOT-AND).
Its output is inverted: it gives 1 for everything, except when both inputs are 1.

### Why Are They Called "Universal"?
Engineers discovered a miraculous property: you can build **every single other logic gate** (NOT, AND, OR, XOR) using *only* NAND gates!
- Tie both inputs of a NAND together &rarr; you get a **NOT gate**!
- Feed a NAND into another NAND inverter &rarr; you get an **AND gate**!
- Invert the inputs and pass through a NAND &rarr; you get an **OR gate**!

### Apollo 11 Space Mission
The Apollo Guidance Computer that took Neil Armstrong and Buzz Aldrin to the Moon in 1969 was built out of approximately 5,600 NOR gates because using one standardized chip made the computer ultra-reliable and lightweight!
    `,
    realWorldExample: 'Computer RAM and SSD Flash memory chips: Solid State Drives (SSDs) are made of billions of floating-gate NAND flash transistors storing your files.',
    booleanExpr: 'NAND(A, B) = ¬(A · B)  |  NOR(A, B) = ¬(A + B)',
    ruleSummary: 'Rule: NAND = 0 ONLY when both are 1. NOR = 1 ONLY when both are 0.',
    videoUrl: 'https://www.youtube.com/embed/y3k4Xz5kF1g',
    truthTable: {
      headers: ['Input A', 'Input B', 'NAND (NOT-AND)', 'NOR (NOT-OR)'],
      rows: [
        ['0', '0', '1 ✨', '1 ✨'],
        ['0', '1', '1 ✨', '0'],
        ['1', '0', '1 ✨', '0'],
        ['1', '1', '0', '0']
      ]
    }
  },
  {
    id: 'boolean-algebra',
    title: '7. Boolean Expressions & De Morgan’s Laws',
    category: 'Boolean Math',
    readTime: '7 min read',
    difficulty: 'Advanced',
    shortDescription: 'Master the clean algebraic formulas that allow electrical engineers to simplify huge circuits.',
    analogy: 'Algebra simplification: Just like 2x + 4x simplifies to 6x, Boolean algebra lets engineers turn a messy 10-gate circuit into a fast, cheap 2-gate circuit with the exact same behavior!',
    explanation: `
In 1854, English mathematician George Boole invented Boolean algebra, proving that human logic could be solved like mathematical equations.

### The Essential Laws:
1. **Identity Law:**
   - \`A · 1 = A\` (ANDing with 1 preserves the signal)
   - \`A + 0 = A\` (ORing with 0 preserves the signal)

2. **Dominance (Null) Law:**
   - \`A · 0 = 0\` (Any 0 kills an AND gate)
   - \`A + 1 = 1\` (Any 1 turns on an OR gate)

3. **Inverse / Complement Law:**
   - \`A · Ā = 0\` (A signal ANDed with its opposite is impossible, so 0)
   - \`A + Ā = 1\` (Either A or NOT A must be true, so 1)

### De Morgan's Famous Rules:
- \`¬(A · B) = ¬A + ¬B\` *(Break the line, change the sign!)*
- \`¬(A + B) = ¬A · ¬B\`
    `,
    realWorldExample: 'Circuit chip designers at Intel and AMD use software based on De Morgan’s laws to shrink processor circuits, making laptops run cooler and use less battery.',
    booleanExpr: '¬(A · B) = ¬A + ¬B  and  ¬(A + B) = ¬A · ¬B',
    ruleSummary: 'Rule: "Break the bar, change the sign" to switch between AND and OR circuits.',
    videoUrl: 'https://www.youtube.com/embed/ITCdq_v5iEU',
    truthTable: {
      headers: ['Law Name', 'Formula with AND (·)', 'Formula with OR (+)'],
      rows: [
        ['Identity', 'A · 1 = A', 'A + 0 = A'],
        ['Dominance', 'A · 0 = 0', 'A + 1 = 1'],
        ['Idempotent', 'A · A = A', 'A + A = A'],
        ['Complement', 'A · Ā = 0', 'A + Ā = 1']
      ]
    }
  }
];
