import React from 'react';

export const SteamCurls: React.FC<{ className?: string }> = ({ className = 'w-6 h-6 text-tomato' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M7 19c-1-2 0-4 1-5s2-3 1-5-2-3-1-5" />
    <path d="M12 21c-1-2 0-4 1-5s2-3 1-5-2-3-1-5" />
    <path d="M17 19c-1-2 0-4 1-5s2-3 1-5-2-3-1-5" />
  </svg>
);

export const SpiceStar: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-turmeric' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

export const RailwaySignal: React.FC<{ className?: string }> = ({ className = 'w-8 h-8 text-ink-light dark:text-ink-dark' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="16" y1="4" x2="16" y2="30" />
    <rect x="11" y="6" width="10" height="14" rx="2" fill="#1B1A17" stroke="currentColor" />
    <circle cx="16" cy="10" r="2" fill="#E8452C" stroke="none" />
    <circle cx="16" cy="16" r="2" fill="#2E7D32" stroke="none" />
    <line x1="8" y1="30" x2="24" y2="30" strokeWidth="3" />
  </svg>
);

export const TrainTrackBorder: React.FC<{ className?: string }> = ({ className = 'w-full h-4 text-border-light dark:text-border-dark' }) => (
  <svg className={className} viewBox="0 0 100 12" preserveAspectRatio="none" fill="none" stroke="currentColor">
    <line x1="0" y1="2" x2="100" y2="2" strokeWidth="1.5" />
    <line x1="0" y1="10" x2="100" y2="10" strokeWidth="1.5" />
    {Array.from({ length: 25 }).map((_, i) => (
      <line key={i} x1={i * 4 + 2} y1="0" x2={i * 4 + 2} y2="12" strokeWidth="1.5" />
    ))}
  </svg>
);

export const StampBadge: React.FC<{
  label: string;
  variant?: 'red' | 'yellow' | 'green' | 'charcoal';
  className?: string;
  rotate?: string;
}> = ({ label, variant = 'red', className = '', rotate = '-3deg' }) => {
  const styles = {
    red: 'border-tomato text-tomato bg-tomato/5',
    yellow: 'border-turmeric text-amber-700 dark:text-turmeric bg-turmeric/10',
    green: 'border-coriander text-coriander dark:text-emerald-400 bg-coriander/5',
    charcoal: 'border-stone-800 text-stone-800 dark:border-stone-300 dark:text-stone-300 bg-stone-500/5',
  };

  return (
    <span
      style={{ transform: `rotate(${rotate})` }}
      className={`inline-flex items-center font-mono font-extrabold text-[11px] tracking-wider uppercase px-2 py-0.5 border-2 border-dashed rounded select-none shadow-xs ${styles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
