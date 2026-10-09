export const PLAYER_DIRECTIONS = ['down', 'left', 'right', 'up'] as const;
export interface SpriteFrame {
  name: string; x: number; y: number; width: number; height: number; pivotX: number;
}

function bands(occupied: boolean[], joinGap: number): [number, number][] {
  const result: [number, number][] = [];
  occupied.forEach((present, position) => {
    if (!present) return;
    const last = result.at(-1);
    if (last && position - last[1] <= joinGap + 1) last[1] = position;
    else result.push([position, position]);
  });
  return result;
}

/** Read original alpha silhouettes. Uneven sheet margins cannot clip heads or shift the character between poses. */
export function readPlayerFrames(pixels: Uint8ClampedArray, width: number, height: number): SpriteFrame[] {
  if (pixels.length !== width * height * 4 || width < 3 || height < 4) throw new Error('Invalid player sprite sheet dimensions.');
  const solid = (x: number, y: number) => pixels[(y * width + x) * 4 + 3] >= 48;
  const rows = Array.from({ length: height }, (_, y) => {
    for (let x = 0; x < width; x++) if (solid(x, y)) return true;
    return false;
  });
  const rowBands = bands(rows, Math.max(1, Math.floor(height / 128)));
  if (!rowBands.length) throw new Error('Missing player poses.');
  if (rowBands.length !== 4) throw new Error('Player sheet must have four separate rows on a transparent background.');
  const frames: SpriteFrame[] = [];
  rowBands.forEach(([top, bottom], row) => {
    const columns = Array.from({ length: width }, (_, x) => {
      for (let y = top; y <= bottom; y++) if (solid(x, y)) return true;
      return false;
    });
    const columnBands = bands(columns, Math.max(1, Math.floor(width / 128)));
    if (columnBands.length !== 3) throw new Error('Each player direction needs three separate poses.');
    columnBands.forEach(([left, right], column) => {
      let minY = bottom, maxY = top;
      for (let y = top; y <= bottom; y++) for (let x = left; x <= right; x++) if (solid(x, y)) {
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      // Anchor on the head rather than changing arm/stride extents or guessed cell centers.
      let headTotal = 0, headWeight = 0;
      const headBottom = minY + Math.floor((maxY - minY + 1) * .22);
      for (let y = minY; y <= headBottom; y++) for (let x = left; x <= right; x++) if (solid(x, y)) {
        const alpha = pixels[(y * width + x) * 4 + 3];
        headTotal += (x + .5) * alpha; headWeight += alpha;
      }
      const frameWidth = right - left + 1;
      frames.push({ name: `${PLAYER_DIRECTIONS[row]}-${column}`, x: left, y: minY, width: frameWidth, height: maxY - minY + 1, pivotX: (headTotal / headWeight - left) / frameWidth });
    });
  });
  return frames;
}
