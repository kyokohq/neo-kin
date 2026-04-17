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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-lg hover:bg-indigo-700 transition-colors"
        >
          <Gift size={24} />
          Surprise Box (KC 100)
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              layoutId="gacha-box"
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
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
                      className="w-48 h-48 mx-auto bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-8"
                    >
                      <Package size={80} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Surprise Delivery</h3>
                    <p className="text-slate-500 mb-8 px-8">What will be inside the box today? Furniture, items, or maybe a new friend?</p>

                    <button
                      onClick={performPull}
                      disabled={isPulling || (profile?.currency || 0) < 100}
                      className={cn(
                        "w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition-all",
                        isPulling ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700"
                      )}
                    >
                      {isPulling ? "Opening..." : "Open for KC 100"}
                    </button>
                    {(profile?.currency || 0) < 100 && (
                      <p className="mt-4 text-sm text-rose-500 font-medium">Not enough Kin-Coins!</p>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={cn("w-48 h-48 rounded-full flex items-center justify-center text-white mb-6 shadow-2xl", result.color)}>
                      <Sparkles size={64} className="absolute rotate-12" />
                      <Package size={80} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">{result.rarity}</span>
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">{result.name}</h2>
                    <p className="text-slate-500 mb-8">This {result.type.toLowerCase()} has been added to your collection!</p>
                    
                    <button
                      onClick={() => setResult(null)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                    >
                      Awesome!
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
