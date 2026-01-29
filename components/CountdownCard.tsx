import React, { useState, useEffect } from 'react';
import { Share2, Clock, CheckCircle2 } from 'lucide-react';
import { RamadanDay } from '../types';

interface CountdownCardProps {
  day: RamadanDay;
  timeFormat?: '12h' | '24h';
}

const CountdownCard: React.FC<CountdownCardProps> = ({ day, timeFormat = '12h' }) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [targetLabel, setTargetLabel] = useState("");
  const [targetTime, setTargetTime] = useState("");

  const formatTime = (date: Date) => {
    const s = date.toLocaleTimeString([], {
      hour: timeFormat === '12h' ? 'numeric' : '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12h'
    });
    return timeFormat === '12h' ? s.toUpperCase() : s;
  };

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      let target: Date | null = null;
      let label = "";

      if (day.isRamadan) {
        // -- RAMADAN MODE (Sehri / Iftar) --
        if (now < day.sehriDate) {
          target = day.sehriDate;
          label = "Sehri Ends";
        } else if (now < day.iftarDate) {
          target = day.iftarDate;
          label = "Iftar Starts";
        } else {
          // Post Iftar - Technically waiting for next Sehri, but we usually show 0 or "Done"
          // For countdown continuity, we can point to next prayer (Isha) or just "Completed"
          if (now < day.ishaDate) {
             target = day.ishaDate;
             label = "Isha Prayer";
          } else {
             label = "Day Completed";
             target = null;
          }
        }
      } else {
        // -- NORMAL MODE (5 Prayers) --
        const prayers = [
          { name: "Fajr", time: day.fajrDate },
          { name: "Dhuhr", time: day.dhuhrDate },
          { name: "Asr", time: day.asrDate },
          { name: "Maghrib", time: day.iftarDate },
          { name: "Isha", time: day.ishaDate }
        ];

        // Find next prayer
        const next = prayers.find(p => now < p.time);
        
        if (next) {
          target = next.time;
          label = `${next.name} Prayer`;
        } else {
           // If all passed, technically it's Fajr tomorrow, but we handle single day obj here.
           label = "Fajr Tomorrow";
           target = null; 
        }
      }

      setTargetLabel(label);
      if (target) {
        setTargetTime(formatTime(target));
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) {
          setTimeLeft("00:00:00");
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
          );
        }
      } else {
        setTimeLeft("00:00:00");
        setTargetTime("--:--");
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); 

    return () => clearInterval(timer);
  }, [day, timeFormat]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#065F46] border border-emerald-800 p-5 shadow-lg">
      
      {/* Decorative Moon */}
      <div className="absolute -right-6 -top-6 w-32 h-32 opacity-20 pointer-events-none">
         <svg viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 w-full h-full">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
         </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold tracking-widest text-emerald-100 uppercase">
             {day.isRamadan ? 'Ramadan Countdown' : 'Next Prayer'}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1 mb-6">
          <span className="text-5xl font-bold text-white tracking-tight tabular-nums">{timeLeft}</span>
        </div>

        <div className="border-t border-emerald-700/50 pt-4 flex justify-between items-end">
          <div>
            <h3 className="text-xs font-bold text-emerald-400 tracking-wider mb-2 uppercase flex items-center gap-2">
               {targetLabel}
               {timeLeft === "00:00:00" && <CheckCircle2 size={14} />}
            </h3>
            
            <div className="flex items-center gap-2">
               <Clock size={16} className="text-emerald-200" />
               <span className="text-2xl font-bold text-white">{targetTime}</span>
            </div>
          </div>

          <button className="p-2 rounded-lg bg-emerald-800/50 hover:bg-emerald-800 text-emerald-100 transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownCard;