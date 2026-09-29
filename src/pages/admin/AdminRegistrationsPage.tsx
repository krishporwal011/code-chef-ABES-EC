import React, { useState, useEffect, useMemo } from 'react';
import { registrationsRepo } from '../../repos/registrationsRepo';
import { eventsRepo } from '../../repos/eventsRepo';
import type { Registration, EventItem } from '../../types';
import { StampBadge } from '../../components/brand/DoodleGraphics';
import {
  Search,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';

export const AdminRegistrationsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRegistrations(registrationsRepo.getAll());
    setEvents(eventsRepo.getAll());
  };

  // Filter & Sort
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((reg) => {
        const matchesEvent =
          selectedEventId === 'All' || reg.eventId === selectedEventId;
        const matchesYear =
          selectedYear === 'All' || reg.year === selectedYear;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          reg.name.toLowerCase().includes(q) ||
          reg.email.toLowerCase().includes(q) ||
          reg.phone.includes(q) ||
          reg.pnr.toLowerCase().includes(q) ||
          reg.eventName.toLowerCase().includes(q);

        return matchesEvent && matchesYear && matchesSearch;
      })
      .sort((a, b) => {
        const timeA = new Date(a.registeredAt).getTime();
        const timeB = new Date(b.registeredAt).getTime();
        return sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [registrations, selectedEventId, selectedYear, searchQuery, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRegistrations.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegistrations.slice(start, start + pageSize);
  }, [filteredRegistrations, currentPage, pageSize]);

  // Adjust page if filter shrinks total
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Cancel passenger reservation for ${name}?`)) {
      registrationsRepo.delete(id);
      refreshData();
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No passenger records to export.');
      return;
    }

    const headers = [
      'PNR',
      'Passenger Name',
      'Email',
      'Phone',
      'College',
      'Year',
      'Branch',
      'Event Name',
      'Berth',
      'Status',
      'Registered At',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.pnr}"`,
      `"${r.name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.college}"`,
      `"${r.year}"`,
      `"${r.branch || ''}"`,
      `"${r.eventName}"`,
      `"${r.berthNumber}"`,
      `"${r.ticketStatus}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bawarchi_express_manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <StampBadge label="PASSENGER MANIFEST" variant="red" rotate="-1deg" />
            <span className="font-mono text-xs text-stone-500 uppercase tracking-widest font-bold">
              Boarding Verification
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-ink-light dark:text-ink-dark mt-1">
            Registered Travelers &amp; Berths
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-coriander hover:bg-emerald-800 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Manifest (CSV)</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone or PNR..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-sans text-ink-light dark:text-ink-dark focus:ring-2 focus:ring-tomato"
            />
          </div>

          {/* Filter by Event */}
          <div className="sm:col-span-3">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono font-semibold"
            >
              <option value="All">All Expeditions</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Year */}
          <div className="sm:col-span-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono font-semibold"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        {/* Status Count and Sort bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDD2C1] dark:border-[#38342D] text-xs font-mono text-stone-500">
          <div>
            Showing <strong className="text-tomato">{filteredRegistrations.length}</strong> passengers
          </div>
          <button
            onClick={() => setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 font-bold text-ink-light dark:text-ink-dark hover:text-tomato"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Date: {sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
      <div className="hidden md:block bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#DDD2C1] dark:border-[#38342D] bg-[#FBF7EE] dark:bg-stone-900 text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Passenger Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">College / Year</th>
                <th className="py-3 px-4">Expedition</th>
                <th className="py-3 px-4">Berth</th>
                <th className="py-3 px-4">Registered At</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD2C1]/60 dark:divide-[#38342D]/60 text-ink-light dark:text-ink-dark">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No passengers match your current filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((reg) => (
                  <tr key={reg.id} className="hover:bg-stone-500/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-tomato">{reg.pnr}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm font-sans">{reg.name}</div>
                      <div className="text-[10px] text-stone-500">{reg.branch || 'General'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-0.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{reg.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium truncate max-w-[150px]">{reg.college}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold">
                        {reg.year}
                      </span>
                    </td>
                    <td className="py-3 px-4 truncate max-w-[160px] font-medium">
                      {reg.eventName}
                    </td>
                    <td className="py-3 px-4 font-bold text-coriander dark:text-emerald-400">
                      {reg.berthNumber}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(reg.id, reg.name)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 transition-colors"
                        title="Cancel Reservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE COLLAPSED CARDS VIEW (<md Breakpoint) */}
      <div className="md:hidden space-y-3">
        {paginatedItems.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-stone-500 bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border border-stone-300">
            No passengers found.
          </div>
        ) : (
          paginatedItems.map((reg) => (
            <div
              key={reg.id}
              className="p-4 bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-dashed border-stone-300 dark:border-stone-700 pb-2">
                <span className="font-mono text-xs font-bold text-tomato">{reg.pnr}</span>
                <span className="font-mono text-xs font-bold text-coriander dark:text-emerald-400">
                  {reg.berthNumber}
                </span>
              </div>

              <div>
                <h4 className="font-display font-extrabold text-base text-ink-light dark:text-ink-dark">
                  {reg.name}
                </h4>
                <p className="text-xs font-mono text-stone-500">{reg.eventName}</p>
              </div>

              <div className="text-xs font-mono space-y-1 text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span className="truncate">{reg.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{reg.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-stone-400" />
                  <span>{reg.college} • {reg.year}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-stone-400">
                  {new Date(reg.registeredAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(reg.id, reg.name)}
                  className="px-2.5 py-1 text-xs font-mono text-rose-600 bg-rose-500/10 rounded-lg hover:bg-rose-500/20"
                >
                  Cancel Pass
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between font-mono text-xs pt-2">
          <span className="text-stone-500">
            Page <strong className="text-ink-light dark:text-ink-dark">{currentPage}</strong> of{' '}
            {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FFFDF9] dark:bg-[#1A1916] disabled:opacity-40 hover:bg-stone-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FFFDF9] dark:bg-[#1A1916] disabled:opacity-40 hover:bg-stone-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
