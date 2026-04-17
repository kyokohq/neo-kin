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
  const { skinTone, hairColor, hairStyle } = appearance;

  return (
    <motion.div
      layout
      className={cn("relative flex flex-col items-center", className)}
      style={{ scale }}
      animate={{
        y: isDragging ? -20 : [0, -4, 0],
      }}
      transition={{
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Body */}
      <div 
        className="w-16 h-20 rounded-t-full relative z-10"
        style={{ backgroundColor: '#4F46E5' }} // Default outfit
      >
        {/* Arms could go here */}
      </div>

      {/* Head */}
      <div 
        className="w-14 h-14 rounded-full absolute -top-10 z-20 shadow-sm border-2 border-black/5"
        style={{ backgroundColor: skinTone || '#FFDBAC' }}
      >
        {/* Face */}
        <div className="absolute top-6 left-3 w-2 h-2 bg-slate-800 rounded-full" />
        <div className="absolute top-6 right-3 w-2 h-2 bg-slate-800 rounded-full" />
        <div className="absolute top-9 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
        
        {/* Hair */}
        <div 
          className={cn(
            "absolute -top-1 -left-1 -right-1 h-8 rounded-t-full z-30",
            hairStyle === 'long' ? "h-16" : "h-6"
          )}
          style={{ backgroundColor: hairColor || '#4B2C20' }}
        />
      </div>

      {/* Type Badge */}
      {type !== 'Human' && (
        <div className="absolute -bottom-2 bg-amber-100 text-[10px] px-1.5 py-0.5 rounded-full border border-amber-300 font-bold uppercase tracking-wider text-amber-800">
          {type}
        </div>
      )}
    </motion.div>
  );
};
