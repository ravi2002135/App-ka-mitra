
import React, { useState, useEffect } from 'react';
import { Location } from '../types';

interface EmergencyHubProps {
  location: Location | null;
  onFindPolice: () => void;
}

// Statically defined helplines ensure availability even when the device is completely offline.
const STATIC_HELPLINES = [
  { name: "National Emergency", number: "112", icon: "fa-phone-flip", color: "bg-red-600" },
  { name: "Police", number: "100", icon: "fa-shield", color: "bg-blue-600" },
  { name: "Ambulance", number: "102", icon: "fa-truck-medical", color: "bg-green-600" },
  { name: "Fire", number: "101", icon: "fa-fire-extinguisher", color: "bg-orange-600" },
  { name: "Women Helpline", number: "1091", icon: "fa-person-dress", color: "bg-pink-600" },
  { name: "Tourist Helpline", number: "1363", icon: "fa-map-marked-alt", color: "bg-indigo-600" },
];

const EmergencyHub: React.FC<EmergencyHubProps> = ({ location, onFindPolice }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handlePoliceSearch = () => {
    if (!isOnline) {
      alert("Finding nearby police stations requires an active internet connection to query live maps. Please check your network.");
      return;
    }
    onFindPolice();
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50 overflow-y-auto pb-24">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Assistance Hub</h2>
          <p className="text-sm text-slate-500 font-medium">Emergency assistance & local protocols</p>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${isOnline ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
          <i className={`fas ${isOnline ? 'fa-globe' : 'fa-plane'} mr-1.5`}></i>
          {isOnline ? 'Online' : 'Offline Mode'}
        </div>
      </div>

      {/* SOS Button */}
      <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-center shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
           <i className="fas fa-life-ring text-8xl"></i>
        </div>
        <button 
          onClick={() => handleCall("112")}
          className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl shadow-xl shadow-red-200 active:scale-95 transition-transform mx-auto mb-4 relative z-10"
        >
          <i className="fas fa-sos"></i>
        </button>
        <h3 className="text-lg font-bold text-red-700 relative z-10">One-Tap SOS</h3>
        <p className="text-xs text-red-600/70 font-medium mt-1 uppercase tracking-widest relative z-10">Primary Emergency Response (112)</p>
      </div>

      {/* Local Data Confirmation */}
      <div className="mb-6 flex items-center space-x-2 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs shrink-0">
          <i className="fas fa-database"></i>
        </div>
        <p className="text-[10px] font-bold text-indigo-800 leading-tight">
          All helpline data is stored locally on your device and is available even without internet or cellular data.
        </p>
      </div>

      {/* Police Station Quick Finder */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 flex items-center">
          Live Services {isOnline ? '' : <span className="ml-2 text-amber-500 font-bold">(Requires Internet)</span>}
        </h3>
        <button 
          onClick={handlePoliceSearch}
          className={`w-full bg-white border border-slate-200 p-4 rounded-2xl flex items-center space-x-4 transition-all shadow-sm active:scale-98 ${!isOnline ? 'opacity-60 grayscale-[0.5]' : 'hover:bg-slate-50'}`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${isOnline ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
            <i className="fas fa-building-shield"></i>
          </div>
          <div className="text-left flex-1">
            <h4 className="text-sm font-bold text-slate-800">Nearby Police Stations</h4>
            <p className="text-xs text-slate-500">{isOnline ? 'Find the closest station to your GPS' : 'Internet connection needed'}</p>
          </div>
          <i className={`fas ${isOnline ? 'fa-chevron-right' : 'fa-lock'} text-slate-300 text-sm`}></i>
        </button>
      </div>

      {/* Helpline Numbers */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Offline Quick Dial</h3>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Local Cache Active</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {STATIC_HELPLINES.map((h, i) => (
            <button
              key={i}
              onClick={() => handleCall(h.number)}
              className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2 hover:border-slate-300 transition-all active:scale-95 shadow-sm group"
            >
              <div className={`w-10 h-10 ${h.color} rounded-full flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform`}>
                <i className={`fas ${h.icon}`}></i>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-800 leading-tight uppercase tracking-tighter">{h.name}</p>
                <p className="text-xs font-bold text-indigo-600">{h.number}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Offline Safety Tips */}
      <div className="mt-8 p-4 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl">
        <h3 className="text-xs font-bold text-indigo-400 mb-3 flex items-center">
          <i className="fas fa-hand-holding-heart mr-2"></i> Traveler Safety Protocol
        </h3>
        <ul className="text-[11px] text-slate-400 space-y-2.5 font-medium">
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-indigo-400 mr-2 shrink-0 border border-slate-700">1</span>
            <span>Always keep a digital & physical copy of your ID.</span>
          </li>
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-indigo-400 mr-2 shrink-0 border border-slate-700">2</span>
            <span>Remove shoes before entering temples or homes.</span>
          </li>
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-indigo-400 mr-2 shrink-0 border border-slate-700">3</span>
            <span>Use pre-paid taxis or Ola/Uber for verified transport.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyHub;
