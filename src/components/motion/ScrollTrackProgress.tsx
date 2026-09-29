import React, { useEffect, useState } from 'react';

export const ScrollTrackProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-2 z-50 pointer-events-none bg-border-light/40 dark:bg-border-dark/40 overflow-hidden"
      aria-hidden="true"
    >
      {/* Railway Track Ties Background */}
      <div className="absolute inset-0 flex justify-between px-1 opacity-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-[1.5px] h-full bg-stone-600 dark:bg-stone-400" />
        ))}
      </div>

      {/* Train Track Progress Fill */}
      <div
        className="h-full bg-tomato transition-all duration-75 relative ease-out"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Tiny Engine Head */}
        <div className="absolute -right-3 -top-1 w-6 h-4 bg-ink-light dark:bg-amber-400 rounded-sm shadow-md flex items-center justify-center transform scale-90">
          <span className="text-[7px] font-mono text-white dark:text-black font-extrabold">🚂</span>
        </div>
      </div>
    </div>
  );
};
