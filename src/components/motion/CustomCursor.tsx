import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"]')
        );
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      className="fixed pointer-events-none z-[9999] -translate-x-1.5 -translate-y-1.5 transition-transform duration-75"
    >
      <motion.div
        animate={{
          scale: isClicking ? 0.85 : isPointer ? 1.25 : 1,
          rotate: isPointer ? -8 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 350 }}
        className="relative"
      >
        {/* Custom Chef Hat Pointer SVG */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Chef Hat Toque */}
          <path
            d="M8 18C7 16 7 13 9 12C10.5 11 12 11 13 11.5C14 9.5 16.5 9 18 10C19 10.5 19.5 11.5 19.5 12.5C21 12 22.5 13.5 22.5 15.5C22.5 17 21.5 18 20.5 18.5"
            fill="#FFFDF9"
            stroke="#1B1A17"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Brim */}
          <rect
            x="7.5"
            y="18"
            width="14"
            height="5"
            rx="1.5"
            fill="#E8452C"
            stroke="#1B1A17"
            strokeWidth="1.5"
          />
          {/* Cursor Pointer Arrow Tip at Top-Left */}
          <polygon
            points="2,2 11,8 7,10 5,14"
            fill="#1B1A17"
            stroke="#FFFDF9"
            strokeWidth="1.5"
          />
          {/* Tiny Steam Puff */}
          <circle cx="12" cy="7" r="1.2" fill="#F5B82E" />
          <circle cx="16" cy="6" r="1" fill="#E8452C" />
        </svg>

        {/* Trail Particle */}
        {isPointer && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-turmeric opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tomato"></span>
          </span>
        )}
      </motion.div>
    </div>
  );
};
