export type EventCategory = 
  | 'Hackathon'
  | 'Competitive Coding'
  | 'Workshop'
  | 'Design'
  | 'Fun/Quiz'
  | 'Mentorship';

export type EventStatus = 'Open' | 'Filling Fast' | 'Sold Out' | 'Departed';

export interface EventItem {
  id: string;
  pnr: string;               // e.g. "CC-DEV-24"
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  date: string;              // YYYY-MM-DD
  time: string;              // e.g. "10:00 AM IST"
  endTime?: string;
  platform: string;          // e.g. "Main Auditorium / Lab 3" or "Discord Station"
  coach: string;             // e.g. "Berth B-01"
  capacity: number;
  registeredCount: number;
  featured: boolean;
  status: EventStatus;
  prizes?: {
    first: string;
    second?: string;
    third?: string;
    goodies?: string;
  };
  rules: string[];
  eligibility: string;
  trainName?: string;        // e.g. "DevShastra Superfast", "DSA Rajdhani"
}

export interface Registration {
  id: string;
  pnr: string;               // e.g. "TKT-84920"
  eventId: string;
  eventName: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  branch?: string;
  registeredAt: string;      // ISO string
  berthNumber: string;       // e.g. "B1-42"
  ticketStatus: 'CONFIRMED' | 'RAC';
}

export interface Department {
  id: string;
  name: string;
  stationName: string;
  recipeRole: string;
  description: string;
  spices: string[];
  icon: string;
  stationCode: string;
}
