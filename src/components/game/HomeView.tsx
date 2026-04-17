import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FurnitureItem, FamilyMember, InteractiveFurniture } from '../../types/game';
import { CharacterSprite } from './CharacterSprite';
import { Sofa, Lamp, TreePine, Tv, Bed, Coffee, RotateCcw } from 'lucide-react';
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
  onUpdateFurniture?: (id: string, updates: Partial<FurnitureItem>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ furniture, members, isEditing, onUpdateFurniture }) => {
  // Depth Sorting: Combine objects and members, sort by Y position
  const depthSortedElements = useMemo(() => {
    const furnitureElements = furniture.map(f => ({ ...f, type: 'furniture' as const }));
    const memberElements = members.map(m => ({ ...m, type: 'member' as const }));
    
    // For sorting, we'll estimate the Y position
    // Since we're using %, we can use item.y
    return [...furnitureElements, ...memberElements].sort((a, b) => {
      const aY = 'y' in a ? a.y : 50; // default 50 if missing (animation handled differently)
      const bY = 'y' in b ? b.y : 50;
      return aY - bY;
    });
  }, [furniture, members]);

  return (
    <div className="relative w-full h-full bg-app-bg border border-white/10 rounded-none overflow-hidden group">
      {/* Floor Grid (Designer Suite Layer) */}
      <div className={cn(
        "absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity",
        isEditing ? "opacity-[0.15]" : "opacity-[0.05]"
      )} 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Decorative Ghost Text */}
      <div className="absolute inset-x-0 top-12 flex justify-center pointer-events-none select-none">
        <span className="text-[12vw] font-black uppercase text-white/[0.02] tracking-tighter">HABITAT:01</span>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {furniture.map((item) => {
            const Icon = FURNITURE_ICONS[item.itemId] || Sofa;
            return (
              <motion.div
                key={item.id}
                layout
                className={cn(
                  "absolute flex items-center justify-center bg-app-panel border border-white/5 shadow-2xl p-6",
                  isEditing && "cursor-move border-app-accent hover:border-white ring-1 ring-app-accent/20"
                )}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  rotate: `${item.rotation}deg`,
                  zIndex: Math.floor(item.y)
                }}
                drag={isEditing}
                dragSnapToGrid={true}
                onDragEnd={(_, info) => {
                   if (!isEditing) return;
                   // Calculate % based on grid snap
                   const snap = 5; // 5% snap roughly matches 40px on many screens
                   const newX = Math.round((item.x + info.offset.x / 10) / snap) * snap;
                   const newY = Math.round((item.y + info.offset.y / 10) / snap) * snap;
                   onUpdateFurniture?.(item.id, { 
                     x: Math.max(0, Math.min(90, newX)), 
                     y: Math.max(0, Math.min(90, newY)) 
                   });
                }}
                whileHover={isEditing ? { scale: 1.1 } : {}}
              >
                <Icon size={48} className="text-white/40" />
                
                {isEditing && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateFurniture?.(item.id, { rotation: (item.rotation + 90) % 360 });
                    }}
                    className="absolute -top-3 -right-3 bg-app-accent text-black p-1 active:scale-90 transition-transform"
                  >
                    <RotateCcw size={12} />
                  </button>
                )}
              </motion.div>
            );
          })}

          {members.map((member) => (
            <motion.div
              key={member.id}
              className="absolute z-40 transition-all duration-[8000ms] ease-in-out"
              animate={{ 
                left: `${20 + Math.random() * 60}%`, 
                top: `${20 + Math.random() * 60}%`,
              }}
              style={{ zIndex: 100 }} // We'll simplify zIndex for simulation
            >
              <div className="relative group/member">
                {/* Needs Monitor (Bold Typo Style) */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover/member:opacity-100 transition-all space-y-1 w-32 pointer-events-none z-50">
                  <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-2">
                     <div className="text-[8px] font-black text-app-accent uppercase tracking-widest mb-1">{member.name}</div>
                     <div className="space-y-0.5">
                        <NeedBar label="NRSH" value={member.needs.nourishment} />
                        <NeedBar label="VITL" value={member.needs.vitality} />
                        <NeedBar label="SANI" value={member.needs.sanitation} />
                     </div>
                  </div>
                </div>

                <CharacterSprite 
                  appearance={member.appearance} 
                  type={member.type} 
                  scale={0.9} 
                  className={cn(member.mood < 30 && "opacity-60 brightness-75")}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Editing Feedback HUD */}
      {isEditing && (
        <div className="absolute top-6 left-6 bg-app-accent text-black px-4 py-2 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 bg-black animate-pulse" />
          Edit Mode Active: 40px Grid Snapping
        </div>
      )}
    </div>
  );
};

const NeedBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-[7px] font-black text-white/50 w-6">{label}</span>
    <div className="flex-1 h-0.5 bg-white/10">
      <div 
        className={cn(
          "h-full transition-all duration-1000",
          value < 30 ? "bg-rose-500" : "bg-app-accent"
        )} 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);

