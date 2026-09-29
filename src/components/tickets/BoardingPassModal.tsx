import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import type { EventItem, Registration } from '../../types';
import { registrationsRepo } from '../../repos/registrationsRepo';
import { eventsRepo } from '../../repos/eventsRepo';
import { TicketStubBarcode } from './TicketStubBarcode';
import { StampBadge } from '../brand/DoodleGraphics';
import { X, CheckCircle2, Calendar, Download, AlertCircle } from 'lucide-react';

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

const registrationSchema = z.object({
  name: z.string().min(2, 'Please enter your full name (minimum 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number (starts with 6-9)'),
  college: z.string().min(2, 'Please enter your college name'),
  year: z.enum(YEAR_OPTIONS),
  branch: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface BoardingPassModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRegistered?: () => void;
}

export const BoardingPassModal: React.FC<BoardingPassModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegistered,
}) => {
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<Registration | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      year: '1st Year',
      college: 'ABES Engineering College',
    },
  });

  if (!isOpen || !event) return null;

  const onSubmit = (data: RegistrationFormData) => {
    setDuplicateError(null);

    // Duplicate check
    const isDup = registrationsRepo.checkDuplicate(data.email, event.id);
    if (isDup) {
      setDuplicateError(
        `A boarding pass for ${data.email} is already reserved for ${event.title}! Duplicate reservations are blocked.`
      );
      return;
    }

    // Save registration
    const newReg = registrationsRepo.create({
      eventId: event.id,
      eventName: event.title,
      name: data.name,
      email: data.email,
      phone: data.phone,
      college: data.college,
      year: data.year,
      branch: data.branch || 'General',
    });

    // Update event registered count
    eventsRepo.incrementRegistration(event.id);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E8452C', '#F5B82E', '#1B5E20', '#1B1A17'],
    });

    setConfirmedTicket(newReg);
    onRegistered?.();
  };

  const handleModalClose = () => {
    reset();
    setDuplicateError(null);
    setConfirmedTicket(null);
    onClose();
  };

  // Helper to generate .ics calendar file
  const handleAddToCalendar = () => {
    if (!event) return;

    // Convert date string YYYY-MM-DD to basic format
    const cleanDate = event.date.replace(/-/g, '');
    const startDate = `${cleanDate}T090000Z`;
    const endDate = `${cleanDate}T180000Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CodeChef ABESEC//Bawarchi Express//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}-${Date.now()}@codechef-abesec.club`,
      `DTSTAMP:${startDate}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title} - CodeChef ABESEC`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.platform}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.id}-boarding-pass.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="boarding-pass-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity"
    >
      {/* Backdrop click dismiss */}
      <div className="fixed inset-0" onClick={handleModalClose} aria-hidden="true" />

      {/* Modal Container: Bottom sheet on mobile, rounded card on desktop */}
      <div className="relative w-full max-w-xl bg-[#FFFDF9] dark:bg-[#1A1916] rounded-t-3xl sm:rounded-2xl border-t-4 sm:border-2 border-tomato shadow-2xl z-10 max-h-[92vh] overflow-y-auto transform transition-transform">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD2C1] dark:border-[#38342D] bg-[#FBF7EE] dark:bg-[#141311]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-tomato font-bold block">
                RESERVATION COUNTER
              </span>
              <h2
                id="boarding-pass-title"
                className="text-base sm:text-lg font-display font-extrabold text-ink-light dark:text-ink-dark leading-tight"
              >
                {confirmedTicket ? 'Boarding Pass Issued' : `Boarding Pass: ${event.title}`}
              </h2>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6">
          {/* SUCCESS STATE */}
          {confirmedTicket ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-display font-bold text-sm">
                    Berth Successfully Confirmed!
                  </h3>
                  <p className="text-xs font-sans text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Your seat on the Bawarchi Express is locked in. Show this digital pass at Platform check-in.
                  </p>
                </div>
              </div>

              {/* GENERATED BOARDING PASS TICKET */}
              <div className="bg-[#FAF6EC] dark:bg-[#151412] border-2 border-stone-800 dark:border-stone-600 rounded-xl p-5 relative overflow-hidden shadow-inner">
                {/* Perforation line */}
                <div className="flex justify-between items-center border-b border-dashed border-stone-400 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                      BOARDING PASS
                    </span>
                    <h4 className="font-display font-black text-lg text-ink-light dark:text-ink-dark">
                      {event.title}
                    </h4>
                  </div>
                  <StampBadge label="CONFIRMED" variant="green" rotate="-2deg" />
                </div>

                {/* Passenger & Journey Details */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">PASSENGER NAME</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark text-sm block">
                      {confirmedTicket.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">PNR NUMBER</span>
                    <span className="font-bold text-tomato text-sm block">
                      {confirmedTicket.pnr}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">BERTH / COACH</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark block">
                      {confirmedTicket.berthNumber} ({event.coach})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block">DEPARTURE</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark block">
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-stone-500 uppercase block">PLATFORM / VENUE</span>
                    <span className="font-bold text-ink-light dark:text-ink-dark block">
                      {event.platform}
                    </span>
                  </div>
                </div>

                {/* Ticket Barcode */}
                <div className="pt-2 border-t border-dashed border-stone-400 flex flex-col items-center">
                  <TicketStubBarcode code={confirmedTicket.pnr} height={36} className="text-stone-800 dark:text-stone-200" />
                  <span className="text-[9px] font-mono text-stone-500 mt-1">
                    NON-TRANSFERABLE • CODECHEF ABESEC CHAPTER
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCalendar}
                  className="flex-1 py-3 px-4 bg-tomato hover:bg-tomato-hover text-white rounded-xl font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Add to Calendar (.ics)</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-4 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl font-mono text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>
              </div>
            </div>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Duplicate Error Banner */}
              {duplicateError && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-xl flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span>{duplicateError}</span>
                </div>
              )}

              {/* Event Brief Info Strip */}
              <div className="p-3 bg-[#FBF7EE] dark:bg-[#141311] border border-[#DDD2C1] dark:border-[#38342D] rounded-xl flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-stone-500 uppercase text-[10px] block">TARGET DESTINATION</span>
                  <span className="font-bold text-ink-light dark:text-ink-dark">{event.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 uppercase text-[10px] block">SCHEDULED</span>
                  <span className="font-bold text-tomato">{event.date}</span>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Passenger Full Name *
                </label>
                <input
                  {...register('name')}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato transition-colors ${
                    errors.name ? 'border-rose-500' : 'border-[#DDD2C1] dark:border-[#38342D]'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] font-mono text-rose-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="e.g. yourname@abes.ac.in"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-[#DDD2C1] dark:border-[#38342D]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    10-Digit Mobile *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato transition-colors ${
                      errors.phone ? 'border-rose-500' : 'border-[#DDD2C1] dark:border-[#38342D]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* College & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    College / University *
                  </label>
                  <input
                    {...register('college')}
                    placeholder="e.g. ABES Engineering College"
                    className={`w-full px-3.5 py-2.5 rounded-lg border bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato transition-colors ${
                      errors.college ? 'border-rose-500' : 'border-[#DDD2C1] dark:border-[#38342D]'
                    }`}
                  />
                  {errors.college && (
                    <p className="text-[11px] font-mono text-rose-600 mt-1">{errors.college.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Year *
                  </label>
                  <select
                    {...register('year')}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-tomato"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Branch / Specialization (Optional)
                </label>
                <input
                  {...register('branch')}
                  placeholder="e.g. CSE, IT, CSE-AIML, ECE"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD2C1] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-stone-900 text-ink-light dark:text-ink-dark text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-tomato"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-tomato hover:bg-tomato-hover disabled:opacity-50 text-white rounded-xl font-mono text-sm font-extrabold tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Punching Ticket...</span>
                  ) : (
                    <>
                      <span>Issue My Boarding Pass</span>
                      <span>🚂</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] font-mono text-stone-500 text-center mt-2">
                  Zero ticket fare • Free admission for all students • Instant confirmation
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
