import type { RarityRank } from '../types';

export interface ClassDefinition {
  title: string;
  rarity: RarityRank;
  description: string;
  iconName: string;
  defaultStats: { speed: number; power: number; code: number };
}

const BUILDER_CLASSES: ClassDefinition[] = [
  {
    title: 'Solana Alchemist',
    rarity: 'Legendary',
    description: 'Master of high-speed parallel transactions and Anchor framework wizardry.',
    iconName: 'Zap',
    defaultStats: { speed: 99, power: 92, code: 95 }
  },
  {
    title: 'AI Agent Mastermind',
    rarity: 'Legendary',
    description: 'Orchestrates multi-agent LLM swarms that write, deploy, and fix code autonomously.',
    iconName: 'Cpu',
    defaultStats: { speed: 94, power: 98, code: 96 }
  },
  {
    title: 'Rust Kernel Warlord',
    rarity: 'Cyberpunk',
    description: 'Refuses memory leaks, crafts zero-cost abstractions with laser precision.',
    iconName: 'ShieldAlert',
    defaultStats: { speed: 88, power: 99, code: 97 }
  },
  {
    title: 'Zero-Knowledge Phantom',
    rarity: 'Legendary',
    description: 'Proves truth without exposing state. Cryptographic magic woven into circuit code.',
    iconName: 'EyeOff',
    defaultStats: { speed: 91, power: 96, code: 99 }
  },
  {
    title: 'DeFi Liquidity Shaman',
    rarity: 'Epic',
    description: 'Channels concentrated liquidity curves and automated market maker arbitrage.',
    iconName: 'TrendingUp',
    defaultStats: { speed: 90, power: 89, code: 93 }
  },
  {
    title: 'Fullstack Goa Nomad',
    rarity: 'Epic',
    description: 'Ships full production suites from beach shacks while sipping coconut water.',
    iconName: 'Palmtree',
    defaultStats: { speed: 96, power: 85, code: 91 }
  },
  {
    title: 'Cyberpunk UI Vanguard',
    rarity: 'Cyberpunk',
    description: 'Transforms 2D interfaces into mind-bending WebGL 3D holographic experiences.',
    iconName: 'Sparkles',
    defaultStats: { speed: 92, power: 90, code: 98 }
  },
  {
    title: 'Cross-Chain Teleporter',
    rarity: 'Rare',
    description: 'Relays messages across EVM and SVM networks seamlessly with atomic guarantees.',
    iconName: 'Globe',
    defaultStats: { speed: 89, power: 87, code: 90 }
  }
];

export function generateBuilderClass(stack: string[], name: string): ClassDefinition {
  const stackLower = stack.map(s => s.toLowerCase()).join(' ');
  const combinedKey = `${stackLower} ${name.toLowerCase()}`;

  if (stackLower.includes('solana') || stackLower.includes('anchor')) {
    return BUILDER_CLASSES[0];
  }
  if (stackLower.includes('ai') || stackLower.includes('agent') || stackLower.includes('llm') || stackLower.includes('python')) {
    return BUILDER_CLASSES[1];
  }
  if (stackLower.includes('rust') || stackLower.includes('wasm')) {
    return BUILDER_CLASSES[2];
  }
  if (stackLower.includes('zk') || stackLower.includes('crypto') || stackLower.includes('circom')) {
    return BUILDER_CLASSES[3];
  }
  if (stackLower.includes('defi') || stackLower.includes('solidity')) {
    return BUILDER_CLASSES[4];
  }
  if (stackLower.includes('ui') || stackLower.includes('three') || stackLower.includes('design') || stackLower.includes('tailwind')) {
    return BUILDER_CLASSES[6];
  }

  // Deterministic pseudo-random selection based on string hash
  let hash = 0;
  for (let i = 0; i < combinedKey.length; i++) {
    hash = combinedKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BUILDER_CLASSES.length;
  return BUILDER_CLASSES[index];
}

export function getAllClasses(): ClassDefinition[] {
  return BUILDER_CLASSES;
}
