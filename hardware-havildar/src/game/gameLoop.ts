import { useGameStore } from '../store/useGameStore';
import { spawnCustomer, updateCustomerAI } from './customerAI';

const MAX_CUSTOMERS = 5;
const SPAWN_INTERVAL_MS = 8000;
const INITIAL_SPAWN_DELAY_MS = 2000;

let gameInterval: ReturnType<typeof setInterval> | null = null;
let spawnInterval: ReturnType<typeof setInterval> | null = null;
let patienceInterval: ReturnType<typeof setInterval> | null = null;

export function startGameLoop() {
  if (gameInterval) return;

  // Main game tick (every 100ms for smooth movement)
  gameInterval = setInterval(() => {
    updateCustomerAI();
    useGameStore.getState().processGodownDeliveries();
  }, 100);

  // Spawn customers every SPAWN_INTERVAL_MS
  spawnInterval = setInterval(() => {
    const state = useGameStore.getState();
    if (state.customers.length < MAX_CUSTOMERS) {
      const customer = spawnCustomer();
      if (customer) {
        state.addCustomer(customer);
      }
    }
  }, SPAWN_INTERVAL_MS);

  // Patience tick every second
  patienceInterval = setInterval(() => {
    useGameStore.getState().decreaseCustomerPatience();
  }, 1000);

  // Spawn first customer immediately
  setTimeout(() => {
    const state = useGameStore.getState();
    const customer = spawnCustomer();
    if (customer) state.addCustomer(customer);
  }, INITIAL_SPAWN_DELAY_MS);
}

export function stopGameLoop() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }
  if (patienceInterval) {
    clearInterval(patienceInterval);
    patienceInterval = null;
  }
}
