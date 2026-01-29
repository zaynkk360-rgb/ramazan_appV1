import React, { useState } from 'react';
import { RamadanDay } from '../types';
import { Sun, Moon, Sunrise, Sunset, Bell, BellOff, Clock } from 'lucide-react';

interface PrayerTimesListProps {
  day: RamadanDay;
  showSehriIftarGrid?: boolean;
  timeFormat?: '12h' | '24h';
}

export const PrayerTimesList: React.FC<PrayerTimesListProps> = ({ 
  day, 
  showSehriIftarGrid = true,
  timeFormat = '12h' 
}) => {
  const now = new Date();
  
  // Local state for notifications
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    fajr: true,
    dhuhr: false,
    asr: true,
    maghrib: true,
    isha: true
  });

  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);

  const toggleNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatTime = (date: Date) => {
    const timeStr = date.toLocaleTimeString([], {
      hour: timeFormat === '12h' ? 'numeric' : '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12h'
    });
    return timeFormat === '12h' ? timeStr.toUpperCase() : timeStr;
  };

  const getStatus = (time: Date, nextTime?: Date) => {
    if (!day.isToday) return 'upcoming';
    if (now > time && (!nextTime || now < nextTime)) return 'current';
    if (now > time) return 'completed';
    return 'upcoming';
  };

  const getTimeDiff = (target: Date) => {
    if (!day.isToday) return 'Coming up';
    const diffMs = target.getTime() - now.getTime();
    if (diffMs < 0) return '';
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `Starts in ${hours}h ${mins % 60}m`;
    return `Starts in ${mins}m`;
  };

  const prayers = [
    { id: 'fajr', name: 'Fajr', timeObj: day.fajrDate, icon: Sunrise },
    { id: 'dhuhr', name: 'Dhuhr', timeObj: day.dhuhrDate, icon: Sun },
    { id: 'asr', name: 'Asr', timeObj: day.asrDate, icon: Sun },
    { id: 'maghrib', name: 'Maghrib', timeObj: day.iftarDate, icon: Sunset },
    { id: 'isha', name: 'Isha', timeObj: day.ishaDate, icon: Moon },
  ];

  return (
    <div className="space-y-6">
      
      {/* Sehri & Iftar Grid - Only shown if it is Ramadan */}
      {showSehriIftarGrid && day.isRamadan && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Moon size={40} className="text-slate-900 dark:text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Sehri Time</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(day.sehriDate)}</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
               Ends just before Fajr
            </div>
          </div>

          <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-sm dark:shadow-none transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sunset size={40} className="text-slate-900 dark:text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Iftar Time</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-slate-900 dark:text-white">{formatTime(day.iftarDate)}</span>
              </div>
            </div>
             <div className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
               Starts at Maghrib
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
           <Clock size={20} className="text-emerald-500 dark:text-emerald-400" />
           {day.isRamadan ? 'Daily Prayers' : 'Prayer Schedule'}
        </h2>
        
        <div className="space-y-3">
          {prayers.map((prayer, index) => {
            const nextPrayer = prayers[index + 1];
            const status = getStatus(prayer.timeObj, nextPrayer?.timeObj);
            
            let cardStyle = "bg-white dark:bg-[#161F2E] border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm dark:shadow-none";
            let textStyle = "text-slate-900 dark:text-white";
            let subTextStyle = "text-slate-500 dark:text-slate-400";
            let iconStyle = "text-slate-400";
            let statusText = "Upcoming";
            let isAutoHighlighted = false;

            const isSelected = selectedPrayerId === prayer.id;

            if (isSelected) {
              cardStyle = "bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/50 scale-[1.02] z-10";
              textStyle = "text-white";
              subTextStyle = "text-blue-100";
              iconStyle = "text-white";
              statusText = formatTime(prayer.timeObj);
            } else {
                if (status === 'completed') {
                  statusText = "Completed";
                  subTextStyle = "text-slate-400 dark:text-slate-500";
                  textStyle = "text-slate-400 dark:text-slate-300";
                } else if (status === 'current') {
                  statusText = "Now";
                  cardStyle = "bg-blue-50 dark:bg-[#1E293B] border-blue-200 dark:border-blue-500/30";
                  textStyle = "text-slate-900 dark:text-white";
                } else if (status === 'upcoming') {
                  const prevPrayer = prayers[index - 1];
                  if (day.isToday && (!prevPrayer || now > prevPrayer.timeObj)) {
                      isAutoHighlighted = true;
                      cardStyle = "bg-gradient-to-r from-blue-500 to-blue-400 border-transparent shadow-lg shadow-blue-900/20";
                      statusText = getTimeDiff(prayer.timeObj);
                      subTextStyle = "text-blue-100";
                      iconStyle = "text-white";
                      textStyle = "text-white";
                  }
                }
            }

            const isNotified = notifications[prayer.id];
            const displayTime = formatTime(prayer.timeObj);

            return (
              <div 
                key={prayer.id} 
                onClick={() => setSelectedPrayerId(isSelected ? null : prayer.id)}
                className={`${cardStyle} rounded-2xl p-4 border flex items-center justify-between transition-all duration-200`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected || isAutoHighlighted ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800/50 ' + iconStyle}`}>
                      <prayer.icon size={20} />
                  </div>
                  <div>
                      <h3 className={`font-bold text-base ${textStyle}`}>{prayer.name}</h3>
                      <span className={`text-xs font-medium ${subTextStyle}`}>{statusText}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold tabular-nums ${isSelected || isAutoHighlighted ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {displayTime}
                  </span>
                  <button 
                    onClick={(e) => toggleNotification(e, prayer.id)}
                    className={`transition-colors p-1 rounded-full hover:bg-white/10 ${isSelected || isAutoHighlighted ? 'text-blue-100' : (isNotified ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600')}`}
                  >
                      {isNotified ? <Bell size={18} fill="currentColor" /> : <BellOff size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};