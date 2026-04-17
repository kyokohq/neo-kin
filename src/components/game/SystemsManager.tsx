import React, { useEffect } from 'react';
import { useGame } from '../../lib/GameContext';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FamilyMember, Needs } from '../../types/game';

export const SystemsManager: React.FC = () => {
  const { user, profile, socket } = useGame();

  // Tick Needs every 60 seconds
  useEffect(() => {
    if (!user) return;

    const tickNeeds = async () => {
      // Find all members for this user's family
      // Simplified: Find first family belonging to user
      const familiesRef = collection(db, 'families');
      const q = query(familiesRef, where('ownerId', '==', user.uid));
      const familySnaps = await getDocs(q);

      if (familySnaps.empty) return;
      const familyId = familySnaps.docs[0].id;

      const membersRef = collection(db, 'families', familyId, 'members');
      const memberSnaps = await getDocs(membersRef);

      for (const memberDoc of memberSnaps.docs) {
        const member = memberDoc.data() as FamilyMember;
        const currentNeeds = member.needs;

        const newNeeds: Needs = {
          nourishment: Math.max(0, currentNeeds.nourishment - 2),
          vitality: Math.max(0, currentNeeds.vitality - 1),
          sanitation: Math.max(0, currentNeeds.sanitation - 0.5),
          connection: Math.max(0, currentNeeds.connection - 1),
          enrichment: Math.max(0, currentNeeds.enrichment - 1.5),
        };

        // Mood calculation: Weighted average
        const mood = (
          newNeeds.nourishment * 0.3 +
          newNeeds.vitality * 0.2 +
          newNeeds.sanitation * 0.1 +
          newNeeds.connection * 0.2 +
          newNeeds.enrichment * 0.2
        );

        await updateDoc(memberDoc.ref, { 
          needs: newNeeds,
          mood: Math.round(mood)
        });
      }
    };

    const interval = setInterval(tickNeeds, 60000);
    return () => clearInterval(interval);
  }, [user]);

  return null; // Background component
};
