import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsRepo } from '../repos/eventsRepo';
import type { EventItem } from '../types';
import { TicketStubBarcode } from '../components/tickets/TicketStubBarcode';
import { StampBadge, SteamCurls } from '../components/brand/DoodleGraphics';
import { BoardingPassModal } from '../components/tickets/BoardingPassModal';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const found = eventsRepo.getById(id);
      if (found) {
        setEvent(found);
      }
    }
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="text-4xl">🚂</div>
          <h2 className="text-2xl font-display font-bold">Ticket Not Found</h2>
          <p className="text-sm font-mono text-stone-500">
            This train route or ticket ID does not exist in our yard.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-tomato text-white rounded-lg font-mono text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Departures</span>
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = event.status === 'Sold Out' || event.status === 'Departed';

  return (
    <div className="min-h-screen bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] paper-texture py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors">
      {/* Back button */}
      <button
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-stone-600 dark:text-stone-400 hover:text-tomato transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Departures Yard</span>
      </button>

      {/* GIANT COMMEMORATIVE TICKET CONTAINER */}
      <article className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-3xl border-4 border-[#1B1A17] dark:border-[#EDE6DA] shadow-2xl overflow-hidden relative">
        {/* Ticket Top Ribbon */}
        <div className="bg-[#1B1A17] text-[#EDE6DA] px-6 py-3 flex items-center justify-between border-b-2 border-dashed border-stone-600">
          <div className="flex items-center gap-2">
            <span className="text-base">🎫</span>
            <span className="font-mono text-xs tracking-widest uppercase text-[#F5B82E] font-bold">
              OFFICIAL EXPEDITION TICKET • CODECHEF ABESEC
            </span>
          </div>
          <span className="font-mono text-xs text-stone-400">PNR: {event.pnr}</span>
        </div>

        {/* Ticket Interior */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StampBadge label={event.category} variant="yellow" rotate="-2deg" />
                {event.featured && (
                  <StampBadge label="CHEF'S SPECIAL" variant="red" rotate="2deg" />
                )}
                <span className="font-mono text-xs text-stone-500 font-semibold">
                  {event.trainName}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-ink-light dark:text-ink-dark tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-base text-stone-600 dark:text-stone-400 font-sans mt-1">
                {event.tagline}
              </p>
            </div>

            {/* Quick action */}
            {!isClosed ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3.5 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-sm font-extrabold uppercase tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-2 flex-shrink-0"
              >
                <span>Reserve Berth Now</span>
                <span>🎟️</span>
              </button>
            ) : (
              <span className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-xl font-mono text-xs font-bold uppercase">
                {event.status}
              </span>
            )}
          </div>

          {/* Schedule & Logistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FBF7EE] dark:bg-stone-900/60 border border-[#DDD2C1] dark:border-[#38342D]">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-tomato" />
                DATE
              </span>
              <span className="font-mono text-sm font-bold text-ink-light dark:text-ink-dark mt-0.5 block">
                {event.date}
              </span>
              <span className="text-[11px] font-mono text-stone-500">{event.time}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-turmeric" />
                PLATFORM
              </span>
              <span className="font-mono text-sm font-bold text-ink-light dark:text-ink-dark mt-0.5 block truncate">
                {event.platform.split('(')[0]}
              </span>
              <span className="text-[11px] font-mono text-stone-500">{event.coach}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                <Users className="w-3.5 h-3.5 inline mr-1 text-coriander" />
                OCCUPANCY
              </span>
              <span className="font-mono text-sm font-bold text-ink-light dark:text-ink-dark mt-0.5 block">
                {event.registeredCount} / {event.capacity}
              </span>
              <span className="text-[11px] font-mono text-tomato font-bold">
                {event.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                FARE
              </span>
              <span className="font-mono text-sm font-bold text-coriander dark:text-emerald-400 mt-0.5 block">
                FREE PASS
              </span>
              <span className="text-[11px] font-mono text-stone-500">Student ID Req.</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-display font-extrabold text-xl text-ink-light dark:text-ink-dark flex items-center gap-2">
              <SteamCurls className="w-5 h-5 text-tomato" />
              <span>Event Overview &amp; Recipe</span>
            </h3>
            <p className="text-stone-700 dark:text-stone-300 font-sans leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
          </div>

          {/* Prizes / Goodies (If any) */}
          {event.prizes && (
            <div className="p-6 rounded-2xl bg-[#FFFDF9] dark:bg-stone-900 border-2 border-[#DDD2C1] dark:border-[#38342D] space-y-4">
              <h3 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark flex items-center gap-2">
                <Trophy className="w-5 h-5 text-turmeric" />
                <span>Prizes &amp; Goodies Hamper</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-[#FAF6EC] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500 block uppercase text-[10px]">1st Place Winner</span>
                  <span className="font-bold text-tomato text-sm block mt-1">
                    {event.prizes.first}
                  </span>
                </div>
                {event.prizes.second && (
                  <div className="p-3 bg-[#FAF6EC] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block uppercase text-[10px]">2nd Place Runner Up</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark text-sm block mt-1">
                      {event.prizes.second}
                    </span>
                  </div>
                )}
                {event.prizes.third && (
                  <div className="p-3 bg-[#FAF6EC] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-500 block uppercase text-[10px]">3rd Place</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark text-sm block mt-1">
                      {event.prizes.third}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rules & Eligibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-stone-500 font-bold">
                BOARDING RULES &amp; CONDUCT
              </h4>
              <ul className="space-y-2 text-xs font-sans text-stone-700 dark:text-stone-300">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-tomato flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-stone-500 font-bold">
                PASSENGER ELIGIBILITY
              </h4>
              <p className="text-xs font-sans text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FBF7EE] dark:bg-stone-900 p-4 rounded-xl border border-[#DDD2C1] dark:border-[#38342D]">
                {event.eligibility}
              </p>
            </div>
          </div>

          {/* Bottom Barcode Perforation */}
          <div className="pt-6 border-t-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TicketStubBarcode code={event.pnr} height={40} className="text-stone-800 dark:text-stone-300" />
            </div>
            {!isClosed && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                Claim Boarding Pass 🎟️
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegistered={() => {
          if (id) {
            setEvent(eventsRepo.getById(id) || null);
          }
        }}
      />
    </div>
  );
};
