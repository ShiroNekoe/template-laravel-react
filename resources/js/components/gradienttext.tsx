import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-white via-sky-200 to-cyan-300 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
