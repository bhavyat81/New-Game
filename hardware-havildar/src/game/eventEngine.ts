import { useGameStore } from '../store/useGameStore';

export const EVENTS = [
  {
    id: 'monsoon_rush',
    name: '🌧️ Monsoon Rush!',
    description: 'Plumbers are in demand! Pipes sell like hot chai!',
    minLevel: 5,
    multiplier: 2,
    duration: 60000,
  },
  {
    id: 'diwali_sale',
    name: '🪔 Diwali Sale!',
    description: 'Double coins! Wire and lights flying off shelves!',
    minLevel: 8,
    multiplier: 2,
    duration: 90000,
  },
  {
    id: 'construction_boom',
    name: '🏗️ Construction Boom!',
    description: 'Contractors flooding in for cement!',
    minLevel: 10,
    multiplier: 3,
    duration: 60000,
  },
  {
    id: 'school_reopening',
    name: '🏫 School Reopening!',
    description: 'Steady hardware traffic. Sell more nails!',
    minLevel: 3,
    multiplier: 1.5,
    duration: 45000,
  },
];

// 5% chance per check interval to trigger a random eligible event
const EVENT_TRIGGER_PROBABILITY = 0.05;

export function checkAndTriggerEvent() {
  const state = useGameStore.getState();
  if (state.activeEvent) return;

  const eligibleEvents = EVENTS.filter((e) => state.level >= e.minLevel);
  if (eligibleEvents.length === 0) return;

  if (Math.random() < EVENT_TRIGGER_PROBABILITY) {
    const event = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
    state.setActiveEvent(event.name, event.multiplier);
    setTimeout(() => {
      state.setActiveEvent(null, 1);
    }, event.duration);
  }
}
