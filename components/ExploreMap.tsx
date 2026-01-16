
import React, { useState } from 'react';
import { Location } from '../types';
import ARViewer from './ARViewer';

interface ExploreMapProps {
  location: Location | null;
}

const ExploreMap: React.FC<ExploreMapProps> = ({ location }) => {
  const [showAR, setShowAR] = useState(false);
  
  // Use a classic Google Maps embed approach to show location without a complex API key
  const mapUrl = location 
    ? `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=16&output=embed`
    : "";

  if (showAR) {
    return <ARViewer location={location} onExit={() => setShowAR(false)} />;
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-100 relative">
      <div className="p-4 bg-white border-b border-slate-200 z-10">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Bharat Explorer</h2>
        <div className="flex items-center mt-1">
          <div className={`w-2 h-2 rounded-full mr-2 ${location ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
          <p className="text-xs text-slate-500 font-medium">
            {location ? `Tracking: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Waiting for GPS signal..."}
          </p>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {location ? (
          <>
            <iframe
              title="Interactive Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={mapUrl}
              className="absolute inset-0"
            ></iframe>
            
            {/* AR Vision Toggle Button */}
            <div className="absolute top-4 right-4 pointer-events-auto">
              <button 
                onClick={() => setShowAR(true)}
                className="group flex items-center bg-indigo-600 text-white pl-2 pr-4 py-2 rounded-full shadow-2xl hover:bg-indigo-700 transition-all active:scale-95 border-2 border-white/50"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                  <i className="fas fa-camera text-sm"></i>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">AR Vision</span>
              </button>
            </div>

            {/* Overlay UI Controls */}
            <div className="absolute bottom-6 left-0 w-full px-4 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/50 flex justify-around items-center pointer-events-auto max-w-sm mx-auto">
                <button className="flex flex-col items-center space-y-1 group">
                   <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <i className="fas fa-om"></i>
                   </div>
                   <span className="text-[9px] font-bold uppercase text-slate-500">Temples</span>
                </button>
                <button className="flex flex-col items-center space-y-1 group">
                   <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <i className="fas fa-fort-awesome"></i>
                   </div>
                   <span className="text-[9px] font-bold uppercase text-slate-500">Forts</span>
                </button>
                <button className="flex flex-col items-center space-y-1 group">
                   <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                      <i className="fas fa-shopping-bag"></i>
                   </div>
                   <span className="text-[9px] font-bold uppercase text-slate-500">Bazaars</span>
                </button>
                <button className="flex flex-col items-center space-y-1 group">
                   <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                      <i className="fas fa-utensils"></i>
                   </div>
                   <span className="text-[9px] font-bold uppercase text-slate-500">Food</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-25"></div>
              <i className="fas fa-location-dot text-4xl text-indigo-600"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800">Searching for Satellites</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-[200px]">App Ka Mitra needs GPS access to track your journey across the subcontinent.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Grant Permissions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreMap;
