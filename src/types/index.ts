export type CardThemeId = 'goa-sunset' | 'tropical-beach' | 'festive-fiesta' | 'golden-sand';

export type RarityRank = 'Legendary' | 'Cyberpunk' | 'Epic' | 'Rare' | 'Genesis';

export interface Teammate {
  id: string;
  name: string;
  handle: string;
  roleClass: string;
  avatarUrl: string;
  stackTag?: string;
}

export interface HackerPass {
  id: string;
  name: string;
  handle: string;
  roleClass: string;
  rarity: RarityRank;
  avatarUrl: string;
  stack: string[];
  bio: string;
  teamName: string;
  teammates: Teammate[];
  cardTheme: CardThemeId;
  qrCodeData: string;
  verified: boolean;
  stats: {
    speed: number;
    power: number;
    code: number;
  };
  customFilter?: {
    brightness: number;
    contrast: number;
    hueRotate: number;
  };
}

export interface PresetSample {
  id: string;
  pass: HackerPass;
  title: string;
  description: string;
}
