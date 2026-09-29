import React from 'react';

interface ChefLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'monochrome';
}

export const ChefLogo: React.FC<ChefLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'default',
}) => {
  const sizeMap = {
    sm: { box: 32, text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 42, text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 54, text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 68, text: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 font-display select-none ${className}`}>
      <div className="relative flex-shrink-0 group">
        <svg
          width={current.box}
          height={current.box}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-2deg]"
          aria-label="CodeChef ABESEC Bawarchi Express Logo"
        >
          {/* Subtle paper seal shadow */}
          <ellipse cx="24" cy="45" rx="14" ry="2" fill="currentColor" opacity="0.12" />

          {/* Main Badge / Ticket Stamp Circular Outer */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill={variant === 'monochrome' ? 'transparent' : '#FFFDF9'}
            stroke={variant === 'monochrome' ? 'currentColor' : '#1B1A17'}
            strokeWidth="2.5"
            strokeDasharray="1.5 0"
            className="dark:fill-stone-900 dark:stroke-amber-400/80"
          />

          {/* Inner ticket perforation ring */}
          <circle
            cx="24"
            cy="24"
            r="19.5"
            fill="none"
            stroke={variant === 'monochrome' ? 'currentColor' : '#DDD2C1'}
            strokeWidth="1"
            strokeDasharray="2 2"
            className="dark:stroke-stone-700"
          />

          {/* Steam Sparks / Railway Whistle Curls */}
          <path
            d="M19 12C18.5 9 20 8 19 6"
            stroke="#F5B82E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M24 11C24.5 8 23 7 24 5"
            stroke="#E8452C"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M29 12C29.5 9.5 28.5 8 29.5 6.5"
            stroke="#F5B82E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Chef Hat Puffs (Toque Flutes) */}
          <path
            d="M15 26C13.5 24 13.5 20.5 16 18.5C17.5 17.5 19.5 17 21 18C22 15 25.5 14.5 28 16C29.5 17 30 18.5 30 20C32.5 19.5 34.5 21.5 34.5 24.5C34.5 26.5 33 28 31.5 28.5"
            fill="#FFFDF9"
            stroke="#1B1A17"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="dark:fill-stone-800 dark:stroke-stone-200"
          />

          {/* Hat Pleats / Creases */}
          <path d="M20 20C20.5 23 21 26 21 28" stroke="#DDD2C1" strokeWidth="1.2" strokeLinecap="round" className="dark:stroke-stone-600" />
          <path d="M26 19C25.5 22.5 25.5 25.5 25 28" stroke="#DDD2C1" strokeWidth="1.2" strokeLinecap="round" className="dark:stroke-stone-600" />

          {/* Chef Hat Brim / Terminal Band */}
          <rect
            x="14"
            y="27.5"
            width="20"
            height="7"
            rx="2"
            fill="#E8452C"
            stroke="#1B1A17"
            strokeWidth="1.8"
          />

          {/* Terminal Command Prompt >_ inside the Hat Band */}
          <path
            d="M17.5 29.5L20 31L17.5 32.5"
            stroke="#FFFDF9"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="22.5"
            y1="32.5"
            x2="25.5"
            y2="32.5"
            stroke="#F5B82E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Railway Tracks Base Tie */}
          <line x1="12" y1="39.5" x2="36" y2="39.5" stroke="#1B1A17" strokeWidth="2.2" strokeLinecap="round" className="dark:stroke-amber-400" />
          <line x1="16.5" y1="37.5" x2="16.5" y2="41.5" stroke="#1B1A17" strokeWidth="1.8" className="dark:stroke-stone-400" />
          <line x1="24" y1="37.5" x2="24" y2="41.5" stroke="#1B1A17" strokeWidth="1.8" className="dark:stroke-stone-400" />
          <line x1="31.5" y1="37.5" x2="31.5" y2="41.5" stroke="#1B1A17" strokeWidth="1.8" className="dark:stroke-stone-400" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-ink-light dark:text-ink-dark ${current.text}`}>
              CodeChef
            </span>
            <span className="bg-tomato text-white text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              ABESEC
            </span>
          </div>
          <span className={`font-mono text-stone-500 dark:text-stone-400 tracking-wider uppercase font-semibold ${current.sub}`}>
            Bawarchi Express • #TechChefs
          </span>
        </div>
      )}
    </div>
  );
};
