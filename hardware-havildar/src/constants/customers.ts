import { ItemType } from './items';

export type CustomerType = 'homeowner' | 'plumber' | 'electrician' | 'contractor' | 'painter';

export interface CustomerConfig {
  type: CustomerType;
  name: string;
  targetItem: ItemType;
  patience: number;
  reward: number;
  walkSpeed: number;
  emoji: string;
  color: string;
}

export const CUSTOMER_CONFIGS: Record<CustomerType, CustomerConfig> = {
  homeowner: {
    type: 'homeowner',
    name: 'Uncle Ji',
    targetItem: 'nails',
    patience: 30,
    reward: 10,
    walkSpeed: 1,
    emoji: '🏠',
    color: '#4CAF50',
  },
  plumber: {
    type: 'plumber',
    name: 'Plumber Bhaiya',
    targetItem: 'pipes',
    patience: 20,
    reward: 25,
    walkSpeed: 1.5,
    emoji: '🔧',
    color: '#2196F3',
  },
  electrician: {
    type: 'electrician',
    name: 'Electrician',
    targetItem: 'wire',
    patience: 15,
    reward: 30,
    walkSpeed: 2,
    emoji: '⚡',
    color: '#FFC107',
  },
  contractor: {
    type: 'contractor',
    name: 'Contractor Sahib',
    targetItem: 'cement',
    patience: 10,
    reward: 80,
    walkSpeed: 1.5,
    emoji: '🏗️',
    color: '#FF5722',
  },
  painter: {
    type: 'painter',
    name: 'Painting Aunty',
    targetItem: 'paint',
    patience: 20,
    reward: 20,
    walkSpeed: 1,
    emoji: '🎨',
    color: '#9C27B0',
  },
};
