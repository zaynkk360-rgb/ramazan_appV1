import { RamadanDay, DailyInsight } from './types';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

// --- DATASETS ---

export const STATIC_INSIGHTS: DailyInsight[] = [
  { dua: "Rabbana atina fid-dunya hasanatan wa fil 'akhirati hasanatan waqina 'adhaban-nar", translation: "Our Lord! Grant us good in this world and good in the Hereafter, and save us from the punishment of the Fire.", tip: "Drink at least 8 glasses of water between Iftar and Suhoor to stay hydrated." },
  { dua: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni", translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.", tip: "Avoid salty and spicy foods during Suhoor to prevent thirst." },
  { dua: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah", translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.", tip: "Dates are an excellent source of energy and fiber for breaking your fast." },
  { dua: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama", translation: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.", tip: "Try to take a short nap (Qaylulah) in the afternoon to recharge." },
  { dua: "Rabbi ishrah li sadri wa yassir li amri", translation: "My Lord, expand for me my breast [with assurance] and ease for me my task.", tip: "Eat complex carbohydrates like oats or whole grains during Sehri for lasting energy." },
  { dua: "Allahumma inni as'aluka ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbalan", translation: "O Allah, I ask You for beneficial knowledge, goodly provision, and acceptable deeds.", tip: "Focus on protein-rich foods like eggs and yogurt at Suhoor." },
  { dua: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin", translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", tip: "Break your fast slowly; start with dates and water, then pray Maghrib before the main meal." },
  { dua: "Rabbi inni lima anzalta ilayya min khairin faqir", translation: "My Lord, indeed I am, for whatever good You would send down to me, in need.", tip: "Reduce caffeine intake to avoid dehydration and headaches." },
  { dua: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana", translation: "Our Lord, pour upon us patience and plant firmly our feet.", tip: "Use Miswak or brush teeth to maintain oral hygiene while fasting." },
  { dua: "Allahumma inni a'udhu bika minal-hammi wal-hazani", translation: "O Allah, I seek refuge in You from worry and grief.", tip: "Give charity, even if it is a smile or a small amount of money." },
  { dua: "Rabbi zidni 'ilma", translation: "My Lord, increase me in knowledge.", tip: "Read the Quran daily, even if it is just a few verses." },
  { dua: "Hasbunallahu wa ni'mal wakil", translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.", tip: "Avoid overeating at Iftar to prevent lethargy during Taraweeh." },
  { dua: "Rabbana taqabbal minna innaka antas-sami'ul-'alim", translation: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", tip: "Engage in Dhikr while commuting or cooking." },
  { dua: "Allahumma ajirni minan-nar", translation: "O Allah, save me from the Fire.", tip: "Limit sugary drinks and sodas; opt for fresh juices or water." },
  { dua: "Subhanallahi wa bihamdihi subhanallahil-azim", translation: "Glory be to Allah and His is the praise, (and) Allah, the Greatest is free from imperfection.", tip: "Help with household chores to share the blessings of serving others." },
  { dua: "Astaghfirullah", translation: "I seek forgiveness from Allah.", tip: "Reflection is key. Spend 5 minutes in silence making Dua." },
  { dua: "Alhamdulillah", translation: "All praise is due to Allah.", tip: "Gratitude increases blessings. List 3 things you are thankful for today." },
  { dua: "Allahu Akbar", translation: "Allah is the Greatest.", tip: "Walking after Iftar helps digestion." },
  { dua: "Subhanallah", translation: "Glory be to Allah.", tip: "Sleep early to wake up fresh for Suhoor." },
  { dua: "La hawla wa la quwwata illa billah", translation: "There is no power and no strength except with Allah.", tip: "Share your food with neighbors or the needy." },
  { dua: "Rabbana atina fid-dunya hasanatan", translation: "Our Lord, give us good in this world.", tip: "Plan your Duas for the last ten nights." },
  { dua: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni", translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.", tip: "Laylatul Qadr is better than a thousand months. Strive hard." },
  { dua: "Rabbi hab li hukman wa alhiqni bis-salihin", translation: "My Lord, grant me authority and join me with the righteous.", tip: "Avoid arguing or getting angry while fasting." },
  { dua: "Rabbighfir warham wa anta khairur-rahimin", translation: "My Lord, forgive and have mercy, and You are the best of the merciful.", tip: "Hydrate well before sleeping." },
  { dua: "Rabbana la tu'akhidhna in nasina aw akhta'na", translation: "Our Lord, do not impose blame upon us if we have forgotten or erred.", tip: "Make intention (Niyyah) for fasting every night." },
  { dua: "Allahumma inni as'alukal-jannah", translation: "O Allah, I ask You for Paradise.", tip: "Smile, it's Sunnah!" },
  { dua: "Rabbi-ja'alni muqimas-salati wa min dhurriyyati", translation: "My Lord, make me an establisher of prayer, and [many] from my descendants.", tip: "Disconnect from social media for an hour to connect with Allah." },
  { dua: "Rabbana wa taqabbal du'a", translation: "Our Lord, and accept my prayer.", tip: "Eat plenty of fruits and vegetables." },
  { dua: "Allahumma salli 'ala Muhammad", translation: "O Allah, send blessings upon Muhammad.", tip: "Prepare for Eid with simplicity and joy." },
  { dua: "Taqabbal Allahu minna wa minkum", translation: "May Allah accept [good deeds] from us and from you.", tip: "Celebrate the completion of the Quran." },
];

export const CITIES_DATA: Record<string, { lat: number, lng: number, country: string }> = {
  // Middle East
  "Mecca, Saudi Arabia": { lat: 21.3891, lng: 39.8579, country: "Saudi Arabia" },
  "Medina, Saudi Arabia": { lat: 24.5247, lng: 39.5692, country: "Saudi Arabia" },
  "Riyadh, Saudi Arabia": { lat: 24.7136, lng: 46.6753, country: "Saudi Arabia" },
  "Dubai, UAE": { lat: 25.2048, lng: 55.2708, country: "UAE" },
  "Abu Dhabi, UAE": { lat: 24.4539, lng: 54.3773, country: "UAE" },
  "Doha, Qatar": { lat: 25.276987, lng: 51.520008, country: "Qatar" },
  "Cairo, Egypt": { lat: 30.0444, lng: 31.2357, country: "Egypt" },
  "Istanbul, Turkey": { lat: 41.0082, lng: 28.9784, country: "Turkey" },
  "Tehran, Iran": { lat: 35.6892, lng: 51.3890, country: "Iran" },
  "Baghdad, Iraq": { lat: 33.3152, lng: 44.3661, country: "Iraq" },

  // South Asia
  "Karachi, Pakistan": { lat: 24.8607, lng: 67.0011, country: "Pakistan" },
  "Lahore, Pakistan": { lat: 31.5204, lng: 74.3587, country: "Pakistan" },
  "Islamabad, Pakistan": { lat: 33.6844, lng: 73.0479, country: "Pakistan" },
  "Mumbai, India": { lat: 19.0760, lng: 72.8777, country: "India" },
  "Delhi, India": { lat: 28.6139, lng: 77.2090, country: "India" },
  "Dhaka, Bangladesh": { lat: 23.8103, lng: 90.4125, country: "Bangladesh" },

  // Southeast Asia
  "Jakarta, Indonesia": { lat: -6.2088, lng: 106.8456, country: "Indonesia" },
  "Kuala Lumpur, Malaysia": { lat: 3.1390, lng: 101.6869, country: "Malaysia" },
  "Singapore": { lat: 1.3521, lng: 103.8198, country: "Singapore" },

  // Europe
  "London, UK": { lat: 51.5074, lng: -0.1278, country: "UK" },
  "Manchester, UK": { lat: 53.4808, lng: -2.2426, country: "UK" },
  "Paris, France": { lat: 48.8566, lng: 2.3522, country: "France" },
  "Berlin, Germany": { lat: 52.5200, lng: 13.4050, country: "Germany" },
  "Rome, Italy": { lat: 41.9028, lng: 12.4964, country: "Italy" },
  "Madrid, Spain": { lat: 40.4168, lng: -3.7038, country: "Spain" },
  "Moscow, Russia": { lat: 55.7558, lng: 37.6173, country: "Russia" },

  // North America
  "New York, USA": { lat: 40.7128, lng: -74.0060, country: "USA" },
  "Los Angeles, USA": { lat: 34.0522, lng: -118.2437, country: "USA" },
  "Chicago, USA": { lat: 41.8781, lng: -87.6298, country: "USA" },
  "Houston, USA": { lat: 29.7604, lng: -95.3698, country: "USA" },
  "Toronto, Canada": { lat: 43.6532, lng: -79.3832, country: "Canada" },
  "Vancouver, Canada": { lat: 49.2827, lng: -123.1207, country: "Canada" },

  // Oceania
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093, country: "Australia" },
  "Melbourne, Australia": { lat: -37.8136, lng: 144.9631, country: "Australia" },
  "Auckland, New Zealand": { lat: -36.8485, lng: 174.7633, country: "New Zealand" },
  
  // Africa
  "Lagos, Nigeria": { lat: 6.5244, lng: 3.3792, country: "Nigeria" },
  "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241, country: "South Africa" }
};

export const CITIES_LIST = Object.keys(CITIES_DATA).sort();

// --- LOGIC ---

// Approximate Dates for Ramadan (used to initialize the "Ramadan Mode" window)
const RAMADAN_WINDOWS: Record<number, { start: string }> = {
  2024: { start: "2024-03-11" },
  2025: { start: "2025-02-28" },
  2026: { start: "2026-02-18" },
  2027: { start: "2027-02-08" },
  2028: { start: "2028-01-28" }
};

export const generateRamadanSchedule = (lat: number, lng: number, year: number): RamadanDay[] => {
  const days: RamadanDay[] = [];
  const now = new Date();
  
  // 1. Determine Start Date
  // If we are looking at the current year, check if we are already past Ramadan.
  // If today is NOT in Ramadan, we generate a schedule starting from TODAY to be useful year-round.
  let startStr = RAMADAN_WINDOWS[year]?.start || `${year}-02-18`;
  let startDate = new Date(`${startStr}T00:00:00`);
  
  // Logic: Is today > Ramadan Start + 30 days?
  const estimatedRamadanEnd = new Date(startDate);
  estimatedRamadanEnd.setDate(startDate.getDate() + 30);
  
  let useLiveSchedule = false;

  if (year === now.getFullYear()) {
     // If we are significantly past the predefined Ramadan, switch to "Live Prayer Mode" starting today
     if (now > estimatedRamadanEnd) {
        startDate = new Date(); // Start from today
        startDate.setHours(0,0,0,0);
        useLiveSchedule = true;
     } else if (now < startDate) {
        // If before Ramadan, keep Ramadan start date (countdown to Ramadan)
        useLiveSchedule = false; 
     } else {
        // We are IN Ramadan, ensure we align with the predefined start
        useLiveSchedule = false;
     }
  }

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Configure Adhan Parameters
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague(); 
  params.madhab = 'shafi'; 

  // Hijri Formatter
  const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Helper to detect if month is Ramadan (9th month)
  // Note: Intl implementation can vary, we check if the formatted string contains "Ramadan"
  const isDateRamadan = (d: Date) => {
    const parts = hijriFormatter.formatToParts(d);
    const monthPart = parts.find(p => p.type === 'month');
    return monthPart ? monthPart.value.includes('Ramadan') : false;
  };

  for (let i = 1; i <= 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (i - 1));
    
    // Calculate Prayer Times for this specific date
    const prayerTimes = new PrayerTimes(coordinates, currentDate, params);

    const dayOfWeek = weekDays[currentDate.getDay()];
    const month = currentDate.toLocaleString('default', { month: 'short' });
    const dateNum = currentDate.getDate();

    // Hijri Info
    const hijriFull = hijriFormatter.format(currentDate);
    const isRamadan = isDateRamadan(currentDate);

    // Format Times
    const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const subMinutes = (d: Date, mins: number) => new Date(d.getTime() - mins * 60000);

    const sehriDate = subMinutes(prayerTimes.fajr, 10);
    const iftarDate = prayerTimes.maghrib;

    days.push({
      dayNumber: i, // This is just the index in the list 1-30
      hijriDate: hijriFull.replace(/ AH/, ''),
      gregorianDate: `${dayOfWeek}, ${month} ${dateNum}`,
      dayOfWeek: dayOfWeek,
      
      sehriTime: format(sehriDate),
      fajrTime: format(prayerTimes.fajr),
      sunriseTime: format(prayerTimes.sunrise),
      dhuhrTime: format(prayerTimes.dhuhr),
      asrTime: format(prayerTimes.asr),
      iftarTime: format(iftarDate),
      ishaTime: format(prayerTimes.isha),

      date: currentDate,
      sehriDate,
      fajrDate: prayerTimes.fajr,
      sunriseDate: prayerTimes.sunrise,
      dhuhrDate: prayerTimes.dhuhr,
      asrDate: prayerTimes.asr,
      iftarDate,
      ishaDate: prayerTimes.isha,

      isToday: currentDate.toDateString() === now.toDateString(),
      isRamadan: isRamadan,
      status: currentDate < now && currentDate.toDateString() !== now.toDateString() ? 'past' : (currentDate.toDateString() === now.toDateString() ? 'today' : 'future')
    });
  }
  return days;
};

export const MOCK_DATA = generateRamadanSchedule(25.2048, 55.2708, new Date().getFullYear());