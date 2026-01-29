import React, { useState } from 'react';
import { Bell, Moon, Clock, Globe, HelpCircle, MapPin, ChevronRight, ToggleRight, ToggleLeft, RefreshCcw, Sun, Shield } from 'lucide-react';
import { UserLocation } from '../types';

interface SettingsViewProps {
  locationSettings: UserLocation;
  onLocationChange: (settings: UserLocation) => void;
  year: number;
  onYearChange: (year: number) => void;
  timeFormat: '12h' | '24h';
  onTimeFormatChange: (format: '12h' | '24h') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  locationSettings, 
  onLocationChange,
  year,
  onYearChange,
  timeFormat,
  onTimeFormatChange,
  theme,
  onToggleTheme
}) => {
  const [notifs, setNotifs] = useState({ prayer: true, sehri: true });

  const triggerLocationModal = () => {
    // We pass a dummy update that App.tsx intercepts to show the modal
    onLocationChange({
      ...locationSettings,
      useManual: true 
    });
  };

  const SettingRow = ({ icon: Icon, label, value, onToggle, isToggle = true, subLabel = "" }: any) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-xl mb-3 shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-[#0F3866] flex items-center justify-center text-blue-600 dark:text-blue-400">
           <Icon size={18} />
        </div>
        <div>
           <div className="text-sm font-bold text-slate-900 dark:text-white">{label}</div>
           {subLabel && <div className="text-[10px] text-slate-500 dark:text-slate-400">{subLabel}</div>}
        </div>
      </div>
      {isToggle ? (
         <button onClick={onToggle} className={`transition-colors ${value ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
            {value ? <ToggleRight size={32} fill="currentColor" className="opacity-20" /> : <ToggleLeft size={32} />}
         </button>
      ) : (
         <button className="text-slate-400 dark:text-slate-500">
            <ChevronRight size={20} />
         </button>
      )}
    </div>
  );

  return (
    <div className="animate-fadeIn pb-8">
       <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-1">Settings</h2>

       {/* Data Year Selection */}
       <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3">Calendar Year</h3>
          <div className="flex bg-slate-100 dark:bg-[#0B121E] rounded-lg p-1">
             {[2026, 2027, 2028].map((y) => (
                <button
                   key={y}
                   onClick={() => onYearChange(y)}
                   className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                      year === y ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                   }`}
                >
                   {y}
                </button>
             ))}
          </div>
       </div>

       <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Location</h3>
          
          <button 
            onClick={triggerLocationModal}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MapPin size={18} />
               </div>
               <div className="text-left">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Change Location</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                     Current: {locationSettings.city || "None"}
                  </div>
               </div>
             </div>
             <ChevronRight size={20} className="text-slate-400" />
          </button>
       </div>

       <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Preferences</h3>
          <SettingRow 
             icon={Clock} 
             label="Time Format" 
             subLabel={timeFormat === '12h' ? '12 Hour (AM/PM)' : '24 Hour'}
             value={timeFormat === '24h'} 
             onToggle={() => onTimeFormatChange(timeFormat === '12h' ? '24h' : '12h')} 
          />
          <SettingRow 
             icon={Bell} 
             label="Prayer Alerts" 
             value={notifs.prayer} 
             onToggle={() => setNotifs(p => ({...p, prayer: !p.prayer}))} 
          />
          <SettingRow 
             icon={Clock} 
             label="Sehri & Iftar Alerts" 
             value={notifs.sehri} 
             onToggle={() => setNotifs(p => ({...p, sehri: !p.sehri}))} 
          />
       </div>

       <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">General</h3>
          <SettingRow 
             icon={theme === 'dark' ? Moon : Sun} 
             label="Dark Mode" 
             value={theme === 'dark'} 
             onToggle={onToggleTheme} 
          />
          <SettingRow icon={Globe} label="Language" subLabel="English" isToggle={false} />
          <SettingRow icon={HelpCircle} label="Help & Support" isToggle={false} />
       </div>

       <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={14} /> Privacy & Terms
          </h3>
          <div className="bg-slate-50 dark:bg-[#0B121E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <p className="mb-3">
                 <strong className="text-slate-900 dark:text-white">Terms of Use:</strong> By using this app, you agree to allow us to process your selected location solely for the purpose of calculating accurate prayer times.
              </p>
              <p>
                 <strong className="text-slate-900 dark:text-white">Privacy Policy:</strong> We are fully compliant with global data protection regulations. We <strong className="text-slate-900 dark:text-white">do not store</strong>, share, or sell your data. All calculations happen locally on your device.
              </p>
          </div>
       </div>

       <div className="text-center mt-8 text-xs text-slate-500 dark:text-slate-600">
          Ramadan Companion v1.2.0
       </div>
    </div>
  );
};