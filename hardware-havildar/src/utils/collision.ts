import { ZONES } from '../constants/layout';

export function isPlayerInZone(
  playerX: number,
  playerY: number,
  zoneId: string
): boolean {
  const zone = ZONES[zoneId];
  if (!zone) return false;
  return (
    playerX >= zone.x &&
    playerX <= zone.x + zone.width &&
    playerY >= zone.y &&
    playerY <= zone.y + zone.height
  );
}

export function getPlayerZone(playerX: number, playerY: number): string {
  for (const zoneId of Object.keys(ZONES)) {
    if (isPlayerInZone(playerX, playerY, zoneId)) {
      return zoneId;
    }
  }
  return 'floor';
}
