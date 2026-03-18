import { useGameStore } from '../store/useGameStore';

export function handleJoystickInput(dx: number, dy: number) {
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  if (magnitude < 0.1) return;
  const normalized = { x: dx / magnitude, y: dy / magnitude };
  useGameStore.getState().movePlayer(normalized);
}
