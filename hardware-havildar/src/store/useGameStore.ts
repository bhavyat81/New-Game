import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemType } from '../constants/items';
import { CustomerType } from '../constants/customers';
import { getPlayerZone } from '../utils/collision';

export type CustomerState =
  | 'entering'
  | 'walking_to_shelf'
  | 'waiting_at_shelf'
  | 'walking_to_billing'
  | 'waiting_at_billing'
  | 'exiting'
  | 'angry_exit';

export interface Customer {
  id: string;
  type: CustomerType;
  state: CustomerState;
  targetItem: ItemType;
  patience: number;
  maxPatience: number;
  position: { x: number; y: number };
  reward: number;
}

export interface Shelf {
  id: string;
  itemType: ItemType;
  stock: number;
  maxStock: number;
  unlocked: boolean;
  unlockCost: number;
  unlockProgress: number;
}

export interface GodownItem {
  itemType: ItemType;
  quantity: number;
}

export interface PendingOrder {
  itemType: ItemType;
  eta: number;
  orderedAt: number;
}

export interface Item {
  type: ItemType;
  quantity: number;
}

export interface GameState {
  // Economy
  coins: number;
  gems: number;

  // Progression
  level: number;
  xp: number;
  xpToNextLevel: number;

  // Player
  playerPosition: { x: number; y: number };
  playerZone: string;
  carryingItems: Item[];

  // Shelves
  shelves: Shelf[];

  // Customers
  customers: Customer[];

  // Godown
  godownItems: GodownItem[];
  pendingOrders: PendingOrder[];

  // Helpers
  hasRamu: boolean;
  hasChotu: boolean;
  hasRestockBoost: boolean;

  // Events
  activeEvent: string | null;
  eventMultiplier: number;

  // Coin popup
  coinPopups: { id: string; amount: number; x: number; y: number }[];

  // Best score
  bestDayCoins: number;
  totalCoinsEarned: number;

  // Actions
  movePlayer: (direction: { x: number; y: number }) => void;
  setPlayerPosition: (pos: { x: number; y: number }) => void;
  billCustomer: (customerId: string) => void;
  restockShelf: (shelfId: string) => void;
  placeRestockOrder: (itemType: ItemType) => void;
  collectFromGodown: (itemType: ItemType) => void;
  unlockShelf: (shelfId: string) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  addXp: (amount: number) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  decreaseCustomerPatience: () => void;
  processGodownDeliveries: () => void;
  setActiveEvent: (event: string | null, multiplier?: number) => void;
  addCoinPopup: (amount: number, x: number, y: number) => void;
  removeCoinPopup: (id: string) => void;
  hireHelper: (helperId: string) => boolean;
  pickupGodownItem: (itemType: ItemType) => void;
  resetGame: () => void;
}

const INITIAL_SHELVES: Shelf[] = [
  {
    id: 'shelf_nails',
    itemType: 'nails',
    stock: 4,
    maxStock: 4,
    unlocked: true,
    unlockCost: 0,
    unlockProgress: 100,
  },
  {
    id: 'shelf_wire',
    itemType: 'wire',
    stock: 4,
    maxStock: 4,
    unlocked: true,
    unlockCost: 0,
    unlockProgress: 100,
  },
  {
    id: 'shelf_pipes',
    itemType: 'pipes',
    stock: 0,
    maxStock: 4,
    unlocked: false,
    unlockCost: 150,
    unlockProgress: 0,
  },
  {
    id: 'shelf_paint',
    itemType: 'paint',
    stock: 0,
    maxStock: 4,
    unlocked: false,
    unlockCost: 300,
    unlockProgress: 0,
  },
  {
    id: 'shelf_nuts',
    itemType: 'nuts_bolts',
    stock: 0,
    maxStock: 4,
    unlocked: false,
    unlockCost: 750,
    unlockProgress: 0,
  },
  {
    id: 'shelf_cement',
    itemType: 'cement',
    stock: 0,
    maxStock: 4,
    unlocked: false,
    unlockCost: 1000,
    unlockProgress: 0,
  },
];

const PLAYER_MOVE_SPEED = 5;

// Shared helper: moves qty of itemType from godown into carrying items
function transferGodownItemToCarry(
  state: Pick<GameState, 'carryingItems' | 'godownItems'>,
  itemType: ItemType,
  qty: number,
  set: (partial: Partial<GameState>) => void
) {
  const carrying = [...state.carryingItems];
  const existing = carrying.find((c) => c.type === itemType);
  if (existing) {
    existing.quantity += qty;
  } else {
    carrying.push({ type: itemType, quantity: qty });
  }
  set({
    carryingItems: carrying,
    godownItems: state.godownItems.filter((g) => g.itemType !== itemType),
  });
}

const INITIAL_STATE = {
  coins: 50,
  gems: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  playerPosition: { x: 180, y: 420 },
  playerZone: 'floor',
  carryingItems: [] as Item[],
  shelves: INITIAL_SHELVES,
  customers: [] as Customer[],
  godownItems: [] as GodownItem[],
  pendingOrders: [] as PendingOrder[],
  hasRamu: false,
  hasChotu: false,
  hasRestockBoost: false,
  activeEvent: null as string | null,
  eventMultiplier: 1,
  coinPopups: [] as { id: string; amount: number; x: number; y: number }[],
  bestDayCoins: 0,
  totalCoinsEarned: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      movePlayer: (direction) => {
        const state = get();
        const newPos = {
          x: Math.max(0, Math.min(340, state.playerPosition.x + direction.x * PLAYER_MOVE_SPEED)),
          y: Math.max(50, Math.min(600, state.playerPosition.y + direction.y * PLAYER_MOVE_SPEED)),
        };
        const newZone = getPlayerZone(newPos.x, newPos.y);
        set({ playerPosition: newPos, playerZone: newZone });

        // Auto-collect godown items if player walks over godown
        if (newZone === 'godown') {
          const freshState = get();
          freshState.godownItems.forEach((gi) => {
            transferGodownItemToCarry(get(), gi.itemType, gi.quantity, set);
          });
        }
      },

      setPlayerPosition: (pos) => {
        const newZone = getPlayerZone(pos.x, pos.y);
        set({ playerPosition: pos, playerZone: newZone });
      },

      billCustomer: (customerId) => {
        const state = get();
        const customer = state.customers.find((c) => c.id === customerId);
        if (!customer) return;
        const reward = Math.round(customer.reward * state.eventMultiplier);
        set({
          coins: state.coins + reward,
          totalCoinsEarned: state.totalCoinsEarned + reward,
          bestDayCoins: Math.max(state.bestDayCoins, state.totalCoinsEarned + reward),
          customers: state.customers.map((c) =>
            c.id === customerId ? { ...c, state: 'exiting' as CustomerState } : c
          ),
        });
        get().addXp(5);
        get().addCoinPopup(reward, state.playerPosition.x, state.playerPosition.y - 30);
      },

      restockShelf: (shelfId) => {
        const state = get();
        const shelf = state.shelves.find((s) => s.id === shelfId);
        if (!shelf || !shelf.unlocked) return;
        const needed = shelf.maxStock - shelf.stock;
        if (needed <= 0) return;

        const carrying = [...state.carryingItems];
        const itemIndex = carrying.findIndex((c) => c.type === shelf.itemType);
        if (itemIndex === -1) return;

        const item = carrying[itemIndex];
        const toAdd = Math.min(needed, item.quantity);
        item.quantity -= toAdd;
        if (item.quantity <= 0) carrying.splice(itemIndex, 1);

        set({
          shelves: state.shelves.map((s) =>
            s.id === shelfId ? { ...s, stock: s.stock + toAdd } : s
          ),
          carryingItems: carrying,
        });
      },

      placeRestockOrder: (itemType) => {
        const state = get();
        const alreadyOrdered = state.pendingOrders.some((o) => o.itemType === itemType);
        if (alreadyOrdered) return;
        const deliveryTime = state.hasRestockBoost ? 15 : 30;
        const newOrder: PendingOrder = {
          itemType,
          eta: deliveryTime,
          orderedAt: Date.now(),
        };
        set({ pendingOrders: [...state.pendingOrders, newOrder] });
      },

      collectFromGodown: (itemType) => {
        const state = get();
        const godownItem = state.godownItems.find((g) => g.itemType === itemType);
        if (!godownItem || godownItem.quantity <= 0) return;
        transferGodownItemToCarry(state, itemType, godownItem.quantity, set);
      },

      pickupGodownItem: (itemType) => {
        const state = get();
        const godownItem = state.godownItems.find((g) => g.itemType === itemType);
        if (!godownItem || godownItem.quantity <= 0) return;
        transferGodownItemToCarry(state, itemType, godownItem.quantity, set);
      },

      unlockShelf: (shelfId) => {
        const state = get();
        const shelf = state.shelves.find((s) => s.id === shelfId);
        if (!shelf || shelf.unlocked) return;
        if (state.coins < shelf.unlockCost) return;
        set({
          coins: state.coins - shelf.unlockCost,
          shelves: state.shelves.map((s) =>
            s.id === shelfId
              ? { ...s, unlocked: true, stock: s.maxStock, unlockProgress: 100 }
              : s
          ),
        });
      },

      addCoins: (amount) => {
        const state = get();
        set({ coins: state.coins + amount });
      },

      spendCoins: (amount) => {
        const state = get();
        if (state.coins < amount) return false;
        set({ coins: state.coins - amount });
        return true;
      },

      addGems: (amount) => {
        const state = get();
        set({ gems: state.gems + amount });
      },

      spendGems: (amount) => {
        const state = get();
        if (state.gems < amount) return false;
        set({ gems: state.gems - amount });
        return true;
      },

      addXp: (amount) => {
        const state = get();
        let newXp = state.xp + amount;
        let newLevel = state.level;
        let xpToNext = state.xpToNextLevel;
        while (newXp >= xpToNext) {
          newXp -= xpToNext;
          newLevel += 1;
          xpToNext = Math.round(xpToNext * 1.5);
        }
        set({ xp: newXp, level: newLevel, xpToNextLevel: xpToNext });
      },

      addCustomer: (customer) => {
        const state = get();
        set({ customers: [...state.customers, customer] });
      },

      updateCustomer: (id, updates) => {
        const state = get();
        set({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        });
      },

      removeCustomer: (id) => {
        const state = get();
        set({ customers: state.customers.filter((c) => c.id !== id) });
      },

      decreaseCustomerPatience: () => {
        const state = get();
        const updated = state.customers.map((c) => {
          if (c.state === 'waiting_at_shelf' || c.state === 'waiting_at_billing') {
            return { ...c, patience: c.patience - 1 };
          }
          return c;
        });
        set({ customers: updated });
      },

      processGodownDeliveries: () => {
        const state = get();
        const now = Date.now();
        const remaining: PendingOrder[] = [];
        const arrived: GodownItem[] = [...state.godownItems];

        state.pendingOrders.forEach((order) => {
          const elapsed = (now - order.orderedAt) / 1000;
          if (elapsed >= order.eta) {
            const existing = arrived.find((g) => g.itemType === order.itemType);
            if (existing) {
              existing.quantity += 4;
            } else {
              arrived.push({ itemType: order.itemType, quantity: 4 });
            }
          } else {
            remaining.push(order);
          }
        });
        set({ pendingOrders: remaining, godownItems: arrived });
      },

      setActiveEvent: (event, multiplier = 1) => {
        set({ activeEvent: event, eventMultiplier: multiplier });
      },

      addCoinPopup: (amount, x, y) => {
        const COIN_POPUP_DURATION_MS = 1500;
        const id = Math.random().toString(36).slice(2);
        const state = get();
        set({ coinPopups: [...state.coinPopups, { id, amount, x, y }] });
        setTimeout(() => get().removeCoinPopup(id), COIN_POPUP_DURATION_MS);
      },

      removeCoinPopup: (id) => {
        const state = get();
        set({ coinPopups: state.coinPopups.filter((p) => p.id !== id) });
      },

      hireHelper: (helperId) => {
        const state = get();
        if (helperId === 'helper_ramu') {
          if (state.coins < 500) return false;
          set({ coins: state.coins - 500, hasRamu: true });
          return true;
        }
        if (helperId === 'helper_chotu') {
          if (state.coins < 1500) return false;
          set({ coins: state.coins - 1500, hasChotu: true });
          return true;
        }
        if (helperId === 'boost_restock') {
          if (state.gems < 5) return false;
          set({ gems: state.gems - 5, hasRestockBoost: true });
          return true;
        }
        return false;
      },

      resetGame: () => {
        set({ ...INITIAL_STATE });
      },
    }),
    {
      name: 'hardware-havildar-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        coins: state.coins,
        gems: state.gems,
        level: state.level,
        xp: state.xp,
        xpToNextLevel: state.xpToNextLevel,
        shelves: state.shelves,
        hasRamu: state.hasRamu,
        hasChotu: state.hasChotu,
        hasRestockBoost: state.hasRestockBoost,
        bestDayCoins: state.bestDayCoins,
        totalCoinsEarned: state.totalCoinsEarned,
      }),
    }
  )
);
