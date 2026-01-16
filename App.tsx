
import React, { useState, useEffect } from 'react';
import { AppView, Message, Location, User } from './types';
import { sendMessageToAi, analyzeImageForLandmark } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ExploreMap from './components/ExploreMap';
import ReviewFeed from './components/ReviewFeed';
import EmergencyHub from './components/EmergencyHub';
import Navigation from './components/Navigation';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [view, setView] = useState<AppView>(AppView.CHAT);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Namaste! 🙏 I am App Ka Mitra, your personal guide to the incredible heritage of India. How can I help you explore today? You can type, use the voice assistant, or even upload a photo of a landmark for me to identify!",
      timestamp: Date.now()
    }
  ]);
  const [location, setLocation] = useState<Location | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('mitra_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsAuthChecking(false);

    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.warn("GPS tracking error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mitra_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mitra_session');
    setView(AppView.CHAT);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const response = await sendMessageToAi(text, messages, location);
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const handleSendImage = async (base64Data: string) => {
    const userMsg: Message = { 
      role: 'user', 
      text: "I've uploaded a photo of a landmark. Can you tell me what it is?", 
      image: `data:image/jpeg;base64,${base64Data}`,
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const result = await analyzeImageForLandmark(base64Data, location);
    
    let modelMsg: Message;
    if (result) {
      const formattedText = `I've identified this as **${result.name}**! 🏛️\n\n**History:** ${result.history}\n\n**Visitor Info:** ${result.openingHours}\n\n**Fun Fact:** ${result.funFact}\n\n*What visitors say:* "${result.reviewSnippet}"`;
      modelMsg = {
        role: 'model',
        text: formattedText,
        timestamp: Date.now()
      };
    } else {
      modelMsg = {
        role: 'model',
        text: "I'm sorry, I couldn't identify the landmark in this photo. Could you try a clearer shot or a different angle?",
        timestamp: Date.now()
      };
    }

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const findNearbyPolice = () => {
    setView(AppView.CHAT);
    handleSendMessage("Find and list the nearest police stations to my current location with their contact numbers.");
  };

  if (isAuthChecking) return null;

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (view) {
      case AppView.CHAT:
        return <ChatWindow messages={messages} onSendMessage={handleSendMessage} onSendImage={handleSendImage} isTyping={isTyping} />;
      case AppView.EXPLORE:
        return <ExploreMap location={location} />;
      case AppView.REVIEWS:
        return <ReviewFeed currentUser={currentUser} />;
      case AppView.EMERGENCY:
        return <EmergencyHub location={location} onFindPolice={findNearbyPolice} />;
      default:
        return <ChatWindow messages={messages} onSendMessage={handleSendMessage} onSendImage={handleSendImage} isTyping={isTyping} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-slate-50 shadow-2xl overflow-hidden print:bg-white print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Header location={location} currentUser={currentUser} onLogout={handleLogout} />
      </div>
      <main className="flex-1 overflow-hidden relative print:overflow-visible print:static">
        {renderContent()}
      </main>
      <Navigation currentView={view} setView={setView} />
    </div>
  );
};

export default App;
