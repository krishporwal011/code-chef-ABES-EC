import rawEvents from '../data/events.json';
import type { EventItem } from '../types';

const SEED_EVENTS = rawEvents as EventItem[];
const STORAGE_KEY = 'codechef_abesec_events_v2';

export const eventsRepo = {
  getAll: (): EventItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
        return SEED_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_EVENTS;
    }
  },

  getById: (id: string): EventItem | undefined => {
    const events = eventsRepo.getAll();
    return events.find((e) => e.id === id);
  },

  getFeatured: (): EventItem => {
    const events = eventsRepo.getAll();
    return events.find((e) => e.featured) || events[0];
  },

  create: (item: Omit<EventItem, 'id' | 'pnr' | 'registeredCount'> & Partial<Pick<EventItem, 'id' | 'pnr'>>): EventItem => {
    const events = eventsRepo.getAll();
    const id = item.id || `event-${Date.now()}`;
    const pnr = item.pnr || `CC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent: EventItem = {
      ...item,
      id,
      pnr,
      registeredCount: 0,
      rules: item.rules && item.rules.length > 0 ? item.rules : ['Valid college ID required at check-in.', 'Follow Code of Conduct.'],
      eligibility: item.eligibility || 'Open to all registered university students.',
    };

    if (newEvent.featured) {
      events.forEach((e) => {
        e.featured = false;
      });
    }

    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  },

  update: (id: string, updates: Partial<EventItem>): EventItem | null => {
    const events = eventsRepo.getAll();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    if (updates.featured) {
      events.forEach((e) => {
        e.featured = false;
      });
    }

    events[index] = { ...events[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return events[index];
  },

  delete: (id: string): boolean => {
    const events = eventsRepo.getAll();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;

    // If deleted event was featured, ensure at least one remains featured
    if (!filtered.some((e) => e.featured) && filtered.length > 0) {
      filtered[0].featured = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  incrementRegistration: (eventId: string): void => {
    const events = eventsRepo.getAll();
    const event = events.find((e) => e.id === eventId);
    if (event) {
      event.registeredCount = (event.registeredCount || 0) + 1;
      if (event.registeredCount >= event.capacity) {
        event.status = 'Sold Out';
      } else if (event.registeredCount >= event.capacity * 0.8) {
        event.status = 'Filling Fast';
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  },

  resetToDefaults: (): EventItem[] => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
    return SEED_EVENTS;
  },
};
