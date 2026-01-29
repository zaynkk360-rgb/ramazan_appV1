import React, { useState } from 'react';
import { RamadanDay } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { PrayerTimesList } from './PrayerTimesList';

interface CalendarViewProps {
  days: RamadanDay[];
  timeFormat?: '12h' | '24h';
}

export const CalendarView: React.FC<CalendarViewProps> = ({ days, timeFormat = '12h' }) => {
  // Find today to set initial state
  const today = days.find(d => d.isToday) || days[0];
  const [selectedDay, setSelectedDay] = useState<RamadanDay>(today);
  
  // State for the currently displayed month in the calendar grid
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.date));

  const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  
  // Helper to get first day of week for the month (0 = Sun, 1 = Mon, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);

  // Generate calendar grid slots
  // Blanks for days before the 1st of the month
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => null);
  // Numbers for the actual days
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...monthDays];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };
  
  // Format Month Year (e.g., February 2024)
  const monthLabel = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-fadeIn space-y-6">
       
       {/* Calendar Container */}
       <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          {/* Header & Navigation */}
          <div className="flex justify-between items-center mb-6">
             <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <ChevronLeft size={20} />
             </button>
             <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalIcon size={18} className="text-blue-500" />
                {monthLabel}
             </h2>
             <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <ChevronRight size={20} />
             </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 mb-2">
             {weekDaysShort.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider py-1">
                   {d}
                </div>
             ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
             {totalSlots.map((dateNum, index) => {
                // If it's a blank slot (padding for start of month)
                if (!dateNum) return <div key={`blank-${index}`} className="h-12"></div>;

                // Check if this date exists in our Ramadan Data
                const ramadanDay = days.find(d => 
                   d.date.getDate() === dateNum && 
                   d.date.getMonth() === month && 
                   d.date.getFullYear() === year
                );

                const hasData = !!ramadanDay;
                const isSelected = selectedDay && ramadanDay && selectedDay.dayNumber === ramadanDay.dayNumber;
                const isToday = ramadanDay?.isToday;
                const isPast = ramadanDay?.status === 'past';

                return (
                   <button
                      key={index}
                      disabled={!hasData}
                      onClick={() => ramadanDay && setSelectedDay(ramadanDay)}
                      className={`
                         relative h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200
                         ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105 z-10' : ''}
                         ${!isSelected && hasData ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200' : ''}
                         ${!isSelected && !hasData ? 'text-slate-300 dark:text-slate-700 cursor-default' : ''}
                         ${isToday && !isSelected ? 'bg-blue-50 dark:bg-[#0F3866] border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-100' : ''}
                         ${isPast && !isSelected ? 'opacity-50' : ''}
                      `}
                   >
                      <span className={`text-sm ${hasData || isSelected ? 'font-bold' : 'font-normal'}`}>{dateNum}</span>
                      
                      {/* Show Ramadan Day Number if available */}
                      {hasData && (
                        <span className={`text-[9px] ${isSelected ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'}`}>
                           Day {ramadanDay.dayNumber}
                        </span>
                      )}

                      {/* Today Indicator Dot */}
                      {isToday && !isSelected && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400"></span>}
                   </button>
                );
             })}
          </div>
       </div>

       {/* Selected Day Details Panel */}
       {selectedDay && (
          <div className="space-y-6 animate-fadeIn" key={selectedDay.dayNumber}>
             <div className="flex items-center justify-between px-2 pt-2">
                <div>
                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedDay.hijriDate}</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDay.gregorianDate}</p>
                </div>
                <div className="text-right">
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                      Day {selectedDay.dayNumber}
                   </span>
                </div>
             </div>

             {/* Reusing PrayerTimesList component for consistency */}
             <PrayerTimesList day={selectedDay} showSehriIftarGrid={true} timeFormat={timeFormat} />
          </div>
       )}
    </div>
  );
};