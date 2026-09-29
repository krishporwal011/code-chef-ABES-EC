import React from 'react';
import { Link } from 'react-router-dom';
import { StampBadge, TrainTrackBorder } from '../components/brand/DoodleGraphics';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 paper-texture bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] select-none">
      <div className="max-w-md w-full bg-[#FFFDF9] dark:bg-[#1A1916] rounded-3xl border-4 border-[#1B1A17] dark:border-[#EDE6DA] p-8 sm:p-10 text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Notched tickets effect */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        <div className="w-20 h-20 mx-auto rounded-full bg-tomato/10 border-2 border-tomato flex items-center justify-center text-4xl">
          🚉
        </div>

        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <StampBadge label="SIGNAL RED" variant="red" rotate="-3deg" />
            <StampBadge label="LOST PASSENGER" variant="yellow" rotate="3deg" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-ink-light dark:text-ink-dark tracking-tight">
            Train Missed! Wrong Platform
          </h1>
          <p className="text-xs sm:text-sm font-sans text-stone-600 dark:text-stone-400 leading-relaxed">
            <span className="font-mono text-tomato font-bold">Gadi chhoot gayi!</span> Looks like you took a track switch to a platform that doesn't exist on the Bawarchi Express network.
          </p>
        </div>

        {/* Decorative Track */}
        <TrainTrackBorder className="w-full h-3 text-[#DDD2C1] dark:text-[#38342D]" />

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/"
            className="flex-1 py-3 px-4 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold tracking-wide uppercase transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Station</span>
          </Link>
          <Link
            to="/events"
            className="py-3 px-4 bg-[#F6EFE3] dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-[#DDD2C1] dark:border-[#38342D] rounded-xl font-mono text-xs font-bold tracking-wide uppercase hover:bg-stone-200 transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Departures</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
