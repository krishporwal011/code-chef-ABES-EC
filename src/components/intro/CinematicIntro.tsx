import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, forcePlay = false }) => {
  const [typedUrl, setTypedUrl] = useState('');
  const [step, setStep] = useState<'typing' | 'entered' | 'loading' | 'zooming' | 'done'>('typing');
  const [progress, setProgress] = useState(0);
  const targetUrl = 'codechef-abesec.club';

  useEffect(() => {
    // Check prefers-reduced-motion or query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenIntro = sessionStorage.getItem('codechef_intro_seen');

    if (urlParams.get('skipIntro') === 'true' || (!forcePlay && hasSeenIntro)) {
      onComplete();
      return;
    }

    if (prefersReducedMotion && !forcePlay) {
      sessionStorage.setItem('codechef_intro_seen', 'true');
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }

    // Step 1: Type URL
    let currentIdx = 0;
    const typingInterval = setInterval(() => {
      if (currentIdx <= targetUrl.length) {
        setTypedUrl(targetUrl.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(typingInterval);
        setStep('entered');

        // Step 2: Press enter after brief pause
        setTimeout(() => {
          setStep('loading');

          // Step 3: Run train loading bar
          const startTime = Date.now();
          const duration = 2200; // 2.2s loading

          const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, Math.round((elapsed / duration) * 100));
            setProgress(pct);

            if (pct >= 100) {
              clearInterval(progressInterval);
              setStep('zooming');

              // Step 4: Zoom into hero and finish
              setTimeout(() => {
                sessionStorage.setItem('codechef_intro_seen', 'true');
                setStep('done');
                onComplete();
              }, 600);
            }
          }, 30);
        }, 400);
      }
    }, 85);

    return () => clearInterval(typingInterval);
  }, [forcePlay, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('codechef_intro_seen', 'true');
    setStep('done');
    onComplete();
  };

  if (step === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="cinematic-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{
          opacity: step === 'zooming' ? 0 : 1,
          scale: step === 'zooming' ? 1.4 : 1,
          filter: step === 'zooming' ? 'blur(8px)' : 'none',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0E0C] p-4 select-none overflow-hidden"
      >
        {/* Subtle background railway track grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#F5B82E_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Skip button in top corner */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700/80 text-xs font-mono tracking-wider transition-all hover:border-tomato hover:scale-105 active:scale-95 shadow-lg"
          aria-label="Skip introductory journey"
        >
          <span>Skip Journey</span>
          <span className="text-tomato font-bold">⏩ [ESC]</span>
        </button>

        {/* Browser Mockup Window */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#1B1A17] rounded-xl border border-stone-700/60 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Browser Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#141311] border-b border-stone-800">
            {/* Window control traffic lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E8452C] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#F5B82E] inline-block shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#2E7D32] inline-block shadow-sm" />
            </div>

            {/* Simulated Address Bar */}
            <div className="flex-1 max-w-md mx-3 px-3 py-1.5 rounded-lg bg-[#24221D] border border-stone-700/50 flex items-center gap-2 text-xs font-mono shadow-inner">
              <span className="text-emerald-500 font-bold">https://</span>
              <span className="text-stone-100 font-medium tracking-wide">
                {typedUrl}
              </span>
              {step === 'typing' && (
                <span className="inline-block w-2 h-4 bg-tomato animate-pulse" />
              )}
              {step !== 'typing' && (
                <span className="ml-auto text-[10px] text-stone-400 bg-stone-800 px-1 rounded">
                  ↵ Enter
                </span>
              )}
            </div>

            {/* Station stamp */}
            <span className="hidden sm:inline-block font-mono text-[10px] text-[#F5B82E] font-bold tracking-widest uppercase">
              STN-09
            </span>
          </div>

          {/* Browser Viewport Content Area */}
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] relative bg-gradient-to-b from-[#1B1A17] to-[#121110]">
            {/* Station Master Icon */}
            <motion.div
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-tomato/15 border border-tomato/40 flex items-center justify-center mb-5 text-2xl shadow-lg"
            >
              👨‍🍳
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F6EFE3] tracking-tight mb-2">
              Bawarchi Express
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-mono tracking-wide max-w-md mb-8">
              CodeChef ABESEC Chapter • Dispatching platform signals...
            </p>

            {/* Loading Track Container */}
            <div className="w-full max-w-md">
              {/* Train Track Visual */}
              <div className="relative h-7 bg-stone-900/90 rounded-lg p-1 border border-stone-800 flex items-center overflow-hidden">
                {/* Railway ties underneath */}
                <div className="absolute inset-0 flex justify-between px-2 opacity-30">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1 h-full bg-stone-500" />
                  ))}
                </div>

                {/* Progress Fill Line */}
                <div
                  className="h-2 bg-gradient-to-r from-tomato to-turmeric rounded-sm transition-all duration-75 relative z-10"
                  style={{ width: `${progress}%` }}
                >
                  {/* Moving Locomotive Train Head */}
                  <div className="absolute -right-3 -top-3 w-8 h-8 flex items-center justify-center transform text-base filter drop-shadow">
                    🚂
                  </div>
                </div>
              </div>

              {/* Progress Labels */}
              <div className="flex items-center justify-between text-[11px] font-mono mt-3 text-stone-400">
                <span className="flex items-center gap-1.5 text-turmeric font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-turmeric animate-ping" />
                  {step === 'typing'
                    ? 'Dialing address...'
                    : step === 'loading'
                    ? `Loading coach data: ${progress}%`
                    : 'Entering platform...'}
                </span>
                <span className="text-stone-500">All Aboard #TechChefs</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
