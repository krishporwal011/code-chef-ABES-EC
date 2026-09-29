import React from 'react';

export const TicketStubBarcode: React.FC<{
  code: string;
  height?: number;
  className?: string;
}> = ({ code, height = 36, className = '' }) => {
  // Deterministic stripe generator based on character code values
  const stripes: { width: number; gap: number }[] = [];
  for (let i = 0; i < code.length; i++) {
    const val = code.charCodeAt(i);
    stripes.push({
      width: (val % 3) + 1.2,
      gap: (val % 2) + 1,
    });
    stripes.push({
      width: ((val * 2) % 4) + 1,
      gap: 1.5,
    });
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        height={height}
        viewBox="0 0 140 40"
        fill="currentColor"
        className="w-full max-w-[150px] opacity-85"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Procedural Barcode Lines */}
        {stripes.slice(0, 24).map((stripe, idx) => {
          const x = idx * 5.6 + 4;
          return (
            <rect
              key={idx}
              x={x}
              y="2"
              width={stripe.width}
              height="36"
              rx="0.5"
            />
          );
        })}
      </svg>
      <span className="font-mono text-[9px] tracking-widest uppercase text-stone-500 dark:text-stone-400 mt-0.5">
        {code}
      </span>
    </div>
  );
};
