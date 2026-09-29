import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsRepo } from '../../repos/eventsRepo';
import { registrationsRepo } from '../../repos/registrationsRepo';
import type { EventItem, Registration } from '../../types';
import { StampBadge } from '../../components/brand/DoodleGraphics';
import {
  CalendarDays,
  Users,
  Clock,
  PlusCircle,
  Download,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    setEvents(eventsRepo.getAll());
    setRegistrations(registrationsRepo.getAll());
  }, []);

  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalBooked = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
  const nextEvent = events.find((e) => e.status !== 'Departed') || events[0];

  // Registrations per event data for bar chart
  const chartData = events.slice(0, 6).map((e) => ({
    name: e.title.length > 14 ? e.title.slice(0, 14) + '...' : e.title,
    count: e.registeredCount,
    capacity: e.capacity,
    category: e.category,
    pnr: e.pnr,
  }));

  const maxVal = Math.max(...chartData.map((d) => d.capacity), 100);

  return (
    <div className="space-y-8">
      {/* Title & Top Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <StampBadge label="STATION CONTROL ROOM" variant="red" rotate="-2deg" />
            <span className="font-mono text-xs text-stone-500 uppercase tracking-widest font-bold">
              Dispatch Dashboard
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-ink-light dark:text-ink-dark mt-1">
            Terminal Operations Hub
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/events"
            className="px-4 py-2.5 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Event</span>
          </Link>
          <Link
            to="/admin/registrations"
            className="px-4 py-2.5 bg-[#FFFDF9] dark:bg-[#1A1916] border border-[#DDD2C1] dark:border-[#38342D] text-stone-800 dark:text-stone-200 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Manifest</span>
          </Link>
        </div>
      </div>

      {/* 1. STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Events */}
        <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-mono text-xs uppercase font-bold tracking-wider">TOTAL EXPEDITIONS</span>
            <CalendarDays className="w-5 h-5 text-tomato" />
          </div>
          <div className="font-mono text-3xl font-black text-ink-light dark:text-ink-dark">
            {events.length}
          </div>
          <p className="font-mono text-xs text-stone-500">
            {events.filter((e) => e.status !== 'Departed').length} actively boarding
          </p>
        </div>

        {/* Total Registrations */}
        <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-mono text-xs uppercase font-bold tracking-wider">PASSENGERS BOOKED</span>
            <Users className="w-5 h-5 text-turmeric" />
          </div>
          <div className="font-mono text-3xl font-black text-ink-light dark:text-ink-dark">
            {totalBooked}
          </div>
          <p className="font-mono text-xs text-stone-500">
            {registrations.length} confirmed in local manifest
          </p>
        </div>

        {/* Fleet Occupancy */}
        <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-mono text-xs uppercase font-bold tracking-wider">FLEET OCCUPANCY</span>
            <span className="text-base">🚂</span>
          </div>
          <div className="font-mono text-3xl font-black text-coriander dark:text-emerald-400">
            {totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0}%
          </div>
          <p className="font-mono text-xs text-stone-500">
            {totalBooked} of {totalCapacity} total berths filled
          </p>
        </div>

        {/* Next Event */}
        <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-mono text-xs uppercase font-bold tracking-wider">NEXT DEPARTURE</span>
            <Clock className="w-5 h-5 text-tomato" />
          </div>
          <div className="font-mono text-base font-bold truncate text-ink-light dark:text-ink-dark" title={nextEvent?.title}>
            {nextEvent?.title || 'None'}
          </div>
          <p className="font-mono text-xs text-tomato font-semibold">
            {nextEvent?.date} ({nextEvent?.time})
          </p>
        </div>
      </div>

      {/* 2. REGISTRATIONS PER EVENT BAR CHART */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#DDD2C1] dark:border-[#38342D] pb-4">
          <div>
            <h3 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark">
              Registration Volume per Expedition
            </h3>
            <p className="text-xs font-mono text-stone-500">
              Real-time occupancy compared to maximum berth capacity
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-tomato" />
              <span>Booked Berths</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-stone-300 dark:bg-stone-700" />
              <span>Total Capacity</span>
            </span>
          </div>
        </div>

        {/* Clean SVG / HTML Bar Chart */}
        <div className="space-y-4 pt-2">
          {chartData.map((item, idx) => {
            const bookedPct = Math.min(100, Math.round((item.count / maxVal) * 100));
            const capacityPct = Math.min(100, Math.round((item.capacity / maxVal) * 100));

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-ink-light dark:text-ink-dark truncate max-w-[220px]">
                    {item.name}
                  </span>
                  <span className="text-stone-500 font-semibold">
                    <strong className="text-tomato">{item.count}</strong> / {item.capacity} booked
                  </span>
                </div>

                {/* Dual bar: Total capacity as track background, booked as fill */}
                <div className="relative h-6 bg-stone-200 dark:bg-stone-800 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700">
                  {/* Capacity Bar Ghost */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-stone-300/80 dark:bg-stone-700/80"
                    style={{ width: `${capacityPct}%` }}
                  />
                  {/* Booked Berths Fill */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-tomato transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-mono text-white font-bold"
                    style={{ width: `${bookedPct}%` }}
                  >
                    {bookedPct > 15 && `${Math.round((item.count / item.capacity) * 100)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. RECENT MANIFEST PASSENGERS TABLE SNIPPET */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDD2C1] dark:border-[#38342D] pb-3">
          <div>
            <h3 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark">
              Latest Passenger Registrations
            </h3>
            <p className="text-xs font-mono text-stone-500">
              Most recent berths reserved across all active routes
            </p>
          </div>
          <Link
            to="/admin/registrations"
            className="text-xs font-mono font-bold text-tomato hover:underline flex items-center gap-1"
          >
            <span>View Full Manifest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#DDD2C1] dark:border-[#38342D] text-stone-400 uppercase">
                <th className="py-2 px-3">PNR</th>
                <th className="py-2 px-3">Passenger</th>
                <th className="py-2 px-3">Expedition</th>
                <th className="py-2 px-3">College / Year</th>
                <th className="py-2 px-3">Berth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD2C1]/60 dark:divide-[#38342D]/60 text-ink-light dark:text-ink-dark">
              {registrations.slice(0, 5).map((reg) => (
                <tr key={reg.id} className="hover:bg-stone-500/5 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-tomato">{reg.pnr}</td>
                  <td className="py-2.5 px-3 font-medium">{reg.name}</td>
                  <td className="py-2.5 px-3 truncate max-w-[180px]">{reg.eventName}</td>
                  <td className="py-2.5 px-3 text-stone-500">{reg.college} ({reg.year})</td>
                  <td className="py-2.5 px-3 font-bold">{reg.berthNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
