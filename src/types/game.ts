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
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  outfitId: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  type: MemberType;
  age: number;
  appearance: Appearance;
  traits: string[];
  mood: number;
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
