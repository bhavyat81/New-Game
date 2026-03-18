import { useGameStore } from '../store/useGameStore';
import { ItemType } from '../constants/items';

export function checkAndAutoRestock() {
  const state = useGameStore.getState();
  if (!state.hasChotu) return;

  state.shelves.forEach((shelf) => {
    if (shelf.unlocked && shelf.stock <= 1) {
      const alreadyOrdered = state.pendingOrders.some(
        (o) => o.itemType === shelf.itemType
      );
      if (!alreadyOrdered) {
        state.placeRestockOrder(shelf.itemType);
      }
    }
  });
}

export function getLowStockShelves() {
  const state = useGameStore.getState();
  return state.shelves.filter(
    (s) => s.unlocked && s.stock <= 1 && s.stock < s.maxStock
  );
}

export function getNextUnlockable(): { id: string; cost: number; name: string } | null {
  const state = useGameStore.getState();
  const lockedShelves = state.shelves
    .filter((s) => !s.unlocked)
    .sort((a, b) => a.unlockCost - b.unlockCost);
  if (lockedShelves.length === 0) return null;
  const next = lockedShelves[0];
  return { id: next.id, cost: next.unlockCost, name: next.itemType };
}
