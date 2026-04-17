import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FurnitureItem, FamilyMember } from '../../types/game';
import { CharacterSprite } from './CharacterSprite';
import { Sofa, Lamp, TreePine, Tv, Bed, Coffee } from 'lucide-react';
import { cn } from '../../lib/utils';

const FURNITURE_ICONS: Record<string, any> = {
  sofa: Sofa,
  lamp: Lamp,
  plant: TreePine,
  tv: Tv,
  bed: Bed,
  coffee: Coffee,
};

interface HomeViewProps {
  furniture: FurnitureItem[];
  members: FamilyMember[];
  isEditing?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ furniture, members, isEditing }) => {
  return (
    <div className="relative w-full h-[600px] bg-stone-50 border-8 border-stone-200 rounded-3xl overflow-hidden shadow-inner">
      {/* Floor Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Furniture Layer */}
      <div className="absolute inset-0">
        {furniture.map((item) => {
          const Icon = FURNITURE_ICONS[item.itemId] || Sofa;
          return (
            <motion.div
              key={item.id}
              className={cn(
                "absolute p-4 rounded-xl flex items-center justify-center bg-white border-2 border-stone-200 shadow-sm cursor-pointer",
                isEditing && "hover:border-indigo-400 hover:shadow-indigo-100"
              )}
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`,
                rotate: `${item.rotation}deg`
              }}
              whileHover={isEditing ? { scale: 1.05 } : {}}
            >
              <Icon size={48} className="text-stone-600" />
            </motion.div>
          );
        })}
      </div>

      {/* Characters Layer */}
      <div className="absolute inset-0">
        {members.map((member) => (
          <motion.div
            key={member.id}
            className="absolute cursor-pointer"
            initial={{ left: '50%', top: '50%' }}
            animate={{ 
              left: `${20 + Math.random() * 60}%`, 
              top: `${20 + Math.random() * 60}%` 
            }}
            transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
          >
            <div className="relative group">
              <CharacterSprite 
                appearance={member.appearance} 
                type={member.type} 
                scale={0.8} 
              />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-stone-100 text-sm font-medium">
                {member.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Interface Fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};
