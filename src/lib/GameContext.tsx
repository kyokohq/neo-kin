import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, Family, Home } from '../types/game';

import io from 'socket.io-client';

type Socket = ReturnType<typeof io>;

interface GameContextType {
  user: User | null;
  profile: UserProfile | null;
  family: Family | null;
  home: Home | null;
  socket: Socket | null;
  loading: boolean;
  isAuthReady: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [home, setHome] = useState<Home | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Initialize socket
    const s = io();
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAuthReady(true);
      
      if (u) {
        if (socket) {
          socket.emit('join_neighborhood', { 
            uid: u.uid, 
            name: u.displayName 
          });
        }
        // Find or create profile
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newProfile: UserProfile = {
            uid: u.uid,
            displayName: u.displayName || 'Kin-Friend',
            email: u.email || '',
            photoURL: u.photoURL || '',
            currency: 500,
            xp: 0,
            level: 1,
            role: 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, newProfile);
        }

        // Listen to profile
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) setProfile(snap.data() as UserProfile);
        }, (err) => console.error(err));

        // Listen to families (simplified: first family found)
        // In a real app we'd query by ownerId
        // For now, let's assume one family per user
        // We'll create it if it doesn't exist in the setup flow
      } else {
        setProfile(null);
        setFamily(null);
        setHome(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <GameContext.Provider value={{ user, profile, family, home, socket, loading, isAuthReady }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
