import React from 'react';
import { motion } from 'motion/react';
import { Appearance, MemberType } from '../../types/game';
import { cn } from '../../lib/utils';

interface SpriteProps {
  appearance: Appearance;
  type: MemberType;
  scale?: number;
  className?: string;
  isDragging?: boolean;
}

export const CharacterSprite: React.FC<SpriteProps> = ({ appearance, type, scale = 1, className, isDragging }) => {
  const { skinTone, eyePreset, layeredApparel } = appearance;
  const { under, over, accessory, shoes } = layeredApparel || {};

  return (
    <motion.div
      layout
      className={cn("relative flex flex-col items-center", className)}
      style={{ scale }}
      animate={{
        y: isDragging ? -20 : [0, -4, 0],
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: "linear" }
      }}
    >
      <div className="relative w-24 h-48">
        {/* Layer 0: Shoes */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 z-[1]"
          style={{ backgroundColor: shoes || 'transparent' }}
        >
          {shoes && <div className="absolute inset-0 border-t-2 border-black/10" />}
        </div>

        {/* Layer 1: Body (Base) */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-24 rounded-full z-[2] shadow-inner"
          style={{ backgroundColor: skinTone || '#FFDBAC' }}
        >
          {/* Layer 2: Under Apparel (Shirt/Pants) */}
          <div 
            className="absolute inset-0 rounded-full opacity-90 transition-all"
            style={{ backgroundColor: under || 'transparent' }}
          />
          
          {/* Layer 3: Over Apparel (Jacket/Vest) */}
          <div 
            className="absolute -inset-1 rounded-full border-2 border-white/5 opacity-80"
            style={{ backgroundColor: over || 'transparent' }}
          />
        </div>

        {/* Layer 4: Head */}
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-20 rounded-[40px] z-[10] border-4 border-black/5"
          style={{ backgroundColor: skinTone || '#FFDBAC' }}
        >
          {/* Eyes */}
          <div className="absolute top-8 left-4 right-4 flex justify-between px-1">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/10">
               <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/10">
               <div className="w-2 h-2 bg-black rounded-full" />
            </div>
          </div>
          
          {/* Mouth */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full" />

          {/* Accessory (Hair/Hats) */}
          <div 
            className="absolute -top-4 -left-2 -right-2 h-12 rounded-t-[40px] opacity-90 z-[11]"
            style={{ backgroundColor: accessory || 'transparent' }}
          />
        </div>

        {/* Aura Particles for Sanitation Needs (Neon Themed) */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-4 border-2 border-app-accent/20 rounded-full pointer-events-none blur-xl"
        />
      </div>

      {/* Type Badge */}
      <div className="mt-2 bg-app-panel px-3 py-1 border border-white/10">
        <span className="text-[10px] font-black uppercase tracking-widest text-app-accent">{type}</span>
      </div>
    </motion.div>
  );
};
