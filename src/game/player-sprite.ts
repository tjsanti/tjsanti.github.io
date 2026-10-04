import type * as Phaser from 'phaser';
import { readPlayerFrames } from './sprite-atlas';

/** Register frame rectangles from the real art asset, never repaint the character in code. */
export function registerPlayerFrames(scene: Phaser.Scene): number {
  const texture = scene.textures.get('trevor-player');
  const image = texture.getSourceImage() as HTMLImageElement;
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.drawImage(image, 0, 0);
  const frames = readPlayerFrames(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
  for (const pose of frames) {
    const frame = texture.add(pose.name, 0, pose.x, pose.y, pose.width, pose.height)!;
    frame.customPivot = true; frame.pivotX = pose.pivotX; frame.pivotY = 1;
  }
  texture.setFilter(0);
  return 132 / Math.max(...frames.map(frame => frame.height));
}
