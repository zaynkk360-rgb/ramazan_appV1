import React from 'react';
import { Home, Calendar, BookOpen, Compass, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
    { id: 'Duas', icon: BookOpen, label: 'Duas' },
    { id: 'Qibla', icon: Compass, label: 'Qibla' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B121E] text-slate-900 dark:text-white pb-24 relative overflow-hidden font-sans transition-colors duration-300">
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-50 dark:bg-[#0B121E]">
        {/* Main Content Area - Added pt-safe-top for status bar handling */}
        <main className="px-4 py-4 space-y-4 pt-safe-top">
          {children}
        </main>

        {/* Bottom Navigation - Sticky */}
        <div className="fixed bottom-0 w-full max-w-md bg-white dark:bg-[#161F2E] border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors duration-300 z-50">
          <div className="flex justify-between items-center px-2 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex flex-col items-center justify-center w-full space-y-1 transition-colors ${
                    isActive ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;