import { MinecraftServer, ClientMirror } from '../types';

export const DEFAULT_SERVERS: MinecraftServer[] = [
  {
    id: 'archmc',
    name: 'ArchMC Network',
    url: 'wss://mc.arch.lol',
    category: 'Popular',
    playersEstimate: '1,200+ Players',
    description: 'The #1 most popular Eaglercraft network. Features Bedwars, Skywars, Practice Duels, Survival, and Arcade.',
    featured: true,
    version: '1.8.8 / 1.12.2',
    status: 'online',
    ping: 307
  },
  {
    id: 'archmc-backup',
    name: 'ArchMC (Direct Gateway)',
    url: 'wss://arch.mc',
    category: 'Popular',
    playersEstimate: 'High Speed',
    description: 'Direct alternate routing address for ArchMC with low latency connection.',
    featured: false,
    version: '1.8.8',
    status: 'online',
    ping: 300
  },
  {
    id: 'mercurymc',
    name: 'MercuryMC',
    url: 'wss://mercurymc.net',
    category: 'Survival',
    playersEstimate: '350+ Players',
    description: 'Top-tier Survival SMP, custom economy, Factions, dungeons, and community events.',
    featured: true,
    version: '1.8.8',
    status: 'online',
    ping: 191
  },
  {
    id: 'voidsent',
    name: 'Voidsent MC',
    url: 'wss://mc.voidsent.net',
    category: 'PvP',
    playersEstimate: '400+ Players',
    description: 'Hardcore Factions, MMORPG dungeons, custom enchants, and competitive PvP.',
    featured: true,
    version: '1.8.8',
    status: 'online',
    ping: 294
  },
  {
    id: 'pixelcraft',
    name: 'PixelCraft SMP',
    url: 'wss://pcsmp.net',
    category: 'Survival',
    playersEstimate: '200+ Players',
    description: 'Lifesteal SMP, GenPvP, Bedwars, custom economy, and creative plots.',
    featured: false,
    version: '1.8.8',
    status: 'online',
    ping: 262
  },
  {
    id: 'vanillamc',
    name: 'VanillaMC',
    url: 'wss://vanillamc.org',
    category: 'Vanilla',
    playersEstimate: '180+ Players',
    description: 'Pure unaltered Minecraft survival multiplayer experience just like authentic Java edition.',
    featured: false,
    version: '1.8.8',
    status: 'online',
    ping: 467
  },
  {
    id: 'zentic',
    name: 'Zentic Network',
    url: 'wss://zentic.cc',
    category: 'Minigames',
    playersEstimate: '250+ Players',
    description: 'Minigames heaven: Duels, Bedwars, Skywars, KitPvP, and Parkour.',
    featured: false,
    version: '1.8.8',
    status: 'online',
    ping: 443
  },
  {
    id: 'clever-teaching',
    name: 'Clever Teaching SMP',
    url: 'wss://clever-teaching.com',
    category: 'Minigames',
    playersEstimate: '300+ Players',
    description: 'School-friendly unblocked server with Skyblock, Anarchy, Prison, and SMP.',
    featured: false,
    version: '1.8.8',
    status: 'online',
    ping: 626
  }
];

export const CLIENT_MIRRORS: ClientMirror[] = [
  {
    id: 'builtin-1.8.8',
    name: 'EaglercraftX 1.8.8 (Built-in Server)',
    version: '1.8.8 Built-in',
    description: 'Hosted directly on this domain. Ultra-fast loading, zero external blocking, singleplayer & multiplayer enabled.',
    badge: '100% Reliable',
    url: '/game.html'
  },
  {
    id: 'github-1.8.8',
    name: 'EaglercraftX 1.8.8 (GitHub Pages Mirror)',
    version: '1.8.8 GitHub',
    description: 'Official community mirror hosted on GitHub Pages.',
    badge: 'Official Mirror',
    url: 'https://eaglercraft1-8.github.io/'
  },
  {
    id: 'wasm-1.8.8',
    name: 'EaglercraftX 1.8.8 (WASM High FPS)',
    version: '1.8.8 WASM',
    description: 'WebAssembly engine with retina resolution.',
    badge: 'Alternative',
    url: 'https://eaglercraft.q13x.com/1.8.8/wasm/?retina=true'
  },
  {
    id: 'wasm-1.12.2',
    name: 'Eaglercraft 1.12.2 (World of Color)',
    version: '1.12.2 WASM',
    description: 'Minecraft 1.12.2 with color update and recipe book.',
    badge: '1.12.2 Version',
    url: 'https://eaglercraft.q13x.com/1.12.2/wasm/?retina=true'
  }
];
