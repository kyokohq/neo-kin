/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './lib/GameContext';
import { LoginView } from './components/layout/LoginView';
import { HUD } from './components/layout/HUD';
import { HomeView } from './components/game/HomeView';
import { GachaSystem } from './components/game/GachaSystem';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FamilyMember, FurnitureItem } from './types/game';
import { Loader2 } from 'lucide-react';
import { CharacterSprite } from './components/game/CharacterSprite';
import { motion } from 'motion/react';
import { NeighborhoodHub } from './components/game/NeighborhoodHub';
import { SystemsManager } from './components/game/SystemsManager';
import { cn } from './lib/utils';

function GameContent() {
  const { user, profile, loading } = useGame();
  const [view, setView] = useState<'home' | 'neighborhood'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);

  useEffect(() => {
    if (!user) return;
    setMembers([
      {
        id: '1',
        familyId: 'start',
        name: 'Alex',
        type: 'Human',
        age: 24,
        appearance: { 
          skinTone: '#FFDBAC', 
          eyePreset: 'default',
          layeredApparel: { under: '#222', over: '#E5FF00', accessory: '#000', shoes: '#111' }
        },
        needs: { nourishment: 80, vitality: 90, sanitation: 100, connection: 70, enrichment: 65 },
        traits: ['Kind', 'Creative'],
        mood: 90
      }
    ]);

    setFurniture([
      { id: 'f1', itemId: 'sofa', x: 20, y: 70, rotation: 0 },
      { id: 'f2', itemId: 'tv', x: 60, y: 65, rotation: -5 },
    ]);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-app-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="h-screen w-screen grid grid-cols-[280px_1fr_280px] grid-rows-[120px_1fr_80px] overflow-hidden">
      <SystemsManager />
      <HUD />
      
      {/* Left Sidebar: Vitality & Disposition */}
      <aside className="bg-app-panel border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
        <span className="section-tag">Vitality & Disposition</span>
        <div className="flex flex-col gap-4">
          {members.map(member => (
            <div key={member.id} className="p-4 bg-black border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <span className="text-[32px] font-black uppercase text-white leading-none tracking-tighter">{member.name[0]}</span>
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">{member.name}</h3>
               <div className="space-y-3 relative z-10">
                 <StatItem label="Nourishment" value={member.needs.nourishment} />
                 <StatItem label="Vitality" value={member.needs.vitality} />
                 <StatItem label="Connection" value={member.needs.connection} />
                 <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black uppercase text-app-accent tracking-[0.2em]">Mood Monitor</span>
                      <span className="text-xl font-black text-white">{Math.round(member.mood)}%</span>
                    </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Arena */}
      <main className="relative bg-app-bg overflow-hidden flex flex-col">
        {/* Navigation Tab Style */}
        <div className="h-12 border-b border-white/10 flex items-center px-10 gap-8 z-50">
           <button 
             onClick={() => setView('home')}
             className={cn(
               "text-[9px] font-black uppercase tracking-widest h-full border-b-2 transition-all cursor-pointer",
               view === 'home' ? "border-app-accent text-white" : "border-transparent text-white/30 hover:text-white"
             )}
           >
             Habitat Instance
           </button>
           <button 
             onClick={() => setView('neighborhood')}
             className={cn(
               "text-[9px] font-black uppercase tracking-widest h-full border-b-2 transition-all cursor-pointer",
               view === 'neighborhood' ? "border-app-accent text-app-accent" : "border-transparent text-white/30 hover:text-white"
             )}
           >
             Main Street Hub
           </button>
        </div>

        <div className="flex-1 relative">
          {view === 'home' ? (
            <div className="w-full h-full p-12">
               <HomeView 
                 furniture={furniture} 
                 members={members} 
                 isEditing={isEditing}
                 onUpdateFurniture={(id, updates) => {
                   setFurniture(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
                 }}
               />
            </div>
          ) : (
            <NeighborhoodHub />
          )}
        </div>
      </main>

      {/* Right Sidebar: Designer Mode */}
      <aside className="bg-app-panel border-l border-white/10 p-6 overflow-y-auto">
        <span className="section-tag">Designer Mode</span>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "w-full py-5 font-black text-[10px] uppercase tracking-[0.3em] transition-all mb-8 cursor-pointer",
            isEditing ? "bg-app-accent text-black" : "bg-white/5 text-white hover:bg-white/10"
          )}
        >
          {isEditing ? "Save Configuration" : "Enter Habitat Edit"}
        </button>

        <nav className="flex flex-col gap-1">
          <button className="bold-btn active">Wardrobe</button>
          <button className="bold-btn">Interiors</button>
          <button className="bold-btn">Family</button>
          <button className="bold-btn">Storage</button>
        </nav>
      </aside>

      {/* Footer */}
      <footer className="col-span-3 bg-app-bg border-t border-white/10 px-10 flex items-center gap-10">
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] border-b-2 border-app-accent pb-1">Estate</div>
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity">World Map</div>
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Social Hub</div>
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Achievements</div>
        <div className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Settings</div>
      </footer>

      <GachaSystem />
    </div>
  );
}

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-end">
      <span className="text-[8px] font-black uppercase text-app-muted tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-white">{Math.round(value)}%</span>
    </div>
    <div className="h-0.5 bg-white/5 w-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={cn("h-full", value < 30 ? "bg-rose-500" : "bg-white/40")}
      />
    </div>
  </div>
);

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

