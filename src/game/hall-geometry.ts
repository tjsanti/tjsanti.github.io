/** Coordinates describe the player's feet, not the top of its sprite. */
export const HALL_SIZE = { width: 1536, height: 1024 };
export const PLAYER_SPAWN = { x: 768, y: 800 };

export interface Point { x: number; y: number }
interface Rectangle { left: number; top: number; right: number; bottom: number }

const floor: Rectangle[] = [
  { left: 226, top: 398, right: 1330, bottom: 922 },
  { left: 585, top: 354, right: 950, bottom: 430 },
  { left: 650, top: 880, right: 887, bottom: 1002 },
];

const furniture: Rectangle[] = [
  { left: 110, top: 441, right: 250, bottom: 590 },
  { left: 110, top: 654, right: 343, bottom: 880 },
  { left: 1210, top: 540, right: 1460, bottom: 677 },
  { left: 1204, top: 745, right: 1460, bottom: 907 },
];

export function canStandAt({ x, y }: Point): boolean {
  const padding = 10;
  return floor.some((r) => x >= r.left + padding && x <= r.right - padding && y >= r.top + padding && y <= r.bottom - padding)
    && !furniture.some((r) => x > r.left - padding && x < r.right + padding && y > r.top - padding && y < r.bottom + padding);
}

/** Resolve each axis independently, so walking into furniture slides along it. */
export function moveOnFloor(position: Point, dx: number, dy: number): Point {
  const next = { ...position };
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 5));
  for (let step = 0; step < steps; step++) {
    const horizontal = { x: next.x + dx / steps, y: next.y };
    if (canStandAt(horizontal)) next.x = horizontal.x;
    const vertical = { x: next.x, y: next.y + dy / steps };
    if (canStandAt(vertical)) next.y = vertical.y;
  }
  return next;
}

/** Small floor grid, used only after selecting an Exhibit with a pointer. */
export function pathToExhibit(start: Point, target: Point): Point[] {
  const spacing = 24;
  const columns = HALL_SIZE.width / spacing;
  const rows = Math.ceil(HALL_SIZE.height / spacing);
  const grid = (column: number, row: number): Point => ({ x: column * spacing + spacing / 2, y: row * spacing + spacing / 2 });
  const valid = (column: number, row: number) => column >= 0 && row >= 0 && column < columns && row < rows && canStandAt(grid(column, row));
  const closestCell = (point: Point) => {
    let closest = -1;
    let distance = Infinity;
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      if (!valid(column, row)) continue;
      const cell = grid(column, row);
      const candidate = Math.hypot(cell.x - point.x, cell.y - point.y);
      if (candidate < distance) { distance = candidate; closest = row * columns + column; }
    }
    return closest;
  };
  const first = closestCell(start);
  const goal = closestCell(target);
  if (first < 0 || goal < 0) return [];
  const parents = new Map<number, number>([[first, -1]]);
  const queue = [first];
  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head];
    if (cell === goal) break;
    const column = cell % columns;
    const row = Math.floor(cell / columns);
    for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nc = column + dc; const nr = row + dr;
      const next = nr * columns + nc;
      if (valid(nc, nr) && !parents.has(next)) { parents.set(next, cell); queue.push(next); }
    }
  }
  if (!parents.has(goal)) return [];
  const route: Point[] = [];
  let cell = goal;
  while (cell !== first) {
    route.push(grid(cell % columns, Math.floor(cell / columns)));
    cell = parents.get(cell)!;
  }
  route.reverse();
  return route;
}
