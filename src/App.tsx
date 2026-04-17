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

function GameContent() {
  const { user, loading } = useGame();
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
        appearance: { hairStyle: 'short', hairColor: '#4B2C20', skinTone: '#FFDBAC', outfitId: '1' },
        traits: ['Kind', 'Creative'],
        mood: 90
      },
      {
        id: '2',
        familyId: 'start',
        name: 'Luna',
        type: 'Pet',
        age: 3,
        appearance: { hairStyle: 'none', hairColor: '#E5E7EB', skinTone: '#F3F4F6', outfitId: '1' },
        traits: ['Playful'],
        mood: 75
      }
    ]);

    setFurniture([
      { id: 'f1', itemId: 'sofa', x: 20, y: 70, rotation: 0 },
      { id: 'f2', itemId: 'tv', x: 60, y: 65, rotation: -5 },
      { id: 'f3', itemId: 'lamp', x: 15, y: 60, rotation: 0 },
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
      <HUD />
      
      {/* Left Sidebar: Family */}
      <aside className="bg-app-panel border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto">
        <span className="section-tag">Family Circle</span>
        <div className="flex flex-col gap-4">
          {members.map(member => (
            <div key={member.id} className="panel-card flex gap-4 items-center">
              <div className="w-12 h-12 bg-zinc-800 border-2 border-app-accent overflow-hidden">
                {/* Scaled down sprite as avatar */}
                <div className="scale-50 origin-top mt-4">
                  <CharacterSprite appearance={member.appearance} type={member.type} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">{member.name}</h3>
                <div className="text-[10px] text-app-muted uppercase font-bold tracking-widest mt-0.5">
                  {member.type} / LV. {member.age}
                </div>
                <div className="w-full h-1 bg-black mt-2">
                  <motion.div 
                    className="h-full bg-app-accent" 
                    initial={{ width: 0 }}
                    animate={{ width: `${member.mood}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative bg-app-bg overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[12vw] font-black text-white/[0.03] uppercase select-none">Living Area</span>
        </div>
        
        <div className="w-full max-w-5xl px-12 z-10 flex flex-col h-full py-12">
          <div className="flex-1">
            <HomeView furniture={furniture} members={members} />
          </div>
        </div>
      </main>

      {/* Right Sidebar: Customization */}
      <aside className="bg-app-panel border-l border-white/10 p-6 overflow-y-auto">
        <span className="section-tag">Designer Mode</span>
        <nav className="flex flex-col gap-1">
          <button className="bold-btn active">Wardrobe</button>
          <button className="bold-btn">Interiors</button>
          <button className="bold-btn">Family</button>
          <button className="bold-btn">Storage</button>
        </nav>

        <div className="mt-12">
          <span className="section-tag">Quick Action</span>
          <p className="text-[11px] text-app-muted leading-relaxed font-bold uppercase tracking-wider">
            Press [Space] to enter Edit Mode. Items in your inventory will highlight.
          </p>
        </div>
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

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

