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
    <header className="fixed top-0 inset-x-0 h-[120px] px-10 flex items-center justify-between border-b border-white/10 bg-app-bg z-50 pointer-events-auto">
      <div className="flex items-baseline gap-2">
        <h1 className="text-[84px] font-black tracking-[-0.05em] text-app-accent leading-[0.8]">Kinship</h1>
      </div>

      <div className="flex gap-10">
        <div className="text-right">
          <div className="text-[10px] uppercase font-black tracking-widest text-app-muted">Legacy Funds</div>
          <div className="text-3xl font-black text-white">{formatCurrency(profile.currency)}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-black tracking-widest text-app-muted">Generation</div>
          <div className="text-3xl font-black text-white">{String(profile.level).padStart(2, '0')}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-black tracking-widest text-app-muted">Exp Points</div>
          <div className="text-3xl font-black text-white">{profile.xp}</div>
        </div>
      </div>
    </header>
  );
};
