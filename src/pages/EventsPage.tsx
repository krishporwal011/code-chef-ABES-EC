import React, { useState, useMemo, useEffect } from 'react';
import { eventsRepo } from '../repos/eventsRepo';
import type { EventCategory, EventItem } from '../types';
import { TicketCard } from '../components/tickets/TicketCard';
import { BoardingPassModal } from '../components/tickets/BoardingPassModal';
import { SplitFlapDeparturesBoard } from '../components/motion/SplitFlapBoard';
import { StampBadge } from '../components/brand/DoodleGraphics';
import { Search, Filter, ArrowUpDown, RefreshCw } from 'lucide-react';

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Hackathon',
  'Competitive Coding',
  'Workshop',
  'Design',
  'Fun/Quiz',
  'Mentorship',
];

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);

  // Registration Modal State
  const [selectedEventForModal, setSelectedEventForModal] = useState<EventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load events
  useEffect(() => {
    setEvents(eventsRepo.getAll());
  }, []);

  // Debounce search query
  useEffect(() => {
    if (!searchQuery) {
      setDebouncedQuery('');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsLoading(false);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesCategory =
          selectedCategory === 'All' || event.category === selectedCategory;
        const q = debouncedQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          event.title.toLowerCase().includes(q) ||
          event.pnr.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.tagline.toLowerCase().includes(q) ||
          event.platform.toLowerCase().includes(q);

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      });
  }, [events, selectedCategory, debouncedQuery, sortOrder]);

  const handleOpenRegister = (event: EventItem) => {
    setSelectedEventForModal(event);
    setIsModalOpen(true);
  };

  const handleRegistrationCompleted = () => {
    // Refresh repo events to update berth count
    setEvents(eventsRepo.getAll());
  };

  // Departures Board data for Retro Solari Board Header
  const departureRows = useMemo(() => {
    return events.slice(0, 5).map((e) => ({
      id: e.id,
      pnr: e.pnr,
      time: e.time.split(' ')[0],
      destination: e.title,
      tagline: e.tagline,
      category: e.category,
      platform: e.platform.split('(')[0].replace('Platform', 'PF').trim(),
      platformDetail: e.platform.includes('(') ? e.platform.split('(')[1].replace(')', '') : undefined,
      status: e.status,
      registeredCount: e.registeredCount,
      capacity: e.capacity,
      onAction: () => handleOpenRegister(e),
    }));
  }, [events]);

  return (
    <div className="min-h-screen bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] paper-texture py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors">
      {/* Header Area */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StampBadge label="DEPARTURES YARD" variant="red" rotate="-2deg" />
              <span className="font-mono text-xs font-bold text-stone-500 uppercase tracking-widest">
                Real-Time Schedule
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-ink-light dark:text-ink-dark tracking-tight">
              All Scheduled Events &amp; Expeditions
            </h1>
          </div>
          <div className="font-mono text-xs text-stone-500 bg-[#FFFDF9] dark:bg-[#1A1916] border border-[#DDD2C1] dark:border-[#38342D] px-3.5 py-2 rounded-xl">
            Total Expeditions: <strong className="text-tomato">{events.length}</strong>
          </div>
        </div>

        {/* 1. AUTHENTIC MECHANICAL SPLIT-FLAP BOARD */}
        <div className="pt-2">
          <SplitFlapDeparturesBoard rows={departureRows} />
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS TOOLBAR */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-4 sm:p-5 shadow-sm space-y-4 mb-8">
        {/* Search input and Sort dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Live Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, PNR, platform, or topic (e.g. Harry Potter, DevShastra)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans text-ink-light dark:text-ink-dark placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-tomato transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-mono text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Order */}
          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-mono text-stone-500 uppercase">Sort by Date:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 font-mono text-xs font-bold text-ink-light dark:text-ink-dark focus:outline-hidden focus:ring-2 focus:ring-tomato"
            >
              <option value="asc">Earliest First ➔</option>
              <option value="desc">Latest First ➔</option>
            </select>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <Filter className="w-4 h-4 text-tomato flex-shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-mono text-xs whitespace-nowrap font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-tomato text-white shadow-xs'
                  : 'bg-[#F6EFE3] dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'All' ? 'All Tracks' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. EVENT TICKET CARDS FEED */}
      {isLoading ? (
        /* SKELETON LOADERS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 animate-pulse border border-stone-300 dark:border-stone-700 p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-1/3 h-4 bg-stone-300 dark:bg-stone-700 rounded" />
                <div className="w-3/4 h-6 bg-stone-300 dark:bg-stone-700 rounded" />
                <div className="w-full h-3 bg-stone-300 dark:bg-stone-700 rounded" />
              </div>
              <div className="w-1/2 h-4 bg-stone-300 dark:bg-stone-700 rounded" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        /* ANIMATED EMPTY STATE */
        <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-3xl border-2 border-dashed border-[#DDD2C1] dark:border-[#38342D] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-tomato/10 flex items-center justify-center text-4xl animate-bounce">
            🍲
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-2xl text-ink-light dark:text-ink-dark">
              Kitchen is Empty! No Events Found
            </h3>
            <p className="text-sm font-sans text-stone-600 dark:text-stone-400">
              No train routes match your current query "{debouncedQuery}". Try selecting another category or resetting the filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 bg-tomato text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-tomato-hover transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Search Filters</span>
          </button>
        </div>
      ) : (
        /* TICKET CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <TicketCard
              key={event.id}
              event={event}
              onRegisterClick={handleOpenRegister}
            />
          ))}
        </div>
      )}

      {/* Boarding Pass Registration Modal */}
      <BoardingPassModal
        event={selectedEventForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEventForModal(null);
        }}
        onRegistered={handleRegistrationCompleted}
      />
    </div>
  );
};
