import { DailyInsight } from '../types';
import { STATIC_INSIGHTS } from '../constants';

// THIS SERVICE NOW RUNS ENTIRELY OFFLINE - NO API KEY REQUIRED

export const fetchDailyInsight = async (dayNumber: number): Promise<DailyInsight> => {
  // Simulate network delay for effect (optional) or return immediately
  // Return deterministic insight based on day number (1-30)
  const index = Math.max(0, (dayNumber - 1) % STATIC_INSIGHTS.length);
  return STATIC_INSIGHTS[index];
};

export const fetchLocationName = async (lat: number, lng: number): Promise<string> => {
  // Since we removed the AI Geocoder, we return a formatted coordinate string
  // or "GPS Location". Browser Geocoding requires Google Maps API Key usually.
  return `GPS: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
};

// Deprecated but kept for type compatibility if needed, though unused in new logic
export const fetchRamadanParams = async (location: string, year: number): Promise<null> => {
  return null;
};