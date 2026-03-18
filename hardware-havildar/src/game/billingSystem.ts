import { useGameStore } from '../store/useGameStore';

export function checkAndAutoBill() {
  const state = useGameStore.getState();
  if (state.playerZone !== 'billing' && !state.hasRamu) return;

  const waitingCustomers = state.customers.filter(
    (c) => c.state === 'waiting_at_billing'
  );

  waitingCustomers.forEach((customer) => {
    state.billCustomer(customer.id);
  });
}
