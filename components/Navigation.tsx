import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const items = [
    { view: AppView.CHAT, icon: 'fa-comments', label: 'Chat' },
    { view: AppView.EXPLORE, icon: 'fa-map-location-dot', label: 'Explore' },
    { view: AppView.EMERGENCY, icon: 'fa-shield-heart', label: 'Help' },
    { view: AppView.REVIEWS, icon: 'fa-star', label: 'Reviews' },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 px-1 py-3 flex justify-around items-center sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] print:hidden">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`flex flex-col items-center space-y-1 transition-all flex-1 ${
            currentView === item.view 
            ? 'text-indigo-600 scale-110' 
            : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <i className={`fas ${item.icon} text-lg`}></i>
          <span className="text-[8px] font-bold uppercase tracking-wider">{item.label}</span>
          {currentView === item.view && (
            <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;