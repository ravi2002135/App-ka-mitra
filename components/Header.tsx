
import React, { useState } from 'react';
import { Location, User } from '../types';

interface HeaderProps {
  location: Location | null;
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ location, currentUser, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center z-30 relative shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-200 shadow-md">
           <img 
             src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
             alt="Mitra Guru" 
             className="w-full h-full object-contain"
           />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">App Ka Mitra</h1>
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-none">Your Spiritual Guide</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {location && (
          <div className="hidden sm:flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            GPS Active
          </div>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-200 shadow-sm"
          >
            <i className="fas fa-user-circle text-xl"></i>
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-fade-in-up">
                <div className="px-5 py-4 border-b border-slate-50 mb-1">
                  <p className="text-xs font-black text-slate-800 truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.email}</p>
                </div>
                <button className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center transition-colors">
                  <i className="fas fa-heart mr-3 text-pink-400"></i> My Favorites
                </button>
                <button className="w-full text-left px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center transition-colors">
                  <i className="fas fa-cog mr-3 text-slate-400"></i> Settings
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-5 py-3 text-xs font-black text-red-500 hover:bg-red-50 flex items-center transition-colors border-t border-slate-50 mt-1"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
