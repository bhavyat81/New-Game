export type ItemType = 'nails' | 'wire' | 'pipes' | 'paint' | 'nuts_bolts' | 'cement';

export interface ItemConfig {
  id: ItemType;
  name: string;
  icon: string;
  price: number;
  unlockCost: number;
  emoji: string;
}

export const ITEMS: Record<ItemType, ItemConfig> = {
  nails: {
    id: 'nails',
    name: 'Nails',
    icon: 'nails',
    price: 10,
    unlockCost: 0,
    emoji: '🔩',
  },
  wire: {
    id: 'wire',
    name: 'Electrical Wire',
    icon: 'wire',
    price: 15,
    unlockCost: 0,
    emoji: '🔌',
  },
  pipes: {
    id: 'pipes',
    name: 'PVC Pipes',
    icon: 'pipe',
    price: 25,
    unlockCost: 150,
    emoji: '🪠',
  },
  paint: {
    id: 'paint',
    name: 'Paint',
    icon: 'paint',
    price: 20,
    unlockCost: 300,
    emoji: '🎨',
  },
  nuts_bolts: {
    id: 'nuts_bolts',
    name: 'Nuts & Bolts',
    icon: 'nuts',
    price: 12,
    unlockCost: 750,
    emoji: '⚙️',
  },
  cement: {
    id: 'cement',
    name: 'Cement Bags',
    icon: 'cement',
    price: 80,
    unlockCost: 1000,
    emoji: '🏗️',
  },
};
