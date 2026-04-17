import React from 'react';
import { motion } from 'motion/react';
import { loginWithGoogle } from '../../lib/firebase';
import { Sparkles, Heart } from 'lucide-react';

export const LoginView: React.FC = () => {
  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-200/50 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-[30px] shadow-2xl shadow-indigo-200 mx-auto flex items-center justify-center mb-8 rotate-3 hover:rotate-6 transition-transform">
            <Sparkles className="text-white" size={48} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Kinworld</h1>
          <p className="text-slate-500 text-lg mb-12">Building families, designing homes, and growing together in a world of surprises.</p>

          <button
            onClick={() => loginWithGoogle()}
            className="group relative w-full bg-white text-slate-800 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-100 flex items-center justify-center gap-3 active:translate-y-0"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6"
            />
            Continue with Google
          </button>

          <p className="mt-8 text-slate-400 text-sm flex items-center justify-center gap-1.5 font-medium">
            Made with <Heart size={14} className="text-indigo-400 fill-current" /> for Kin-Friends
          </p>
        </motion.div>
      </div>
    </div>
  );
};
