import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          className="fill-cyan-500"
        />
        <path
          d="M2 17L12 22L22 17"
          className="stroke-cyan-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          className="stroke-cyan-500"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-transparent bg-clip-text leading-none mb-0.5">
          FinFlow
        </h1>
        <p className="text-xs text-slate-400">Finance Manager</p>
      </div>
    </div>
  );
}
