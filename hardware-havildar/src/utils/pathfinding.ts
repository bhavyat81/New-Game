export interface Point {
  x: number;
  y: number;
}

export function simpleLinearPath(from: Point, to: Point, steps: number): Point[] {
  const path: Point[] = [];
  for (let i = 1; i <= steps; i++) {
    path.push({
      x: from.x + ((to.x - from.x) * i) / steps,
      y: from.y + ((to.y - from.y) * i) / steps,
    });
  }
  return path;
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function moveTowards(from: Point, to: Point, speed: number): Point {
  const dist = distance(from, to);
  if (dist <= speed) return { ...to };
  const ratio = speed / dist;
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
  };
}
