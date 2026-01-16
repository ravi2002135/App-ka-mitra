
import React, { useRef, useState, useEffect } from 'react';
import { Location, LandmarkInfo } from '../types';
import { analyzeImageForLandmark } from '../services/geminiService';

interface ARViewerProps {
  location: Location | null;
  onExit: () => void;
}

const ARViewer: React.FC<ARViewerProps> = ({ location, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [landmark, setLandmark] = useState<LandmarkInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Please enable camera access for the AR Guide.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;

    setIsScanning(true);
    setLandmark(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = dataUrl.split(',')[1];

      const result = await analyzeImageForLandmark(base64Data, location);
      setLandmark(result);
    }
    
    setIsScanning(false);
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      {/* Live Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay Interface */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Top Controls */}
        <div className="flex justify-between items-start pointer-events-auto">
          <button 
            onClick={onExit}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-white/20 flex items-center">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
            AR ACTIVE
          </div>
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse"></div>
        )}

        {/* Dynamic AR Card */}
        {landmark && (
          <div className="pointer-events-auto animate-fade-in-up">
            <div className="glass-effect rounded-3xl p-5 border border-white/40 shadow-2xl mb-24 max-h-[60vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">{landmark.name}</h2>
                <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-1 rounded-lg text-xs">
                   <i className="fas fa-star mr-1"></i> {landmark.rating}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-1">History</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{landmark.history}</p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50/50 p-3 rounded-2xl border border-slate-200/50">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Hours</h3>
                    <p className="text-xs font-bold text-slate-800">{landmark.openingHours}</p>
                  </div>
                  <div className="flex-1 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-200/50">
                    <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Fun Fact</h3>
                    <p className="text-[10px] font-medium text-indigo-800 leading-tight">{landmark.funFact}</p>
                  </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 italic">What visitors say...</h3>
                   <div className="bg-white/40 p-3 rounded-xl border border-white/60">
                     <p className="text-xs text-slate-600 italic">"{landmark.reviewSnippet}"</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-center items-center pointer-events-auto pb-4">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`group relative flex items-center justify-center transition-transform active:scale-90 ${isScanning ? 'opacity-50' : ''}`}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xl shadow-lg group-hover:bg-indigo-50 transition-colors">
                  <i className={`fas ${isScanning ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
               </div>
            </div>
            {!landmark && !isScanning && (
              <div className="absolute -top-12 bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-bounce">
                Scan Landmark
              </div>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-8 text-center text-white z-50">
          <i className="fas fa-exclamation-triangle text-5xl text-amber-500 mb-4"></i>
          <h2 className="text-xl font-bold mb-2">Camera Access Required</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 rounded-full font-bold"
          >
            Enable & Reload
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ARViewer;
