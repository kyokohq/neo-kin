import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Sparkles, X, Gift } from 'lucide-react';
import { useGame } from '../../lib/GameContext';
import { db } from '../../lib/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../../lib/utils';

export const GachaSystem: React.FC = () => {
  const { profile, user } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [result, setResult] = useState<any>(null);

  const performPull = async () => {
    if (!profile || !user || profile.currency < 100) return;

    setIsPulling(true);
    setResult(null);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 2000));

    // Random result
    const items = [
      { id: 'sofa', name: 'Velvet Sofa', type: 'Furniture', rarity: 'Rare', color: 'bg-indigo-500' },
      { id: 'tv', name: 'Wide Screen TV', type: 'Furniture', rarity: 'Epic', color: 'bg-purple-500' },
      { id: 'lamp', name: 'Mood Lamp', type: 'Furniture', rarity: 'Common', color: 'bg-amber-500' },
      { id: 'plant', name: 'Lucky Bamboo', type: 'Furniture', rarity: 'Common', color: 'bg-green-500' },
    ];
    const win = items[Math.floor(Math.random() * items.length)];

    try {
      // Deduct currency
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        currency: profile.currency - 100
      });

      // Add to inventory
      const invRef = collection(db, 'users', user.uid, 'inventory');
      await addDoc(invRef, {
        ownerId: user.uid,
        itemId: win.id,
        category: 'Furniture',
        acquiredAt: new Date().toISOString()
      });

      setResult(win);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-[280px] h-[80px] z-[60] flex items-center justify-center bg-app-panel border-t border-r border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-full h-full bg-app-accent text-black flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
        >
          <Gift size={20} />
          Surprise Box
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              layoutId="gacha-box"
              className="bg-app-panel w-full max-w-md border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-app-muted hover:text-white transition-colors"
                disabled={isPulling}
              >
                <X size={24} />
              </button>

              <div className="p-12 text-center">
                {!result ? (
                  <>
                    <motion.div
                      animate={isPulling ? { 
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.5, repeat: isPulling ? Infinity : 0 }}
                      className="w-48 h-48 mx-auto bg-zinc-800 flex items-center justify-center text-app-accent mb-8 border border-white/10"
                    >
                      <Package size={80} />
                    </motion.div>
                    
                    <h3 className="text-4xl font-black uppercase mb-2 tracking-tighter">Surprise Box</h3>
                    <p className="text-app-muted text-sm uppercase font-bold tracking-widest mb-8 px-8 leading-relaxed">Cost: 100 Kin-Coins</p>

                    <button
                      onClick={performPull}
                      disabled={isPulling || (profile?.currency || 0) < 100}
                      className={cn(
                        "w-full py-5 font-black text-xl uppercase tracking-widest transition-all cursor-pointer",
                        isPulling ? "bg-zinc-800 text-zinc-600" : "bg-app-accent text-black hover:brightness-110"
                      )}
                    >
                      {isPulling ? "Opening..." : "Purchase"}
                    </button>
                    {(profile?.currency || 0) < 100 && (
                      <p className="mt-4 text-xs text-rose-500 font-black uppercase tracking-widest">Insufficient Funds</p>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={cn("w-48 h-48 flex items-center justify-center text-white mb-6 border border-white/10 shadow-2xl overflow-hidden relative", result.color)}>
                      <Sparkles size={64} className="absolute rotate-12 opacity-20" />
                      <div className="z-10 bg-black/40 p-4 font-black text-6xl">{result.name[0]}</div>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-app-accent mb-1">{result.rarity}</span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{result.name}</h2>
                    <p className="text-app-muted text-xs uppercase font-bold tracking-widest mb-8">Asset Added to Inventory</p>
                    
                    <button
                      onClick={() => setResult(null)}
                      className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-app-accent transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
