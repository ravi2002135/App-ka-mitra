
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateSpeech } from '../services/geminiService';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onSendImage?: (base64: string) => void;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, onSendImage, isTyping }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState<number | null>(null);
  const [sttLang, setSttLang] = useState('en-IN');
  const [volume, setVolume] = useState(0.8);
  
  const endRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update volume in real-time if a gain node exists
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [volume]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onSendImage(base64String);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = sttLang;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const stopAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Source might have already finished
      }
      currentSourceRef.current = null;
    }
    setIsPlaying(null);
  };

  const decodeAudioData = async (base64: string, ctx: AudioContext) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const playSpeech = async (text: string, index: number) => {
    if (isPlaying === index) {
      stopAudio();
      return;
    }

    if (isPlaying !== null || isLoadingAudio !== null) {
      stopAudio(); // Stop previous before starting new
    }
    
    setIsLoadingAudio(index);
    const audioData = await generateSpeech(text);
    setIsLoadingAudio(null);
    
    if (audioData) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }
      
      gainNodeRef.current.gain.setValueAtTime(volume, ctx.currentTime);

      const buffer = await decodeAudioData(audioData, ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNodeRef.current);
      
      currentSourceRef.current = source;
      setIsPlaying(index);
      
      source.onended = () => {
        setIsPlaying(prev => prev === index ? null : prev);
      };
      source.start();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Volume Control Overlay (Global for the Window) */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-100 space-x-3 transition-all">
        <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-slate-400 text-xs w-4`}></i>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <span className="text-[10px] font-bold text-slate-400 w-6 text-right">{Math.round(volume * 100)}%</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pt-16">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-3xl p-5 shadow-sm relative group transition-all ${
              msg.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              {msg.image && (
                <div className="mb-4 rounded-2xl overflow-hidden shadow-md border-2 border-white/20">
                  <img src={msg.image} alt="Uploaded Landmark" className="w-full h-auto max-h-72 object-cover" />
                </div>
              )}
              
              <div className="text-sm leading-relaxed whitespace-pre-wrap pr-4">
                {msg.text.split('**').map((part, idx) => (
                  idx % 2 === 1 ? <strong key={idx} className="font-black">{part}</strong> : part
                ))}
              </div>
              
              {msg.role === 'model' && (
                <div className="flex items-center mt-3 space-x-2">
                  <button 
                    onClick={() => playSpeech(msg.text, i)}
                    title={isPlaying === i ? "Stop Audio" : "Listen to Mitra"}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shadow-sm ${
                      isPlaying === i 
                      ? 'bg-red-500 text-white scale-110 shadow-red-200' 
                      : isLoadingAudio === i
                      ? 'bg-slate-100 text-indigo-400'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isLoadingAudio === i ? (
                      <i className="fas fa-spinner fa-spin text-[10px]"></i>
                    ) : (
                      <i className={`fas ${isPlaying === i ? 'fa-stop' : 'fa-play'} text-[10px]`}></i>
                    )}
                  </button>
                  
                  {isPlaying === i && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>Speaking</span>
                    </div>
                  )}
                </div>
              )}

              {msg.groundingLinks && (
                <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Verified Insights:</p>
                  {msg.groundingLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center p-2.5 rounded-xl bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 transition-colors group/link border border-indigo-100/50"
                    >
                      <i className="fas fa-external-link-alt mr-2 text-[10px] text-indigo-300 group-hover/link:text-indigo-600"></i>
                      <span className="text-xs font-bold truncate">{link.title}</span>
                    </a>
                  ))}
                </div>
              )}
              
              <div className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-300'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 flex space-x-1.5 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.32s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.16s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      {isListening && (
        <div className="absolute inset-0 z-50 bg-indigo-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-xs text-center animate-bounce-in">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-inner">
              <i className="fas fa-microphone text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Mitra is Listening</h3>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Speaking: {sttLang}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
               {['en-IN', 'hi-IN', 'ta-IN', 'bn-IN', 'te-IN'].map(lang => (
                 <button 
                  key={lang}
                  onClick={() => setSttLang(lang)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${sttLang === lang ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-indigo-200'}`}
                 >
                   {lang.split('-')[0]}
                 </button>
               ))}
            </div>
            <button 
              onClick={() => setIsListening(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Done Speaking
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        <div className="flex items-center space-x-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group"
            title="Analyze Photo"
          >
            <i className="fas fa-camera-retro group-hover:scale-110 transition-transform"></i>
          </button>

          <button
            type="button"
            onClick={startListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}
            title="Voice Search"
          >
            <i className="fas fa-microphone"></i>
          </button>
          
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message App Ka Mitra..."
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-30 transition-all shadow-xl active:scale-95"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
      
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.9); opacity: 0; }
          70% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 0 4px rgba(79, 70, 229, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
