import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { EventItem } from '../../types';
import { TicketStubBarcode } from './TicketStubBarcode';
import { StampBadge } from '../brand/DoodleGraphics';
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react';

interface TicketCardProps {
  event: EventItem;
  onRegisterClick?: (event: EventItem) => void;
  featured?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  event,
  onRegisterClick,
  featured = false,
}) => {
  const isSoldOut = event.status === 'Sold Out';
  const isDeparted = event.status === 'Departed';
  const isClosed = isSoldOut || isDeparted;

  const categoryColorMap: Record<string, string> = {
    Hackathon: 'bg-tomato/10 text-tomato border-tomato/30',
    'Competitive Coding': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    Workshop: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    Design: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
    'Fun/Quiz': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    Mentorship: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
  };

  const occupancyPct = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`relative group bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col md:flex-row overflow-hidden ${
        featured
          ? 'border-tomato shadow-tomato/10'
          : 'border-[#DDD2C1] dark:border-[#38342D] hover:border-tomato/70 dark:hover:border-tomato/70'
      }`}
    >
      {/* Top Banner for Featured or High Priority */}
      {featured && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-tomato via-turmeric to-tomato z-20" />
      )}

      {/* MAIN TICKET BODY */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between relative">
        {/* Top Meta Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                PNR: {event.pnr}
              </span>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded-full border font-semibold ${
                  categoryColorMap[event.category] || 'bg-stone-100 text-stone-700'
                }`}
              >
                {event.category}
              </span>
            </div>

            {/* Stamp status */}
            {event.featured && (
              <StampBadge label="CHEF'S SPECIAL" variant="red" rotate="-2deg" />
            )}
            {!event.featured && event.status === 'Filling Fast' && (
              <StampBadge label="FILLING FAST" variant="yellow" rotate="2deg" />
            )}
            {isSoldOut && (
              <StampBadge label="SOLD OUT" variant="red" rotate="-4deg" />
            )}
            {isDeparted && (
              <StampBadge label="DEPARTED" variant="charcoal" rotate="-2deg" />
            )}
          </div>

          {/* Event Title & Tagline */}
          <Link
            to={`/events/${event.id}`}
            className="group/title block focus:outline-hidden focus:ring-2 focus:ring-tomato rounded-md"
          >
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-snug group-hover/title:text-tomato transition-colors">
              {event.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans mt-1 line-clamp-2">
            {event.tagline || event.description}
          </p>
        </div>

        {/* Departure Logistics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 py-3 border-y border-dashed border-[#DDD2C1] dark:border-[#38342D] bg-[#FBF7EE]/80 dark:bg-stone-900/90 rounded-lg px-3">
          {/* Date & Time */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-tomato" /> DEPARTS
            </span>
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {event.date}
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
              {event.time}
            </span>
          </div>

          {/* Venue / Platform */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-turmeric" /> PLATFORM
            </span>
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100 mt-0.5 truncate">
              {event.platform.split('(')[0].trim()}
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
              {event.coach}
            </span>
          </div>

          {/* Capacity occupancy */}
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 dark:text-stone-400 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-coriander dark:text-emerald-400" /> BERTHS
              </span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {event.registeredCount}/{event.capacity}
              </span>
            </div>
            <div className="w-full bg-[#EAE2D2] dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPct >= 90 ? 'bg-tomato' : occupancyPct >= 60 ? 'bg-turmeric' : 'bg-coriander dark:bg-emerald-500'
                }`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <Link
            to={`/events/${event.id}`}
            className="text-xs font-mono text-stone-700 dark:text-stone-300 hover:text-tomato flex items-center gap-1 font-semibold group-hover:underline"
          >
            <span>Inspect Ticket</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {!isClosed ? (
              <button
                type="button"
                onClick={() => onRegisterClick?.(event)}
                className="px-4 py-2 bg-tomato hover:bg-tomato-hover text-white rounded-lg font-mono text-xs font-bold tracking-wide transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 focus:ring-2 focus:ring-tomato focus:ring-offset-2"
              >
                <span>Reserve Berth</span>
                <span>🎟️</span>
              </button>
            ) : (
              <span className="px-3.5 py-1.5 bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-lg font-mono text-xs font-semibold select-none">
                {isSoldOut ? 'Berths Full' : 'Departed'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PERFORATION NOTCHES & LINE (Desktop: Vertical separator; Mobile: Horizontal) */}
      <div className="relative md:w-36 bg-[#FBF7EE] dark:bg-[#161513] border-t-2 md:border-t-0 md:border-l-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] p-4 flex md:flex-col items-center justify-between md:justify-center gap-4 text-center">
        {/* Cutout notch circles */}
        <div className="hidden md:block absolute -top-3 left-[-9px] w-4 h-4 rounded-full bg-paper-light dark:bg-paper-dark border border-[#DDD2C1] dark:border-[#38342D]" />
        <div className="hidden md:block absolute -bottom-3 left-[-9px] w-4 h-4 rounded-full bg-paper-light dark:bg-paper-dark border border-[#DDD2C1] dark:border-[#38342D]" />

        {/* Ticket Stub Details */}
        <div className="text-left md:text-center">
          <span className="text-[9px] font-mono tracking-widest uppercase text-stone-500 block">
            PASSENGER STUB
          </span>
          <span className="font-mono text-xs font-black text-ink-light dark:text-ink-dark mt-0.5 block">
            {event.pnr}
          </span>
          <span className="text-[10px] font-mono text-stone-500 block">
            {event.coach}
          </span>
        </div>

        {/* Barcode Graphic */}
        <TicketStubBarcode code={event.pnr} height={32} className="text-stone-800 dark:text-stone-300" />

        <div className="text-right md:text-center">
          <span className="text-[9px] font-mono text-stone-500 block">CLASS</span>
          <span className="font-mono text-xs font-bold text-tomato block">
            CONFIRMED
          </span>
        </div>
      </div>
    </motion.article>
  );
};
