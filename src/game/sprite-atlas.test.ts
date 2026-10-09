import assert from 'node:assert/strict';
import test from 'node:test';
import { readPlayerFrames } from './sprite-atlas.ts';

const width = 30, height = 40;
function sheet() {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
    for (let y = row * 10 + 2; y <= row * 10 + 8; y++) for (let x = col * 10 + 3; x <= col * 10 + 6; x++) pixels[(y * width + x) * 4 + 3] = 255;
  }
  return pixels;
}
test('the atlas reads all twelve poses with stable centers and no neighboring pixels', () => {
  const frames = readPlayerFrames(sheet(), width, height);
  assert.equal(frames.length, 12);
  assert.deepEqual(frames.map(frame => frame.name), ['down-0','down-1','down-2','left-0','left-1','left-2','right-0','right-1','right-2','up-0','up-1','up-2']);
  frames.forEach(frame => { assert.equal(frame.width, 4); assert.equal(frame.height, 7); assert.equal(frame.pivotX, .5); });
});
test('empty poses and opaque backdrops fail instead of drawing a rectangle in the hall', () => {
  assert.throws(() => readPlayerFrames(new Uint8ClampedArray(width * height * 4), width, height), /Missing/);
  assert.throws(() => readPlayerFrames(new Uint8ClampedArray(width * height * 4).fill(255), width, height), /transparent/);
});
test('uneven row spacing never includes the next character head in a frame', () => {
  const pixels = new Uint8ClampedArray(300 * 400 * 4);
  [10, 105, 200, 290].forEach(top => {
    [30, 120, 230].forEach(left => {
      for (let y = top; y < top + 75; y++) for (let x = left; x < left + 30; x++) pixels[(y * 300 + x) * 4 + 3] = 255;
    });
  });
  const frames = readPlayerFrames(pixels, 300, 400);
  assert.equal(frames.length, 12);
  frames.forEach(frame => { assert.equal(frame.height, 75); assert.equal(frame.pivotX, .5); });
  assert.equal(frames.find(frame => frame.name === 'up-0')!.y, 290);
});
