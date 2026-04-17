import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../lib/GameContext';
import { CharacterSprite } from './CharacterSprite';
import { Appearance } from '../../types/game';
import { Users, MessageSquare, Heart } from 'lucide-react';

interface Neighbor {
  id: string;
  uid: string;
  name: string;
  position: { x: number; y: number };
  appearance: Appearance;
}

export const NeighborhoodHub: React.FC = () => {
  const { socket, profile } = useGame();
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [messages, setMessages] = useState<{ id: string; text: string; name: string }[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('neighbor_list', (list: Neighbor[]) => {
      setNeighbors(list.filter(n => n.uid !== profile?.uid));
    });

    socket.on('neighbor_moved', ({ id, position }: { id: string, position: { x: number, y: number } }) => {
      setNeighbors(prev => prev.map(n => n.id === id ? { ...n, position } : n));
    });

    socket.on('neighbor_joined', (neighbor: Neighbor) => {
      setNeighbors(prev => [...prev.filter(n => n.uid !== neighbor.uid), neighbor]);
    });

    socket.on('chat_message', (msg) => {
      setMessages(prev => [...prev.slice(-10), msg]);
    });

    return () => {
      socket.off('neighbor_list');
      socket.off('neighbor_moved');
      socket.off('neighbor_joined');
      socket.off('chat_message');
    };
  }, [socket, profile]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !socket) return;
    
    const msg = { 
      id: Math.random().toString(36), 
      text: currentMessage, 
      name: profile?.displayName || 'Anonymous' 
    };
    socket.emit('send_message', msg);
    setMessages(prev => [...prev.slice(-10), msg]);
    setCurrentMessage('');
  };

  return (
    <div className="relative w-full h-full bg-app-bg overflow-hidden border border-white/10">
      {/* Ghost Text Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="text-[20vw] font-black uppercase tracking-tighter">MAIN STREET</span>
      </div>

      {/* Neighborhood Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/5" />
        ))}
      </div>

      {/* Your Character (Local) */}
      <div className="absolute inset-0 flex items-center justify-center">
         {/* Placeholder for local movement logic */}
         <div className="relative group">
           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-app-accent text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
             YOU: {profile?.displayName}
           </div>
           <CharacterSprite 
             appearance={{
               skinTone: '#FFDBAC',
               eyePreset: 'default',
               layeredApparel: {
                 under: '#333',
                 over: '#E5FF00',
                 accessory: '#000',
                 shoes: '#111'
               }
             }} 
             type="Human" 
           />
         </div>
      </div>

      {/* Other Neighbors */}
      {neighbors.map(neighbor => (
        <motion.div
          key={neighbor.id}
          initial={{ opacity: 0 }}
          animate={{ x: neighbor.position?.x || 0, y: neighbor.position?.y || 0, opacity: 1 }}
          className="absolute"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
            {neighbor.name}
          </div>
          <CharacterSprite 
            appearance={neighbor.appearance || {
              skinTone: '#E0AC69',
              eyePreset: 'default',
              layeredApparel: { under: '#555', over: '#fff', accessory: '#333', shoes: '#000' }
            }} 
            type="Human" 
            scale={0.8}
          />
        </motion.div>
      ))}

      {/* Chat HUD */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-4 pointer-events-none">
        <div className="w-[300px] h-48 bg-app-panel/90 backdrop-blur-md border border-white/10 p-4 flex flex-col pointer-events-auto">
          <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
            <Users size={14} className="text-app-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest">Main Street Chat</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 scrollbar-hide">
            {messages.map(m => (
              <div key={m.id} className="text-[11px]">
                <span className="text-app-accent font-black mr-2 uppercase">{m.name}:</span>
                <span className="text-white/80">{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input 
              value={currentMessage}
              onChange={e => setCurrentMessage(e.target.value)}
              placeholder="SAY SOMETHING..."
              className="flex-1 bg-black border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-app-accent outline-none"
            />
            <button type="submit" className="bg-app-accent text-black px-3 py-2">
              <MessageSquare size={14} />
            </button>
          </form>
        </div>

        <div className="flex-1"></div>

        <div className="w-64 bg-app-panel/90 backdrop-blur-md border border-white/10 p-4 pointer-events-auto">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={14} className="text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Neighborhood Stats</span>
          </div>
          <div className="space-y-3">
             <div className="flex justify-between text-[10px] font-bold uppercase border-b border-white/5 pb-1">
                <span className="text-app-muted">Population</span>
                <span className="text-white">{neighbors.length + 1}</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold uppercase border-b border-white/5 pb-1">
                <span className="text-app-muted">Cul-de-sacs</span>
                <span className="text-white">Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
