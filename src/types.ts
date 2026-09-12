export interface MinecraftServer {
  id: string;
  name: string;
  url: string;
  category: 'Popular' | 'Survival' | 'Minigames' | 'PvP' | 'Vanilla';
  playersEstimate: string;
  description: string;
  featured?: boolean;
  version: string;
  ping?: number;
  status: 'online' | 'checking' | 'offline' | 'unknown';
}

export interface ClientMirror {
  id: string;
  name: string;
  version: string;
  description: string;
  badge: string;
  url: string;
}

export interface TabCloakPreset {
  id: string;
  name: string;
  title: string;
  icon: string;
  description: string;
  badge?: string;
  isCollege?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  rank: 'player' | 'original' | 'vip' | 'sidekick' | 'nolife';
  createdAt: string;
  lastLogin: string;
}
