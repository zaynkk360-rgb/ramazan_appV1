import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Moon, RefreshCcw, Calendar as CalendarIcon, CheckCircle, Globe } from 'lucide-react';
import Layout from './components/Layout';
import CountdownCard from './components/CountdownCard';
import { PrayerTimesList } from './components/PrayerTimesList';
import { CalendarView } from './components/CalendarView';
import { QiblaCompass } from './components/QiblaCompass';
import { DuasView } from './components/DuasView';
import { SettingsView } from './components/SettingsView';

import { MOCK_DATA, generateRamadanSchedule, CITIES_DATA, CITIES_LIST } from './constants';
import { TabView, DailyInsight, UserLocation } from './types';
import { fetchDailyInsight, fetchLocationName } from './services/geminiService';

const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Home');
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // -- PERSISTENT STATE INITIALIZATION --

  // 1. Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
       return localStorage.getItem('ramadan_theme') as 'dark'|'light' || 'dark';
    }
    return 'dark';
  });

  // 2. Data State (Revive Dates from JSON)
  // Default to CURRENT YEAR for live functionality
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [daysData, setDaysData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ramadan_schedule');
      if (saved) {
        try {
          // Parse and revive date strings back to Date objects
          return JSON.parse(saved).map((d: any) => ({
             ...d,
             date: new Date(d.date),
             sehriDate: new Date(d.sehriDate),
             fajrDate: new Date(d.fajrDate),
             sunriseDate: new Date(d.sunriseDate),
             dhuhrDate: new Date(d.dhuhrDate),
             asrDate: new Date(d.asrDate),
             iftarDate: new Date(d.iftarDate),
             ishaDate: new Date(d.ishaDate),
          }));
        } catch(e) { console.warn("Failed to load cached schedule"); }
      }
    }
    return MOCK_DATA;
  });

  // 3. Location State - NO GPS, Default empty if new user
  const [locationSettings, setLocationSettings] = useState<UserLocation>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ramadan_location');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      city: "", // Empty triggers modal
      country: "",
      useManual: true,
      manualLocation: ""
    };
  });
  
  // 4. Time Format State
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
     if (typeof window !== 'undefined') {
       return localStorage.getItem('ramadan_time_format') as '12h'|'24h' || '12h';
     }
     return '12h';
  });

  const [dailyInsight, setDailyInsight] = useState<DailyInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // -- PERSISTENCE EFFECTS --
  
  useEffect(() => { localStorage.setItem('ramadan_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('ramadan_schedule', JSON.stringify(daysData)); }, [daysData]);
  useEffect(() => { localStorage.setItem('ramadan_location', JSON.stringify(locationSettings)); }, [locationSettings]);
  useEffect(() => { localStorage.setItem('ramadan_time_format', timeFormat); }, [timeFormat]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 1. Force Location Selection on Load if empty
  useEffect(() => {
    if (!locationSettings.city || locationSettings.city === "") {
      setShowLocationModal(true);
    }
  }, []);

  // 2. Generate Schedule Logic (Purely Manual Calculation)
  const updateScheduleForLocation = (cityName: string) => {
    const cityData = CITIES_DATA[cityName];
    if (!cityData) {
      alert("City data not found, using default.");
      const def = CITIES_DATA["Dubai, UAE"];
      const schedule = generateRamadanSchedule(def.lat, def.lng, currentYear);
      setDaysData(schedule);
      return;
    }

    const newSchedule = generateRamadanSchedule(cityData.lat, cityData.lng, currentYear);
    setDaysData(newSchedule);
    
    // Update State
    setLocationSettings({
      city: cityName,
      country: cityData.country,
      useManual: true,
      manualLocation: cityName
    });
    
    setShowLocationModal(false);
  };

  // 3. React to Year Change
  useEffect(() => {
     if (locationSettings.city) {
       updateScheduleForLocation(locationSettings.city);
     }
  }, [currentYear]);

  // Derive Today's data dynamically
  const todayData = daysData.find(d => d.isToday) || daysData[0];

  useEffect(() => {
    const getInsight = async () => {
      // 1. Check LocalStorage Cache first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('ramadan_insight_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.dayNumber === todayData.dayNumber) {
              setDailyInsight(parsed.data);
              return; 
            }
          } catch (e) { console.warn("Cache parse error", e); }
        }
      }

      setLoadingInsight(true);
      const data = await fetchDailyInsight(todayData.dayNumber);
      setDailyInsight(data);
      
      localStorage.setItem('ramadan_insight_cache', JSON.stringify({
        dayNumber: todayData.dayNumber,
        data: data
      }));
      
      setLoadingInsight(false);
    };

    getInsight();
  }, [todayData.dayNumber]);

  const isRamadanMode = todayData.isRamadan;

  return (
    <div className={theme}>
      <Layout activeTab={activeNav} onTabChange={setActiveNav}>
        
        {/* Global Header */}
        <div className="flex justify-between items-center pt-2 mb-6 px-1">
          <div className="flex items-center gap-3">
             <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                  {isRamadanMode ? `Ramadan ${currentYear}` : 'Prayer Companion'}
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                  {isRamadanMode ? 'The Month of Mercy' : 'Daily Prayer Times'}
                </p>
             </div>
          </div>
          <button 
             onClick={toggleTheme}
             className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>
        </div>

        {activeNav === 'Home' && (
          <div className="animate-fadeIn">
            
            {/* Location Bar */}
            <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-4 flex justify-between items-center shadow-sm dark:shadow-none transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#0F3866] flex items-center justify-center text-blue-600 dark:text-blue-400">
                   <MapPin size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight capitalize">
                    {locationSettings.city || "Select Location"}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                       {locationSettings.country || "Set location to see times"}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                 onClick={() => setShowLocationModal(true)}
                 className="bg-[#1E88E5] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Change
              </button>
            </div>

            {/* Date & Ramzan Info Bar */}
            <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-6 flex items-center gap-3 shadow-sm dark:shadow-none transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#0F3866] flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <CalendarIcon size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                   {todayData.gregorianDate.split(',')[0]} {/* Day Name e.g. Friday */}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                     {isRamadanMode ? `Day ${todayData.dayNumber} of Ramadan` : 'Today'} • {todayData.hijriDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Countdown */}
            <div className="mb-8">
              <CountdownCard day={todayData} timeFormat={timeFormat} />
            </div>

            {/* Prayer Times List */}
            <PrayerTimesList day={todayData} showSehriIftarGrid={true} timeFormat={timeFormat} />
          </div>
        )}

        {activeNav === 'Calendar' && (
           <CalendarView days={daysData} timeFormat={timeFormat} />
        )}

        {activeNav === 'Duas' && (
          <DuasView dailyInsight={dailyInsight} loading={loadingInsight} />
        )}

        {activeNav === 'Qibla' && (
          <QiblaCompass coords={locationSettings.coords} />
        )}

        {activeNav === 'Settings' && (
          <SettingsView 
             locationSettings={locationSettings}
             onLocationChange={(newSettings) => {
               // Intercept manual location change request from Settings
               if (newSettings.useManual) {
                 setShowLocationModal(true);
               } else {
                 setShowLocationModal(true);
               }
             }}
             year={currentYear}
             onYearChange={setCurrentYear}
             timeFormat={timeFormat}
             onTimeFormatChange={setTimeFormat}
             theme={theme}
             onToggleTheme={toggleTheme}
          />
        )}

      </Layout>

      {/* LOCATION SELECTION MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { if(locationSettings.city) setShowLocationModal(false); }}></div>
          <div className="relative bg-white dark:bg-[#161F2E] w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideUp">
             
             <div className="p-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 mx-auto">
                   <Globe size={24} />
                </div>
                <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-2">Select Location</h2>
                <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                   Choose a city to synchronize prayer times accurately.
                </p>
             </div>

             <div className="overflow-y-auto p-4 space-y-2">
                {CITIES_LIST.map((city) => (
                  <button
                    key={city}
                    onClick={() => updateScheduleForLocation(city)}
                    className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all ${
                       locationSettings.city === city 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                       : 'bg-slate-50 dark:bg-[#0B121E] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                     <span className="font-semibold text-sm">{city}</span>
                     {locationSettings.city === city && <CheckCircle size={18} />}
                  </button>
                ))}
             </div>
             
             {locationSettings.city && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0B121E]">
                   <button 
                     onClick={() => setShowLocationModal(false)}
                     className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                   >
                      Cancel
                   </button>
                </div>
             )}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;