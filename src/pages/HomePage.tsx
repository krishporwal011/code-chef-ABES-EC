import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventsRepo } from '../repos/eventsRepo';
import { DEPARTMENTS } from '../data/departments';
import type { EventItem } from '../types';
import { TicketCard } from '../components/tickets/TicketCard';
import { BoardingPassModal } from '../components/tickets/BoardingPassModal';
import { StampBadge, SteamCurls, TrainTrackBorder, RailwaySignal } from '../components/brand/DoodleGraphics';
import { MarqueeTicker } from '../components/layout/MarqueeTicker';
import {
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Flame,
  Terminal,
  Cpu,
  Palette,
  Feather,
  Clock,
  Handshake,
  Share2,
  Video,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const allEvents = eventsRepo.getAll();
  const featuredEvent = eventsRepo.getFeatured();
  const upcomingStrip = allEvents.filter((e) => e.status !== 'Departed').slice(0, 3);

  const handleOpenRegister = (event: EventItem) => {
    setSelectedEventForModal(event);
    setIsModalOpen(true);
  };

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-tomato" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-500" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-purple-500" />;
      case 'Feather':
        return <Feather className="w-6 h-6 text-emerald-500" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-blue-500" />;
      case 'Handshake':
        return <Handshake className="w-6 h-6 text-orange-500" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-pink-500" />;
      case 'Video':
        return <Video className="w-6 h-6 text-red-500" />;
      default:
        return <Flame className="w-6 h-6 text-turmeric" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] font-sans paper-texture transition-colors">
      {/* Platform Marquee Ticker */}
      <MarqueeTicker />

      {/* 1. HERO SECTION: "PLATFORM JUNCTION" */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Train Track & Signal Accents */}
        <div className="absolute right-4 top-8 opacity-15 hidden lg:block pointer-events-none">
          <RailwaySignal className="w-28 h-28" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StampBadge label="ABESEC JUNCTION" variant="red" rotate="-2deg" />
              <StampBadge label="TRAIN #2026" variant="yellow" rotate="3deg" />
              <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">
                Platform #1 is Clear
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-[#1B1A17] dark:text-[#F6EFE3]">
              All Aboard, <br />
              <span className="text-tomato relative inline-block">
                Creators &amp; Explorers.
                {/* SVG Underline Squiggle */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-turmeric opacity-80"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C50 2 150 2 198 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-sans max-w-2xl leading-relaxed">
              <span className="font-bold text-tomato font-mono">Chaliye shuru karte hain!</span> Welcome to the <strong className="text-ink-light dark:text-ink-dark">CodeChef ABESEC Chapter</strong>—where algorithmic recipes meet high-voltage hackathons. From fresh apprentices to seasoned DSA head chefs, your tech journey departs from here.
            </p>

            {/* Station stats bar */}
            <div className="grid grid-cols-3 gap-4 py-4 px-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A1916] border-2 border-[#DDD2C1] dark:border-[#38342D] max-w-lg shadow-sm">
              <div>
                <span className="block text-2xl sm:text-3xl font-mono font-black text-tomato">
                  {allEvents.length}+
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Active Routes
                </span>
              </div>
              <div className="border-x border-stone-300 dark:border-stone-700 px-3">
                <span className="block text-2xl sm:text-3xl font-mono font-black text-turmeric-dark dark:text-turmeric">
                  1,200+
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Passengers
                </span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-mono font-black text-coriander dark:text-emerald-400">
                  24 hrs
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  Kitchen Steam
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/events"
                className="px-6 py-3.5 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-sm font-extrabold tracking-wide uppercase shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Inspect Departures</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => handleOpenRegister(featuredEvent)}
                className="px-6 py-3.5 bg-[#FFFDF9] dark:bg-[#1A1916] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-800 dark:border-stone-500 rounded-xl font-mono text-sm font-bold tracking-wide transition-all shadow-xs active:scale-95 flex items-center gap-2"
              >
                <span>Claim Boarding Pass</span>
                <span>🎫</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual: The Interactive Railway Junction Pass */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ rotate: -2, y: 10 }}
              animate={{ rotate: 1, y: 0 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: 4, ease: 'easeInOut' }}
              className="relative p-6 sm:p-8 bg-[#FFFDF9] dark:bg-[#1A1916] rounded-3xl border-4 border-[#1B1A17] dark:border-[#EDE6DA] shadow-2xl space-y-5"
            >
              {/* Paper header banner */}
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] pb-4">
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-stone-500 block">
                    SPECIAL DISPATCH
                  </span>
                  <span className="font-display font-black text-xl text-ink-light dark:text-ink-dark">
                    Bawarchi Express No. 12401
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-tomato/15 border-2 border-tomato flex items-center justify-center text-xl">
                  👨‍🍳
                </div>
              </div>

              {/* Destination box */}
              <div className="bg-[#FAF6EC] dark:bg-stone-900/60 p-4 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-stone-500">
                  <span>ORIGIN: ABESEC GZB</span>
                  <span>DESTINATION: DEPLOYMENT</span>
                </div>
                <div className="flex items-center justify-between font-display font-extrabold text-2xl text-tomato">
                  <span>DEV-SHASTRA</span>
                  <span className="text-stone-400">➔</span>
                  <span>VICTORY</span>
                </div>
              </div>

              {/* Perks & Spices */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <span className="w-2 h-2 rounded-full bg-coriander" />
                  <span>24-Hour Non-stop Compute &amp; Mentorship</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <span className="w-2 h-2 rounded-full bg-turmeric" />
                  <span>₹1,50,000 Total Prize Pool &amp; Swags</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <span className="w-2 h-2 rounded-full bg-tomato" />
                  <span>Unlimited Chai, Snacks &amp; Midnight Maggi</span>
                </div>
              </div>

              {/* Bottom Quick CTA */}
              <button
                type="button"
                onClick={() => handleOpenRegister(featuredEvent)}
                className="w-full py-3 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Reserve Berth on Express</span>
                <span>🎟️</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Track Divider */}
      <div className="max-w-7xl mx-auto px-4 opacity-50 my-6">
        <TrainTrackBorder className="w-full h-3 text-[#DDD2C1] dark:text-[#38342D]" />
      </div>

      {/* 2. UPCOMING DEPARTURES STRIP */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-tomato font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <SteamCurls className="w-4 h-4 text-tomato" />
              <span>Next Trains on the Track</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink-light dark:text-ink-dark">
              Upcoming Departures
            </h2>
          </div>
          <Link
            to="/events"
            className="font-mono text-xs uppercase tracking-wider font-bold text-stone-600 dark:text-stone-400 hover:text-tomato flex items-center gap-1.5"
          >
            <span>View All Schedules ({allEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Ticket Cards in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingStrip.map((event) => (
            <TicketCard
              key={event.id}
              event={event}
              onRegisterClick={handleOpenRegister}
            />
          ))}
        </div>
      </section>

      {/* 3. FEATURED SPOTLIGHT: DEVSHASTRA 2026 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#1B1A17] text-[#EDE6DA] p-6 sm:p-12 border-4 border-[#F5B82E] shadow-2xl overflow-hidden">
          {/* Background ambient gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-tomato/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <StampBadge label="FLAGSHIP HACKATHON" variant="yellow" rotate="-2deg" />
                <StampBadge label="24 HOURS SPRINT" variant="red" rotate="2deg" />
                <span className="font-mono text-xs text-turmeric font-bold">
                  {featuredEvent.trainName}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#F6EFE3] tracking-tight leading-tight">
                {featuredEvent.title}
              </h2>

              <p className="text-base text-stone-300 font-sans leading-relaxed max-w-2xl">
                {featuredEvent.description}
              </p>

              {/* Prize & Platform Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-700/60 flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-turmeric flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      GRAND PRIZE
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {featuredEvent.prizes?.first}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-700/60 flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-tomato flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                      VENUE PLATFORM
                    </span>
                    <span className="text-sm font-mono font-bold text-white">
                      {featuredEvent.platform}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenRegister(featuredEvent)}
                  className="px-6 py-3.5 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-sm font-extrabold uppercase tracking-wide transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <span>Reserve Hackathon Berth</span>
                  <span>🎟️</span>
                </button>
                <Link
                  to={`/events/${featuredEvent.id}`}
                  className="px-5 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-mono text-sm font-semibold transition-colors"
                >
                  Read Full Rulebook
                </Link>
              </div>
            </div>

            {/* Right: Countdown & Occupancy Ticket Gauge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-[#24221D] p-6 rounded-2xl border-2 border-dashed border-[#F5B82E]/50 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-tomato/20 border-2 border-tomato flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5B82E] font-bold block">
                    SEAT OCCUPANCY METER
                  </span>
                  <span className="text-3xl font-mono font-black text-white block mt-1">
                    {featuredEvent.registeredCount} / {featuredEvent.capacity}
                  </span>
                  <span className="text-xs font-mono text-stone-400 block mt-0.5">
                    Berths Already Locked
                  </span>
                </div>

                <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-turmeric to-tomato rounded-full"
                    style={{
                      width: `${Math.round(
                        (featuredEvent.registeredCount / featuredEvent.capacity) * 100
                      )}%`,
                    }}
                  />
                </div>

                <div className="p-3 bg-stone-900 rounded-lg text-xs font-mono text-stone-300">
                  <Calendar className="w-4 h-4 inline mr-1 text-tomato" />
                  Departure Date: <strong className="text-white">{featuredEvent.date}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KITCHEN STATIONS (DEPARTMENTS) */}
      <section id="kitchen" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2">
            <StampBadge label="BAWARCHIKHAANA" variant="green" rotate="-2deg" />
            <span className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">
              8 Kitchen Stations
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-ink-light dark:text-ink-dark">
            Meet the Bawarchis Behind the Dish
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
            Every grand feast requires distinct master chefs. From low-level memory plating to viral social hype, here are the 8 active departments powering CodeChef ABESEC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEPARTMENTS.map((dept) => (
            <motion.div
              key={dept.id}
              whileHover={{ y: -5 }}
              className="p-5 rounded-2xl bg-[#FFFDF9] dark:bg-[#1A1916] border-2 border-[#DDD2C1] dark:border-[#38342D] hover:border-tomato/80 dark:hover:border-tomato/80 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-tomato/10 flex items-center justify-center">
                    {getDepartmentIcon(dept.icon)}
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                    {dept.stationCode}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark">
                  {dept.name}
                </h3>
                <span className="font-mono text-[11px] font-bold text-tomato block mb-2">
                  {dept.stationName}
                </span>

                <p className="text-xs font-sans text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                  {dept.description}
                </p>
              </div>

              {/* Spices tags */}
              <div className="pt-3 border-t border-dashed border-[#DDD2C1] dark:border-[#38342D]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1.5">
                  SECRET SPICES:
                </span>
                <div className="flex flex-wrap gap-1">
                  {dept.spices.slice(0, 3).map((spice, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F6EFE3] dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      {spice}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION / RECRUITMENT JOURNEY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-tomato to-[#C9331B] text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <StampBadge label="ANNUAL RECRUITMENT RUN" variant="yellow" rotate="-1deg" />
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
              Ready to Serve Your Dish?
            </h2>
            <p className="text-sm sm:text-base font-sans text-rose-100 leading-relaxed">
              Whether you write backend APIs, solve NP-hard graphs, paint Figma canvases, or hype up crowds—there is a berth with your name on it on the Bawarchi Express.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/events"
                className="px-6 py-3.5 bg-white text-tomato hover:bg-stone-100 rounded-xl font-mono text-sm font-extrabold uppercase tracking-wide transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Browse All Events &amp; Workshops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        event={selectedEventForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEventForModal(null);
        }}
      />
    </div>
  );
};
