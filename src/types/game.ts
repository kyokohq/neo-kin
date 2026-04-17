export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  currency: number;
  xp: number;
  level: number;
  role: 'user' | 'admin';
  createdAt: string;
}

export type MemberType = 'Human' | 'Pet' | 'Spirit';

export interface Appearance {
  skinTone: string;
  eyePreset: string;
  layeredApparel: {
    under: string;
    over: string;
    accessory: string;
    shoes: string;
  };
}

export interface Needs {
  nourishment: number;
  vitality: number;
  sanitation: number;
  connection: number;
  enrichment: number;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  type: MemberType;
  age: number;
  appearance: Appearance;
  needs: Needs;
  traits: string[];
  mood: number;
}

export interface InteractiveFurniture extends FurnitureItem {
  userSlots: number;
  interactionType: 'nourish' | 'rest' | 'clean' | 'socialize' | 'enrich' | 'none';
}

export interface CulDeSac {
  id: string;
  name: string;
  members: string[]; // User UIDs
  projectProgress: number;
  motto: string;
}

export interface Family {
  id: string;
  ownerId: string;
  name: string;
  surname: string;
  homeId: string;
  motto: string;
}

export interface FurnitureItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  rotation: number;
}

export interface Home {
  id: string;
  ownerId: string;
  furniture: FurnitureItem[];
  wallpaper: string;
  flooring: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Furniture' | 'Clothing' | 'Gacha';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  imageUrl: string;
}
