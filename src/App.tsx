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

function GameContent() {
  const { user, profile, loading } = useGame();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);

  // Local mock data if Firestore is empty for demo
  useEffect(() => {
    if (!user) return;

    // In a real app we'd fetch from Firestore
    // For this prototype, let's provide some starters
    setMembers([
      {
        id: '1',
        familyId: 'start',
        name: 'Alex',
        type: 'Human',
        age: 24,
        appearance: { hairStyle: 'short', hairColor: '#4B2C20', skinTone: '#FFDBAC', outfitId: '1' },
        traits: ['Kind', 'Creative'],
        mood: 100
      },
      {
        id: '2',
        familyId: 'start',
        name: 'Luna',
        type: 'Pet',
        age: 3,
        appearance: { hairStyle: 'none', hairColor: '#E5E7EB', skinTone: '#F3F4F6', outfitId: '1' },
        traits: ['Playful'],
        mood: 85
      }
    ]);

    setFurniture([
      { id: 'f1', itemId: 'sofa', x: 20, y: 40, rotation: 0 },
      { id: 'f2', itemId: 'tv', x: 60, y: 35, rotation: -5 },
      { id: 'f3', itemId: 'lamp', x: 15, y: 30, rotation: 0 },
    ]);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-12 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[#fdfaf6] pointer-events-none" />
      
      <HUD />
      
      <div className="w-full max-w-6xl z-10">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight">Willow Creek Home</h1>
            <p className="text-stone-500 font-medium">Kinworld • Online</p>
          </div>
        </header>

        <HomeView furniture={furniture} members={members} />
      </div>

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

