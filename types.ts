export interface RamadanDay {
  dayNumber: number;
  hijriDate: string;
  gregorianDate: string;
  dayOfWeek: string;
  
  // Display strings
  sehriTime: string;
  fajrTime: string;
  sunriseTime: string;
  dhuhrTime: string;
  asrTime: string;
  iftarTime: string;
  ishaTime: string;

  // Date objects for logic
  date: Date;
  sehriDate: Date;
  fajrDate: Date;
  sunriseDate: Date;
  dhuhrDate: Date;
  asrDate: Date;
  iftarDate: Date;
  ishaDate: Date;

  isToday: boolean;
  isRamadan: boolean; // New flag to toggle modes
  status?: 'past' | 'today' | 'future';
}

export interface UserLocation {
  city: string;
  country: string;
  coords?: GeolocationCoordinates;
  lastSynced?: Date;
  useManual: boolean;
  manualLocation: string;
}

export interface DailyInsight {
  dua: string;
  translation: string;
  tip: string;
}

export enum TabView {
  ALL = 'All 30 Days',
  SEHRI = 'Sehri',
  IFTAR = 'Iftar'
}