
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('mitra_users') || '[]');
        
        if (mode === 'login') {
          const user = users.find((u: any) => u.email === email && u.password === password);
          if (user) {
            onLogin({ id: user.id, name: user.name, email: user.email });
          } else {
            setError('Invalid email or password.');
          }
        } else if (mode === 'signup') {
          if (users.some((u: any) => u.email === email)) {
            setError('Email already registered.');
          } else {
            const newUser = { id: Date.now().toString(), name, email, password };
            users.push(newUser);
            localStorage.setItem('mitra_users', JSON.stringify(users));
            onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });
          }
        } else if (mode === 'forgot') {
          const userExists = users.some((u: any) => u.email === email);
          if (userExists) {
            setMode('reset');
            setSuccess('Account verified. Please set your new password.');
          } else {
            setError('No account found with this email.');
          }
        } else if (mode === 'reset') {
          const userIndex = users.findIndex((u: any) => u.email === email);
          if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('mitra_users', JSON.stringify(users));
            setSuccess('Password reset successful! You can now login.');
            setMode('login');
            setPassword('');
            setNewPassword('');
          } else {
            setError('Something went wrong. Please try again.');
            setMode('forgot');
          }
        }
      } catch (err) {
        setError('An error occurred during authentication.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative overflow-hidden" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1920")' }}>
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px]"></div>

      <div className="w-full max-w-md glass-effect rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-white/30">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl border-4 border-indigo-100 p-1">
             <img 
               src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
               alt="App Ka Mitra Guru" 
               className="w-full h-full object-contain rounded-full"
             />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">App Ka Mitra</h1>
          <p className="text-indigo-700 font-bold text-sm uppercase tracking-widest">
            {mode === 'login' ? 'Welcome Back, Traveler!' : 
             mode === 'signup' ? 'Begin Your Divine Journey' :
             mode === 'forgot' ? 'Retrieve Your Access' : 'Secure Your Account'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-lg animate-fade-in">
            <i className="fas fa-exclamation-circle mr-2"></i> {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-bold rounded-lg animate-fade-in">
            <i className="fas fa-check-circle mr-2"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                required
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/70 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              />
            </div>
          )}
          
          {(mode !== 'reset') && (
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                required
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/70 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              />
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/70 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              />
            </div>
          )}

          {mode === 'reset' && (
            <div className="relative">
              <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                required
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/70 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => toggleMode('forgot')}
                className="text-[11px] font-bold text-indigo-700 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <span>
                {mode === 'login' ? 'Login' : 
                 mode === 'signup' ? 'Join Mitra' : 
                 mode === 'forgot' ? 'Verify Email' : 'Update Password'}
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          {mode !== 'login' && (
            <button
              onClick={() => toggleMode('login')}
              className="block w-full text-sm font-bold text-slate-700 hover:text-indigo-800 transition-colors drop-shadow-sm"
            >
              Back to Login
            </button>
          )}
          
          {mode === 'login' && (
            <button
              onClick={() => toggleMode('signup')}
              className="block w-full text-sm font-bold text-slate-700 hover:text-indigo-800 transition-colors drop-shadow-sm"
            >
              New here? Create your spiritual profile
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Auth;
