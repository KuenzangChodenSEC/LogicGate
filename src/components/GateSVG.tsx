import React from 'react';
import { GateType } from '@/lib/gateData';

interface GateSVGProps {
  gate: GateType;
  size?: number;
  color?: string;
  active?: boolean;
  inputA?: number;
  inputB?: number;
}

const GATE_COLORS: Record<GateType, string> = {
  AND: '#f59e0b',
  OR: '#ef4444',
  NOT: '#8b5cf6',
  NAND: '#06b6d4',
  NOR: '#10b981',
  XOR: '#f97316',
  XNOR: '#ec4899',
  BUFFER: '#84cc16',
};

export default function GateSVG({ gate, size = 60, active, inputA, inputB }: GateSVGProps) {
  const color = active ? GATE_COLORS[gate] : 'hsl(var(--muted-foreground))';
  const strokeW = 2;

  const paths: Record<GateType, React.ReactNode> = {
    AND: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 L10,50 L35,50 Q60,50 60,30 Q60,10 35,10 Z" />
        <line x1="0" y1="20" x2="10" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="10" y2="40" stroke={color} />
        <line x1="60" y1="30" x2="70" y2="30" stroke={color} />
      </g>
    ),
    OR: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 Q20,10 60,30 Q20,50 10,50 Q25,30 10,10 Z" />
        <line x1="0" y1="20" x2="17" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="17" y2="40" stroke={color} />
        <line x1="60" y1="30" x2="70" y2="30" stroke={color} />
      </g>
    ),
    NOT: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 L10,50 L60,30 Z" />
        <circle cx="64" cy="30" r="5" />
        <line x1="0" y1="30" x2="10" y2="30" stroke={color} />
        <line x1="69" y1="30" x2="75" y2="30" stroke={color} />
      </g>
    ),
    NAND: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 L10,50 L32,50 Q55,50 55,30 Q55,10 32,10 Z" />
        <circle cx="59" cy="30" r="5" />
        <line x1="0" y1="20" x2="10" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="10" y2="40" stroke={color} />
        <line x1="64" y1="30" x2="70" y2="30" stroke={color} />
      </g>
    ),
    NOR: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 Q18,10 55,30 Q18,50 10,50 Q23,30 10,10 Z" />
        <circle cx="59" cy="30" r="5" />
        <line x1="0" y1="20" x2="15" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="15" y2="40" stroke={color} />
        <line x1="64" y1="30" x2="70" y2="30" stroke={color} />
      </g>
    ),
    XOR: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M15,10 Q25,10 65,30 Q25,50 15,50 Q28,30 15,10 Z" />
        <path d="M8,10 Q21,30 8,50" />
        <line x1="0" y1="20" x2="18" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="18" y2="40" stroke={color} />
        <line x1="65" y1="30" x2="75" y2="30" stroke={color} />
      </g>
    ),
    XNOR: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M15,10 Q23,10 58,30 Q23,50 15,50 Q27,30 15,10 Z" />
        <path d="M8,10 Q20,30 8,50" />
        <circle cx="62" cy="30" r="5" />
        <line x1="0" y1="20" x2="18" y2="20" stroke={color} />
        <line x1="0" y1="40" x2="18" y2="40" stroke={color} />
        <line x1="67" y1="30" x2="75" y2="30" stroke={color} />
      </g>
    ),
    BUFFER: (
      <g stroke={color} strokeWidth={strokeW} fill="none">
        <path d="M10,10 L10,50 L65,30 Z" />
        <line x1="0" y1="30" x2="10" y2="30" stroke={color} />
        <line x1="65" y1="30" x2="75" y2="30" stroke={color} />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 75 60"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width="75" height="60" fill="none" />
      {paths[gate]}
      {inputA !== undefined && (
        <text x="1" y="23" fontSize="8" fill={inputA ? GATE_COLORS[gate] : 'hsl(var(--muted-foreground))'} fontFamily="monospace">{inputA}</text>
      )}
      {inputB !== undefined && (
        <text x="1" y="43" fontSize="8" fill={inputB ? GATE_COLORS[gate] : 'hsl(var(--muted-foreground))'} fontFamily="monospace">{inputB}</text>
      )}
    </svg>
  );
}
