import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface Review {
  id: number;
  user: string;
  avatar: string;
  location: string;
  rating: number;
  content: string;
  date: string;
}

interface ReviewFeedProps {
  currentUser: User;
}

const ReviewFeed: React.FC<ReviewFeedProps> = ({ currentUser }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      user: "Arjun Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      location: "Taj Mahal, Agra",
      rating: 5,
      content: "App Ka Mitra's voice guide was crystal clear. It explained the Islamic calligraphy on the walls in Hindi perfectly!",
      date: "1 hour ago"
    },
    {
      id: 2,
      user: "Priya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      location: "Golden Temple, Amritsar",
      rating: 5,
      content: "The app's GPS tracking guided me right to the Langar. The community spirit here is incredible.",
      date: "5 hours ago"
    },
    {
      id: 3,
      user: "Ananya Iyer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      location: "Amer Fort, Jaipur",
      rating: 5,
      content: "Found the hidden passage to Jaigarh Fort thanks to the maps integration. Best tour guide in my pocket!",
      date: "2 days ago"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ content: '', rating: 5, location: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.content || !newReview.location) return;

    const review: Review = {
      id: Date.now(),
      user: currentUser.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
      location: newReview.location,
      rating: newReview.rating,
      content: newReview.content,
      date: "Just now"
    };

    setReviews([review, ...reviews]);
    setNewReview({ content: '', rating: 5, location: '' });
    setShowForm(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="p-4 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Community Stories</h2>
        <p className="text-xs text-slate-500 font-medium">Real experiences from Bharat's trails</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-2xl text-white animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl rotate-12">
               <i className="fas fa-quote-right"></i>
            </div>
            
            <h3 className="font-bold mb-4 flex items-center relative z-10">
              <i className="fas fa-pen-nib mr-2"></i> Share Your Experience
            </h3>
            
            <div className="space-y-3 relative z-10">
              <input 
                type="text" 
                placeholder="Where are you? (e.g. Hampi)"
                value={newReview.location}
                onChange={(e) => setNewReview({...newReview, location: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all"
              />
              <textarea 
                placeholder="What did you discover today?"
                value={newReview.content}
                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all h-28"
              />
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={`text-lg transition-all ${star <= newReview.rating ? 'text-amber-300 scale-110' : 'text-indigo-400'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowForm(false)} className="text-xs font-bold text-white/70 hover:text-white">Cancel</button>
                  <button type="submit" className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase shadow-lg shadow-black/10 active:scale-95 transition-all">Post Review</button>
                </div>
              </div>
            </div>
          </form>
        )}

        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-md group">
            <div className="flex items-center space-x-4 mb-4">
              <img src={rev.avatar} alt={rev.user} className="w-12 h-12 rounded-full border-2 border-indigo-50 bg-slate-100 shadow-sm" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{rev.user}</h4>
                <div className="flex items-center text-[10px] text-orange-600 font-black uppercase tracking-widest">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {rev.location}
                </div>
              </div>
              <div className="ml-auto flex text-amber-400 text-[10px] space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i >= rev.rating ? 'text-slate-100' : ''}`}></i>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <i className="fas fa-quote-left absolute -left-2 -top-2 text-indigo-50 text-2xl group-hover:text-indigo-100 transition-colors"></i>
              <p className="text-slate-600 text-sm italic leading-relaxed relative z-10 pl-4">
                {rev.content}
              </p>
            </div>
            
            <div className="mt-4 flex justify-between items-center border-t border-slate-50 pt-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rev.date}</span>
              <div className="flex space-x-4">
                <button className="text-[10px] text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                  <i className="far fa-heart mr-1"></i> Helpful
                </button>
                <button className="text-[10px] text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                  <i className="far fa-comment-alt mr-1"></i> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-6 border-2 border-dashed border-indigo-100 rounded-[2.5rem] text-indigo-400 font-bold text-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
               <i className="fas fa-plus"></i>
            </div>
            <span>Share your adventure</span>
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReviewFeed;