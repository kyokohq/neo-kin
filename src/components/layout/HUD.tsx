import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../lib/GameContext';
import { formatCurrency } from '../../lib/utils';
import { Coins, Star, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { logout } from '../../lib/firebase';

export const HUD: React.FC = () => {
  const { profile } = useGame();

  if (!profile) return null;

  return (
    <div className="fixed top-0 inset-x-0 p-6 flex justify-between items-start pointer-events-none z-50">
      {/* Profile & Level */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 pr-6 rounded-full shadow-lg border border-white/20"
      >
        <div className="relative">
          <img 
            src={profile.photoURL} 
            alt={profile.displayName} 
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full border-2 border-indigo-500"
          />
          <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {profile.level}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-slate-800 leading-tight">{profile.displayName}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500" 
                initial={{ width: 0 }}
                animate={{ width: `${(profile.xp % 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP</span>
          </div>
        </div>
      </motion.div>

      {/* Currency & Settings */}
      <div className="flex flex-col items-end gap-3">
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="pointer-events-auto flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border border-white/20"
        >
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Coins size={18} />
            <span>{formatCurrency(profile.currency)}</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <button 
            onClick={() => logout()}
            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
          </button>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 border border-white/20"
        >
          <Settings size={20} />
        </motion.button>
      </div>
    </div>
  );
};
