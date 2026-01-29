import React from 'react';
import { Sparkles, Coffee, Sunset } from 'lucide-react';
import { DailyInsight } from '../types';

interface DuasViewProps {
  dailyInsight: DailyInsight | null;
  loading: boolean;
}

export const DuasView: React.FC<DuasViewProps> = ({ dailyInsight, loading }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-6">
       
       {/* 1. Daily Insight (AI Powered) */}
       <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-[#161F2E] dark:to-[#0f172a] p-6 rounded-2xl border border-slate-700 dark:border-slate-800 shadow-md relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-6 border-b border-slate-700 dark:border-slate-800 pb-4 relative z-10">
             <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <Sparkles size={20}/>
             </div>
             <h2 className="text-lg font-bold">Daily Inspiration (AI)</h2>
          </div>
          
          {loading ? (
             <div className="space-y-4 py-4">
                <div className="h-4 bg-slate-700 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-700 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-700 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
             </div>
          ) : (
             dailyInsight && (
                <div className="space-y-6 relative z-10">
                   <div className="text-center">
                      <h3 className="text-xs text-slate-400 uppercase tracking-widest mb-3">Dua of the Day</h3>
                      <p className="text-2xl font-serif text-emerald-300 leading-relaxed italic mb-3">"{dailyInsight.dua}"</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{dailyInsight.translation}</p>
                   </div>
                   <div className="bg-slate-900/30 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <h3 className="text-xs text-blue-400 uppercase font-bold mb-1.5 flex items-center gap-1.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                         Tip of the Day
                      </h3>
                      <p className="text-sm text-slate-300">{dailyInsight.tip}</p>
                   </div>
                </div>
             )
          )}
       </div>

       {/* 2. Static Sehri Dua */}
       <div className="bg-white dark:bg-[#161F2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Coffee size={16} />
             </div>
             <h3 className="text-base font-bold text-slate-900 dark:text-white">Sehri Dua</h3>
          </div>
          <p className="text-lg font-serif text-emerald-600 dark:text-emerald-300 mb-2 italic text-center">
             "Wa bisawmi ghadinn nawaiytu min shahri ramadan"
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
             I intend to keep the fast for tomorrow in the month of Ramadan.
          </p>
       </div>

       {/* 3. Static Iftar Dua */}
       <div className="bg-white dark:bg-[#161F2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Sunset size={16} />
             </div>
             <h3 className="text-base font-bold text-slate-900 dark:text-white">Iftar Dua</h3>
          </div>
          <p className="text-lg font-serif text-blue-600 dark:text-blue-300 mb-2 italic text-center">
             "Allahumma inni laka sumtu wa bika aamantu wa 'alayka tawakkaltu wa 'ala rizq-ika aftartu"
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
             O Allah! I fasted for You and I believe in You and I put my trust in You and I break my fast with Your sustenance.
          </p>
       </div>

    </div>
  );
};