import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Radio, Volume2, ArrowRight } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* AUDIO SYNTHESIZER: MECHANICAL SOLARI CLICK                                 */
/* -------------------------------------------------------------------------- */

const playSolariMechanicalClick = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio autoplay restrictions safely
  }
};

/* -------------------------------------------------------------------------- */
/* 1. AUTHENTIC MECHANICAL SPLIT-FLAP CHARACTER TILE                          */
/* -------------------------------------------------------------------------- */

export interface SplitFlapCharProps {
  char: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  triggerKey?: number;
}

export const SplitFlapChar: React.FC<SplitFlapCharProps> = ({
  char,
  delay = 0,
  size = 'sm',
  triggerKey = 0,
}) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFlipping(true);
      const flipDone = setTimeout(() => {
        setDisplayChar(char);
        setIsFlipping(false);
      }, 140);
      return () => clearTimeout(flipDone);
    }, delay);
    return () => clearTimeout(timer);
  }, [char, delay, triggerKey]);

  const safeChar = displayChar === ' ' ? '\u00A0' : displayChar.toUpperCase();

  const sizeClasses = {
    sm: 'w-6 h-8 text-sm sm:w-7 sm:h-9 sm:text-base',
    md: 'w-7 h-9 text-base sm:w-8 sm:h-10 sm:text-lg',
    lg: 'w-8 h-10 text-lg sm:w-9 sm:h-12 sm:text-xl',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeClasses} bg-gradient-to-b from-[#221F18] via-[#161410] to-[#0E0C09] text-[#F8C846] font-display font-black rounded-[3px] border border-[#3E3424] shadow-[0_2px_4px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] select-none overflow-hidden mx-[1.5px] align-middle`}
      style={{ perspective: '300px' }}
    >
      {/* Centered Bold Railway Tile Glyph */}
      <span className="relative z-10 leading-none text-[#F8C846] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-black">
        {safeChar}
      </span>

      {/* Top Half Lighting Sheen */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none z-15" />

      {/* Split Flap Subtle Hairline Seam */}
      <div className="absolute top-1/2 inset-x-0 h-[1px] bg-black/60 z-20 pointer-events-none" />

      {/* Side Pin Hinges */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[2px] h-[3.5px] bg-[#756649] z-20 rounded-r-xs" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[2px] h-[3.5px] bg-[#756649] z-20 rounded-l-xs" />

      {/* 3D Animated Flip Card */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={`flip-${triggerKey}-${safeChar}`}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.13, ease: 'easeIn' }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#292218] border-b border-black/80 flex items-end justify-center overflow-hidden origin-bottom z-30"
          >
            <span className="translate-y-1/2 leading-none text-[#F8C846] font-display font-black">
              {safeChar}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. SPLIT-FLAP WORD WRAPPER                                                 */
/* -------------------------------------------------------------------------- */

export const SplitFlapWord: React.FC<{
  text: string;
  maxLength?: number;
  stagger?: number;
  size?: 'sm' | 'md' | 'lg';
  triggerKey?: number;
}> = ({ text, maxLength, stagger = 25, size = 'sm', triggerKey = 0 }) => {
  const content = maxLength ? text.padEnd(maxLength, ' ') : text;
  return (
    <div className="inline-flex items-center">
      {content.split('').map((c, i) => (
        <SplitFlapChar
          key={i}
          char={c}
          delay={i * stagger}
          size={size}
          triggerKey={triggerKey}
        />
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. VINTAGE BRASS RIVET                                                     */
/* -------------------------------------------------------------------------- */

const BrassRivet: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#E2B768] via-[#A87B2E] to-[#5C3F0F] p-[1.5px] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-center ${className}`}
    aria-hidden="true"
  >
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#C6923B] to-[#784F14] flex items-center justify-center shadow-inner">
      <div className="w-1.5 h-[1.5px] bg-[#3B2506] rotate-45 rounded-[0.5px]" />
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 4. RETRO SOLARI BOARD COMPONENT                                            */
/* -------------------------------------------------------------------------- */

export interface DepartureRowProps {
  id?: string;
  pnr?: string;
  time: string;
  destination: string;
  tagline?: string;
  category: string;
  platform: string;
  platformDetail?: string;
  status: string;
  registeredCount?: number;
  capacity?: number;
  onAction?: () => void;
}

export const SplitFlapDeparturesBoard: React.FC<{ rows: DepartureRowProps[] }> = ({ rows }) => {
  const [cycleKey, setCycleKey] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Station live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualCycle = () => {
    playSolariMechanicalClick();
    setCycleKey((prev) => prev + 1);
  };

  return (
    <div className="relative rounded-2xl bg-[#0F0E0C] text-[#EDE6DA] border-2 border-[#2F2920] shadow-[0_25px_60px_rgba(0,0,0,0.75)] overflow-hidden">
      {/* 4 Brass Corner Rivets */}
      <BrassRivet className="absolute top-3 left-3 z-30" />
      <BrassRivet className="absolute top-3 right-3 z-30" />
      <BrassRivet className="absolute bottom-3 left-3 z-30" />
      <BrassRivet className="absolute bottom-3 right-3 z-30" />

      {/* Outer Casing Bevel Accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6923B]/50 to-transparent z-20 pointer-events-none" />

      {/* Station Nameplate Plaque (Top Header) */}
      <div className="bg-gradient-to-b from-[#181613] via-[#14120E] to-[#100F0D] border-b-2 border-[#2B251B] px-5 sm:px-8 py-3.5 relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Station Title & Plaque */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#221D14] border border-[#A87B2E]/50 flex items-center justify-center text-[#F5B82E] shadow-inner">
              <Radio className="w-4 h-4 animate-pulse text-[#F5B82E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-[#F5B82E] uppercase">
                  SOLARI DI UDINE • BAWARCHI JUNCTION
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#A87B2E]/20 border border-[#A87B2E]/40 font-mono text-[9px] text-[#F5D588] tracking-widest font-bold">
                  MOD. CC-84
                </span>
              </div>
              <p className="font-mono text-[10px] text-stone-400 tracking-wider">
                ABESEC CENTRAL DIVISION // REAL-TIME EXPEDITION DISPATCH
              </p>
            </div>
          </div>

          {/* Clock & Station Signals */}
          <div className="flex items-center gap-4 text-xs font-mono">
            {/* Jeweled Status Lamps */}
            <div className="hidden sm:flex items-center gap-3 bg-[#0B0A08] border border-[#262118] px-3 py-1.5 rounded-lg shadow-inner">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981] animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  DISPATCH LIVE
                </span>
              </div>
              <span className="text-stone-600">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  TRACK 50Hz
                </span>
              </div>
            </div>

            {/* Live Station Digital Clock */}
            <div className="flex items-center gap-1.5 bg-[#080706] border border-[#2B251B] px-3 py-1.5 rounded-lg text-[#F5B82E] font-bold shadow-inner">
              <Clock className="w-3.5 h-3.5 text-[#A87B2E]" />
              <span className="tracking-widest text-xs sm:text-sm">{currentTime || '10:00:00 IST'}</span>
            </div>

            {/* Cycle Flaps Button with Tactile Click Sound */}
            <button
              onClick={handleManualCycle}
              title="Click to flip the mechanical tiles with sound"
              className="flex items-center gap-1.5 bg-[#1F1B14] hover:bg-[#2C261C] active:scale-95 text-[#F5D588] border border-[#A87B2E]/50 px-2.5 py-1.5 rounded-lg text-[10px] tracking-wider transition-all cursor-pointer shadow-md"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F5B82E]" />
              <span className="hidden md:inline font-bold">FLIP TILES</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-4 py-1 text-[10px] font-mono text-stone-400 bg-[#0B0A08] border-b border-[#211E17] flex items-center justify-between">
        <span>← SWIPE TABLE HORIZONTALLY →</span>
        <span className="text-[#F5B82E]">LIVE SCHEDULE</span>
      </div>

      {/* Solari Dispatch Board Table */}
      <div className="overflow-x-auto p-2 sm:p-4">
        <div className="min-w-[780px]">
          {/* Table Header Bar */}
          <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-[#B5A995] bg-[#14120E] border-b border-[#2A241A] rounded-t-lg">
            <div className="col-span-2">DEP. TIME</div>
            <div className="col-span-5">EXPEDITION / EVENT DETAILS</div>
            <div className="col-span-2">PLATFORM</div>
            <div className="col-span-3 text-right">BERTH STATUS &amp; ACTION</div>
          </div>

          {/* Slat Rows */}
          <div className="divide-y divide-[#1D1913] bg-[#0C0B09]">
            {rows.map((row, idx) => {
              // Parse platform cleanly (e.g., "PF 01", "PF 9¾")
              const pfDigits = row.platform.replace(/[^0-9¾]/g, '').trim();
              const pfFormatted = pfDigits.length === 1 ? `PF 0${pfDigits}` : `PF ${pfDigits || '01'}`;

              // Clean 5-char time (e.g., "09:00", "02:00")
              const cleanTime = row.time.slice(0, 5);

              const isFillingFast = row.status === 'Filling Fast';
              const isOpen = row.status === 'Open';
              const isSoldOut = row.status === 'Sold Out';

              return (
                <div
                  key={row.id || idx}
                  className="group grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-amber-500/[0.04] transition-colors relative"
                >
                  {/* Subtle Row Hover Indicator */}
                  <div className="absolute left-0 inset-y-0 w-[3px] bg-transparent group-hover:bg-[#F5B82E] transition-colors" />

                  {/* 1. TIME: Split-Flap mechanical tiles */}
                  <div className="col-span-2 flex items-center gap-1.5">
                    <SplitFlapWord
                      text={cleanTime}
                      size="sm"
                      stagger={20}
                      triggerKey={cycleKey}
                    />
                    <span className="font-mono text-[10px] font-bold text-[#A87B2E] tracking-wider uppercase">
                      IST
                    </span>
                  </div>

                  {/* 2. EVENT TITLE & DETAILS: Crisp, Unclipped, High-Contrast Typography */}
                  <div className="col-span-5 pr-2">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {row.pnr && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1F1B14] text-[#F5B82E] border border-[#423824]">
                          {row.pnr}
                        </span>
                      )}
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#181613] text-stone-300 border border-stone-800">
                        {row.category}
                      </span>
                    </div>

                    {/* Full unclipped event title */}
                    <h3 className="font-display font-black text-sm sm:text-base text-[#F5F2EB] group-hover:text-[#F5B82E] transition-colors tracking-tight leading-snug">
                      {row.destination}
                    </h3>

                    {/* Tagline / Subtitle */}
                    {row.tagline && (
                      <p className="text-stone-400 text-[11px] line-clamp-1 mt-0.5 font-sans">
                        {row.tagline}
                      </p>
                    )}
                  </div>

                  {/* 3. PLATFORM: Split-Flap tiles */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <SplitFlapWord
                        text={pfFormatted}
                        size="sm"
                        stagger={20}
                        triggerKey={cycleKey}
                      />
                    </div>
                    {row.platformDetail && (
                      <div className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                        {row.platformDetail}
                      </div>
                    )}
                  </div>

                  {/* 4. STATUS & ACTION: Jeweled Signal Indicator + Reserve Action */}
                  <div className="col-span-3 flex items-center justify-end gap-3">
                    {/* Glowing Pilot Lamp Badge */}
                    <div className="flex items-center gap-1.5">
                      {isOpen && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 font-mono text-[10px] font-black tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                          BOARDING
                        </span>
                      )}
                      {isFillingFast && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-600/70 text-amber-300 font-mono text-[10px] font-black tracking-wider uppercase animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
                          FILLING FAST
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-700/60 text-rose-300 font-mono text-[10px] font-black tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
                          WAITLIST
                        </span>
                      )}
                    </div>

                    {/* Direct Quick-Action Button */}
                    {row.onAction && (
                      <button
                        onClick={row.onAction}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#2A2317] to-[#1C170E] hover:from-[#3B301F] hover:to-[#262013] border border-[#A87B2E]/60 text-[#F5D588] hover:text-[#F5B82E] font-mono text-[11px] font-bold tracking-wider transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        <span>RESERVE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Board Footer Plaque */}
      <div className="bg-[#0C0B09] border-t border-[#231F18] px-5 py-2.5 text-[10px] font-mono text-stone-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A87B2E]" />
          <span>PASSENGER NOTICE: TICKET COUNTER CLOSES 30 MIN PRIOR TO DEPARTURE</span>
        </div>
        <div className="text-[#A87B2E] font-bold">
          TERMINUS GHAZIABAD // 28.6366° N, 77.4475° E
        </div>
      </div>
    </div>
  );
};
