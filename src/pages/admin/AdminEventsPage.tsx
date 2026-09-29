import React, { useState, useEffect } from 'react';
import { eventsRepo } from '../../repos/eventsRepo';
import type { EventItem, EventCategory, EventStatus } from '../../types';
import { StampBadge } from '../../components/brand/DoodleGraphics';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Star,
  X,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('Hackathon');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formPlatform, setFormPlatform] = useState('');
  const [formCoach, setFormCoach] = useState('');
  const [formCapacity, setFormCapacity] = useState(150);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<EventStatus>('Open');

  useEffect(() => {
    refreshEvents();
  }, []);

  const refreshEvents = () => {
    setEvents(eventsRepo.getAll());
  };

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormTagline('');
    setFormCategory('Hackathon');
    setFormDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setFormTime('10:00 AM IST');
    setFormPlatform('Platform #1 (Main Auditorium)');
    setFormCoach('Coach A-01');
    setFormCapacity(150);
    setFormDescription('');
    setFormFeatured(false);
    setFormStatus('Open');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormTagline(event.tagline || '');
    setFormCategory(event.category);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormPlatform(event.platform);
    setFormCoach(event.coach || 'Coach B-1');
    setFormCapacity(event.capacity);
    setFormDescription(event.description);
    setFormFeatured(event.featured);
    setFormStatus(event.status);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formDate || !formPlatform.trim()) {
      alert('Please fill out the event title, date, and venue platform.');
      return;
    }

    if (editingEvent) {
      // Update existing
      eventsRepo.update(editingEvent.id, {
        title: formTitle.trim(),
        tagline: formTagline.trim(),
        category: formCategory,
        date: formDate,
        time: formTime,
        platform: formPlatform.trim(),
        coach: formCoach.trim(),
        capacity: Number(formCapacity),
        description: formDescription.trim(),
        featured: formFeatured,
        status: formStatus,
      });
      showToast(`Expedition "${formTitle}" updated successfully!`);
    } else {
      // Create new
      eventsRepo.create({
        title: formTitle.trim(),
        tagline: formTagline.trim(),
        category: formCategory,
        date: formDate,
        time: formTime,
        platform: formPlatform.trim(),
        coach: formCoach.trim() || 'Coach B-1',
        capacity: Number(formCapacity),
        description: formDescription.trim(),
        featured: formFeatured,
        status: formStatus,
        rules: ['Bring your valid college ID.', 'Adhere to CodeChef ABESEC code of conduct.'],
        eligibility: 'Open to all enrolled university students.',
      });
      showToast(`New expedition "${formTitle}" added to the platform!`);
    }

    setIsModalOpen(false);
    refreshEvents();
  };

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      eventsRepo.delete(deleteCandidate.id);
      showToast(`Expedition "${deleteCandidate.title}" removed.`, 'info');
      setDeleteCandidate(null);
      refreshEvents();
    }
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    if (current) return; // Keep at least one featured
    eventsRepo.update(id, { featured: true });
    showToast('Featured spotlight updated!');
    refreshEvents();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-stone-900 text-white border-2 border-tomato rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 font-mono text-xs">
          <CheckCircle className="w-5 h-5 text-tomato flex-shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <StampBadge label="TRAIN SCHEDULER" variant="yellow" rotate="-1deg" />
            <span className="font-mono text-xs text-stone-500 uppercase tracking-widest font-bold">
              Events Management
            </span>
          </div>
          <h1 className="text-3xl font-display font-black text-ink-light dark:text-ink-dark mt-1">
            Scheduled Expeditions &amp; Hackathons
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {/* Events Table / Card Feed */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-[#DDD2C1] dark:border-[#38342D] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#DDD2C1] dark:border-[#38342D] bg-[#FBF7EE] dark:bg-stone-900 text-stone-500 uppercase tracking-wider">
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD2C1]/60 dark:divide-[#38342D]/60 text-ink-light dark:text-ink-dark">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-stone-500/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-tomato">{evt.pnr}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold font-sans text-sm">{evt.title}</div>
                    <div className="text-[10px] text-stone-500 truncate max-w-xs">{evt.tagline}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px]">
                      {evt.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold">{evt.date}</div>
                    <div className="text-[10px] text-stone-500">{evt.time}</div>
                  </td>
                  <td className="py-3 px-4 truncate max-w-[140px]">{evt.platform}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold">{evt.registeredCount}</span> / {evt.capacity}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(evt.id, evt.featured)}
                      className={`p-1 rounded transition-colors ${
                        evt.featured ? 'text-turmeric' : 'text-stone-300 dark:text-stone-700 hover:text-turmeric'
                      }`}
                      title={evt.featured ? 'Currently Featured' : 'Set as Featured Spotlight'}
                    >
                      <Star className={`w-4 h-4 ${evt.featured ? 'fill-turmeric' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(evt)}
                        className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-tomato transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(evt)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-tomato shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD2C1] dark:border-[#38342D] bg-[#FBF7EE] dark:bg-stone-900">
              <h3 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark">
                {editingEvent ? 'Edit Expedition Details' : 'Schedule New Expedition'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. DevShastra 2026"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Catchy Tagline
                  </label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. 24-Hour Hackathon of North India"
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Category Genre *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competitive Coding">Competitive Coding</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Design">Design</option>
                    <option value="Fun/Quiz">Fun/Quiz</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EventStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  >
                    <option value="Open">Open</option>
                    <option value="Filling Fast">Filling Fast</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Departed">Departed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Departure Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Departure Time *
                  </label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 10:00 AM IST"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Platform / Venue *
                  </label>
                  <input
                    type="text"
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value)}
                    placeholder="e.g. Platform #1 (Auditorium)"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Total Berth Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase mb-1">
                    Description &amp; Rules Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detailed event culinary overview..."
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-sm font-sans focus:ring-2 focus:ring-tomato"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-check"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-tomato focus:ring-tomato w-4 h-4"
                  />
                  <label htmlFor="featured-check" className="text-xs font-mono font-bold cursor-pointer">
                    Set as Flagship Featured Spotlight (Home Hero)
                  </label>
                </div>
              </div>

              {/* Submit bar */}
              <div className="pt-4 border-t border-[#DDD2C1] dark:border-[#38342D] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-tomato hover:bg-tomato-hover text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {editingEvent ? 'Save Changes' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] dark:bg-[#1A1916] rounded-2xl border-2 border-rose-500 p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-display font-extrabold text-lg text-ink-light dark:text-ink-dark">
                Cancel Expedition?
              </h4>
              <p className="text-xs font-sans text-stone-500">
                Are you sure you want to delete <strong className="text-rose-600">{deleteCandidate.title}</strong>? All registered tickets on this route will be invalidated.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-mono font-bold"
              >
                No, Keep
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-mono font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
