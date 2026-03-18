export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: 'coins' | 'gems';
  type: 'shelf' | 'helper' | 'expansion' | 'boost';
  emoji: string;
  unlocked: boolean;
}

export const UPGRADES: Upgrade[] = [
  {
    id: 'shelf_pipes',
    name: 'PVC Pipes Shelf',
    description: 'Unlock PVC Pipes for plumbers',
    cost: 150,
    costType: 'coins',
    type: 'shelf',
    emoji: '🪠',
    unlocked: false,
  },
  {
    id: 'shelf_paint',
    name: 'Paint Shelf',
    description: 'Unlock Paint for painters',
    cost: 300,
    costType: 'coins',
    type: 'shelf',
    emoji: '🎨',
    unlocked: false,
  },
  {
    id: 'helper_ramu',
    name: 'Hire Ramu',
    description: "Auto-bills customers when you're restocking",
    cost: 500,
    costType: 'coins',
    type: 'helper',
    emoji: '👨‍💼',
    unlocked: false,
  },
  {
    id: 'shelf_nuts',
    name: 'Nuts & Bolts Shelf',
    description: 'Unlock Nuts & Bolts',
    cost: 750,
    costType: 'coins',
    type: 'shelf',
    emoji: '⚙️',
    unlocked: false,
  },
  {
    id: 'shelf_cement',
    name: 'Cement Bags Section',
    description: 'Unlock Cement for contractors',
    cost: 1000,
    costType: 'coins',
    type: 'shelf',
    emoji: '🏗️',
    unlocked: false,
  },
  {
    id: 'helper_chotu',
    name: 'Hire Chotu',
    description: 'Auto-restocks godown automatically',
    cost: 1500,
    costType: 'coins',
    type: 'helper',
    emoji: '👦',
    unlocked: false,
  },
  {
    id: 'expand_store',
    name: 'Expand Store',
    description: 'New room with 2 more shelf slots',
    cost: 2500,
    costType: 'coins',
    type: 'expansion',
    emoji: '🏪',
    unlocked: false,
  },
  {
    id: 'boost_restock',
    name: 'Boost Restock Speed',
    description: '2x faster delivery',
    cost: 5,
    costType: 'gems',
    type: 'boost',
    emoji: '⚡',
    unlocked: false,
  },
];
