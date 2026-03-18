import { Customer, CustomerState, useGameStore } from '../store/useGameStore';
import { CustomerType, CUSTOMER_CONFIGS } from '../constants/customers';
import { ZONES } from '../constants/layout';
import { ItemType } from '../constants/items';
import { moveTowards } from '../utils/pathfinding';

let customerIdCounter = 0;

export function getShelfZoneForItem(itemType: ItemType): string {
  const mapping: Record<ItemType, string> = {
    nails: 'shelf_nails',
    wire: 'shelf_wire',
    pipes: 'shelf_pipes',
    paint: 'shelf_paint',
    nuts_bolts: 'shelf_nuts',
    cement: 'shelf_cement',
  };
  return mapping[itemType] || 'shelf_nails';
}

export function getZoneCenter(zoneId: string): { x: number; y: number } {
  const zone = ZONES[zoneId];
  if (!zone) return { x: 180, y: 400 };
  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2,
  };
}

export function spawnCustomer(): Customer {
  const store = useGameStore.getState();
  const unlockedShelves = store.shelves.filter((s) => s.unlocked && s.stock > 0);

  const allTypes: CustomerType[] = ['homeowner', 'plumber', 'electrician', 'contractor', 'painter'];
  const availableAll = allTypes.filter((t) => {
    const config = CUSTOMER_CONFIGS[t];
    return unlockedShelves.some((s) => s.itemType === config.targetItem);
  });

  // Fallback to homeowner only — nails are always unlocked at start
  const pool = availableAll.length > 0 ? availableAll : (['homeowner'] as CustomerType[]);
  const type = pool[Math.floor(Math.random() * pool.length)];
  const config = CUSTOMER_CONFIGS[type];
  customerIdCounter += 1;

  return {
    id: `customer_${customerIdCounter}_${Date.now()}`,
    type,
    state: 'entering',
    targetItem: config.targetItem,
    patience: config.patience,
    maxPatience: config.patience,
    position: { x: 180, y: 620 },
    reward: config.reward,
  };
}

export function updateCustomerAI() {
  const store = useGameStore.getState();
  const { customers, shelves, playerZone, hasRamu } = store;

  customers.forEach((customer) => {
    const config = CUSTOMER_CONFIGS[customer.type];
    const speed = config.walkSpeed * 2;

    switch (customer.state) {
      case 'entering': {
        const targetShelfId = getShelfZoneForItem(customer.targetItem);
        const shelf = shelves.find((s) => s.id === targetShelfId);

        if (!shelf || !shelf.unlocked || shelf.stock <= 0) {
          store.updateCustomer(customer.id, { state: 'angry_exit' });
          return;
        }

        const shelfCenter = getZoneCenter(targetShelfId);
        const newPos = moveTowards(customer.position, shelfCenter, speed);
        const dist = Math.abs(newPos.x - shelfCenter.x) + Math.abs(newPos.y - shelfCenter.y);

        if (dist < 10) {
          store.updateCustomer(customer.id, {
            position: shelfCenter,
            state: 'walking_to_billing',
          });
          // Reduce shelf stock
          const updatedShelves = shelves.map((s) =>
            s.id === targetShelfId ? { ...s, stock: Math.max(0, s.stock - 1) } : s
          );
          useGameStore.setState({ shelves: updatedShelves });
        } else {
          store.updateCustomer(customer.id, { position: newPos });
        }
        break;
      }

      case 'walking_to_billing': {
        const billingCenter = getZoneCenter('billing');
        const newPos = moveTowards(customer.position, billingCenter, speed);
        const dist = Math.abs(newPos.x - billingCenter.x) + Math.abs(newPos.y - billingCenter.y);

        if (dist < 10) {
          store.updateCustomer(customer.id, {
            position: billingCenter,
            state: 'waiting_at_billing',
          });
        } else {
          store.updateCustomer(customer.id, { position: newPos });
        }
        break;
      }

      case 'waiting_at_billing': {
        if (playerZone === 'billing' || hasRamu) {
          store.billCustomer(customer.id);
        }
        break;
      }

      case 'exiting': {
        const exitPos = { x: 180, y: 700 };
        const newPos = moveTowards(customer.position, exitPos, speed * 1.5);
        const dist = Math.abs(newPos.x - exitPos.x) + Math.abs(newPos.y - exitPos.y);
        if (dist < 5) {
          store.removeCustomer(customer.id);
        } else {
          store.updateCustomer(customer.id, { position: newPos });
        }
        break;
      }

      case 'angry_exit': {
        const exitPos = { x: 180, y: 700 };
        const newPos = moveTowards(customer.position, exitPos, speed * 2.5);
        const dist = Math.abs(newPos.x - exitPos.x) + Math.abs(newPos.y - exitPos.y);
        if (dist < 5) {
          store.removeCustomer(customer.id);
        } else {
          store.updateCustomer(customer.id, { position: newPos });
        }
        break;
      }
    }
  });

  // Check patience for waiting customers
  store.customers.forEach((customer) => {
    if (
      (customer.state === 'waiting_at_billing' || customer.state === 'waiting_at_shelf') &&
      customer.patience <= 0
    ) {
      store.updateCustomer(customer.id, { state: 'angry_exit' as CustomerState });
    }
  });
}
