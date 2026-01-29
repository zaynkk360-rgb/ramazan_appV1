import React from 'react';
import { RamadanDay } from '../types';

interface DayRowProps {
  day: RamadanDay;
}

const DayRow: React.FC<DayRowProps> = ({ day }) => {
  if (day.isToday) {
    return (
      <div className="bg-[#0F3866] rounded-xl p-4 border border-blue-500/30 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {day.dayNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{day.hijriDate}</span>
                <span className="bg-blue-500 text-[9px] font-bold px-1.5 py-0.5 rounded text-white uppercase tracking-wide">Today</span>
              </div>
              <span className="text-xs text-blue-200">{day.gregorianDate}</span>
            </div>
          </div>
          
          <div className="text-right">
             <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2 mb-1">
                   <span className="text-[10px] uppercase text-blue-300">Sehri</span>
                   <span className="text-sm font-bold text-white">{day.sehriTime.replace(' AM', '')} <span className="text-[10px] text-blue-300">AM</span></span>
                </div>
                <div className="flex items-baseline gap-2">
                   <span className="text-[10px] uppercase text-blue-300">Iftar</span>
                   <span className="text-sm font-bold text-white">{day.iftarTime.replace(' PM', '')} <span className="text-[10px] text-blue-300">PM</span></span>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Row
  return (
    <div className="bg-[#161F2E] rounded-xl p-4 border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#1E293B] border border-slate-700 flex items-center justify-center text-slate-400 font-semibold text-sm group-hover:text-slate-300">
          {day.dayNumber}
        </div>
        <div>
          <span className="block font-semibold text-slate-200 text-sm">{day.hijriDate}</span>
          <span className="text-xs text-slate-500">{day.gregorianDate}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-right">
        <div className="text-slate-400 font-medium text-sm tabular-nums">
          {day.sehriTime}
        </div>
        <div className="text-slate-400 font-medium text-sm tabular-nums">
          {day.iftarTime}
        </div>
      </div>
    </div>
  );
};

export default DayRow;