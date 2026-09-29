import type { Registration } from '../types';

const STORAGE_KEY = 'codechef_abesec_registrations_v2';

const SEED_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    pnr: 'TKT-84920',
    eventId: 'devshastra-2026',
    eventName: 'DevShastra 2026',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@abes.ac.in',
    phone: '9876543210',
    college: 'ABES Engineering College',
    year: '3rd Year',
    branch: 'CSE',
    registeredAt: '2026-09-20T10:15:00.000Z',
    berthNumber: 'B1-12',
    ticketStatus: 'CONFIRMED',
  },
  {
    id: 'reg-002',
    pnr: 'TKT-77321',
    eventId: 'devshastra-2026',
    eventName: 'DevShastra 2026',
    name: 'Ananya Verma',
    email: 'ananya.v@kiet.edu',
    phone: '9812345678',
    college: 'KIET Group of Institutions',
    year: '2nd Year',
    branch: 'IT',
    registeredAt: '2026-09-21T14:32:00.000Z',
    berthNumber: 'B1-13',
    ticketStatus: 'CONFIRMED',
  },
  {
    id: 'reg-003',
    pnr: 'TKT-90234',
    eventId: 'clash-of-coders-3',
    eventName: 'COC 3.0: The Triwizard Algorithm Cup',
    name: 'Rohan Gupta',
    email: 'rohan.g@abes.ac.in',
    phone: '9798765432',
    college: 'ABES Engineering College',
    year: '1st Year',
    branch: 'CSE-DS',
    registeredAt: '2026-09-22T09:05:00.000Z',
    berthNumber: 'H9-42',
    ticketStatus: 'CONFIRMED',
  },
  {
    id: 'reg-004',
    pnr: 'TKT-12495',
    eventId: 'once-upon-a-crime',
    eventName: 'Once Upon a Crime',
    name: 'Priya Mishra',
    email: 'priya.m@akgec.ac.in',
    phone: '9988776655',
    college: 'AKGEC Ghaziabad',
    year: '3rd Year',
    branch: 'ECE',
    registeredAt: '2026-09-24T18:40:00.000Z',
    berthNumber: 'M7-08',
    ticketStatus: 'CONFIRMED',
  },
  {
    id: 'reg-005',
    pnr: 'TKT-65412',
    eventId: 'head-node',
    eventName: 'Head Node: Senior Chef Mentorship',
    name: 'Tanmay Saxena',
    email: 'tanmay.s@abes.ac.in',
    phone: '9123456780',
    college: 'ABES Engineering College',
    year: '1st Year',
    branch: 'CSE-AIML',
    registeredAt: '2026-09-26T11:20:00.000Z',
    berthNumber: 'MC-21',
    ticketStatus: 'CONFIRMED',
  },
  {
    id: 'reg-006',
    pnr: 'TKT-33829',
    eventId: 'wrap-it-up',
    eventName: 'Wrap It Up: UI/UX & Graphic Cook-off',
    name: 'Diya Singhal',
    email: 'diya.singhal@abesit.in',
    phone: '9871234590',
    college: 'ABES IT',
    year: '2nd Year',
    branch: 'IT',
    registeredAt: '2026-09-27T16:10:00.000Z',
    berthNumber: 'D4-19',
    ticketStatus: 'CONFIRMED',
  },
];

export const registrationsRepo = {
  getAll: (): Registration[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REGISTRATIONS));
        return SEED_REGISTRATIONS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REGISTRATIONS;
    }
  },

  getByEventId: (eventId: string): Registration[] => {
    const all = registrationsRepo.getAll();
    return all.filter((r) => r.eventId === eventId);
  },

  checkDuplicate: (email: string, eventId: string): boolean => {
    const all = registrationsRepo.getAll();
    return all.some(
      (r) => r.email.trim().toLowerCase() === email.trim().toLowerCase() && r.eventId === eventId
    );
  },

  create: (item: Omit<Registration, 'id' | 'pnr' | 'registeredAt' | 'berthNumber' | 'ticketStatus'>): Registration => {
    const all = registrationsRepo.getAll();
    const id = `reg-${Date.now()}`;
    const pnr = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const coachLetter = ['A', 'B', 'C', 'S'][Math.floor(Math.random() * 4)];
    const berthNumber = `${coachLetter}${Math.floor(1 + Math.random() * 6)}-${Math.floor(1 + Math.random() * 72)}`;

    const newReg: Registration = {
      ...item,
      id,
      pnr,
      registeredAt: new Date().toISOString(),
      berthNumber,
      ticketStatus: 'CONFIRMED',
    };

    all.unshift(newReg);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newReg;
  },

  delete: (id: string): boolean => {
    const all = registrationsRepo.getAll();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length === all.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  getStats: () => {
    const all = registrationsRepo.getAll();
    const countByEvent: Record<string, number> = {};
    const countByYear: Record<string, number> = {};

    all.forEach((r) => {
      countByEvent[r.eventName] = (countByEvent[r.eventName] || 0) + 1;
      countByYear[r.year] = (countByYear[r.year] || 0) + 1;
    });

    return {
      total: all.length,
      countByEvent,
      countByYear,
    };
  },
};
