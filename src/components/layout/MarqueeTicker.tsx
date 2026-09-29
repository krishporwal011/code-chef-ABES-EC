import React from 'react';

export const MarqueeTicker: React.FC<{ items?: string[]; speed?: string }> = ({
  items = [
    '🚂 ALL ABOARD THE BAWARCHI EXPRESS',
    '⚡ DEVSHASTRA 2026 BERTHS FILLING FAST',
    '🌶️ TADKA OF ALGORITHMS',
    '👨‍🍳 MEET THE BAWARCHIS AT PLATFORM #1',
    '💻 CODE. COLAB. CONQUER.',
    '✨ NO TICKET FARE — FREE FOR ALL CODERS',
    '🍵 UNLIMITED CHAI & HIGH-COMPUTE SERVERS',
  ],
}) => {
  return (
    <div
      className="bg-[#181715] text-[#F5B82E] border-y border-[#2D2A24] py-2 overflow-hidden select-none font-mono text-xs uppercase tracking-widest relative z-30"
      aria-label="Platform Announcement Ticker"
    >
      <div className="flex w-max animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Sequence repeated twice for seamless loop */}
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tomato" />
              <span>{item}</span>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((item, idx) => (
            <span key={`dup-${idx}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-tomato" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
