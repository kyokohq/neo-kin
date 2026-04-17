import React from 'react';
import { motion } from 'motion/react';
import { loginWithGoogle } from '../../lib/firebase';
import { Sparkles, Heart } from 'lucide-react';

export const LoginView: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Ghost Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[25vw] font-black leading-none text-white/[0.02] uppercase -rotate-12 translate-x-[-10vw]">Kinship</span>
        <span className="text-[25vw] font-black leading-none text-app-accent/[0.02] uppercase -rotate-12 translate-x-[10vw]">Kinship</span>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <h1 className="text-[120px] font-black text-app-accent leading-[0.8] tracking-[-0.08em] uppercase">Kinship</h1>
            <div className="text-[14px] font-black tracking-[0.4em] text-white uppercase mt-4">Legacy Simulator</div>
          </div>

          <button
            onClick={() => loginWithGoogle()}
            className="group relative w-full bg-white text-black py-6 px-8 rounded-none font-black text-xl shadow-2xl hover:bg-app-accent transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-widest cursor-pointer"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6 invert"
            />
            Sign In
          </button>

          <p className="mt-12 text-app-muted text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            Building Dynasties Online
          </p>
        </motion.div>
      </div>
    </div>
  );
};
