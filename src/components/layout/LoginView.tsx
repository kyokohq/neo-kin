import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } from '../../lib/firebase';
import { Mail, Lock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await resetPassword(email);
      setMessage("Password reset link sent to your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Ghost Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[25vw] font-black leading-none text-white/[0.02] uppercase -rotate-12 translate-x-[-10vw]">Kinship</span>
        <span className="text-[25vw] font-black leading-none text-app-accent/[0.02] uppercase -rotate-12 translate-x-[10vw]">Kinship</span>
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-12">
            <h1 className="text-[120px] font-black text-app-accent leading-[0.8] tracking-[-0.08em] uppercase">Kinship</h1>
            <div className="text-[14px] font-black tracking-[0.4em] text-white uppercase mt-4">Legacy Simulator</div>
          </div>

          <div className="bg-app-panel border border-white/10 p-8 shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted">Email Identity</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 py-4 pl-12 pr-4 text-white font-bold uppercase tracking-widest text-xs focus:border-app-accent outline-none"
                    placeholder="ENTER EMAIL..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-app-muted">Secure Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 py-4 pl-12 pr-4 text-white font-bold uppercase tracking-widest text-xs focus:border-app-accent outline-none"
                    placeholder="ENTER PASSWORD..."
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-rose-500/10 border border-rose-500/20 p-3 flex items-center gap-3"
                  >
                    <AlertCircle className="text-rose-500 shrink-0" size={16} />
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{error}</span>
                  </motion.div>
                )}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-app-accent/10 border border-app-accent/20 p-3 flex items-center gap-3"
                  >
                    <CheckCircle2 className="text-app-accent shrink-0" size={16} />
                    <span className="text-[9px] font-black text-app-accent uppercase tracking-widest">{message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-5 px-8 font-black text-sm uppercase tracking-widest hover:bg-app-accent transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "AUTHENTICATING..." : isRegister ? "Create Identity" : "Authorize Session"}
                {!isLoading && <ChevronRight size={18} />}
              </button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[9px] font-black uppercase tracking-widest text-app-accent hover:text-white transition-colors cursor-pointer"
                >
                  {isRegister ? "Already Registered?" : "New Kin-Friend?"}
                </button>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="text-[9px] font-black uppercase tracking-widest text-app-muted hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Access?
                  </button>
                )}
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.4em]"><span className="bg-app-panel px-4 text-app-muted">OR EXTERNAL PROVIDER</span></div>
            </div>

            <button
              type="button"
              onClick={() => loginWithGoogle()}
              className="group relative w-full bg-black border border-white/10 text-white py-4 px-8 rounded-none font-black text-xs shadow-2xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest cursor-pointer"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5 group-hover:invert"
              />
              Google Sign In
            </button>
          </div>

          <p className="mt-12 text-app-muted text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            Building Dynasties Online
          </p>
        </motion.div>
      </div>
    </div>
  );
};
