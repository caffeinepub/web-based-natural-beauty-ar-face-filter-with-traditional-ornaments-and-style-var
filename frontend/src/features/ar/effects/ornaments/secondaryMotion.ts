interface Point {
  x: number;
  y: number;
}

export function applySecondaryMotion(
  target: Point,
  previous: Point,
  smoothing: number
): Point {
  return {
    x: previous.x + (target.x - previous.x) * smoothing,
    y: previous.y + (target.y - previous.y) * smoothing,
  };
}
