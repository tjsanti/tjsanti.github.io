import { HALL_SIZE, PLAYER_SPAWN, moveOnFloor, pathToExhibit, type Point } from './hall-geometry';
import { registerPlayerFrames } from './player-sprite';
import type * as PhaserTypes from 'phaser';

export interface HallExhibit {
  id: string;
  label: string;
  kind: string;
  projectId?: string;
  x: number;
  y: number;
  radius: number;
}

export interface HallOptions {
  exhibits: HallExhibit[];
  onNearby: (id: string | null) => void;
  onInteract: (id: string) => void;
  onReady: () => void;
  arrival?: boolean;
}

export interface HallController {
  setPaused: (paused: boolean) => void;
  setDirection: (x: number, y: number) => void;
  interact: () => void;
  markVisited: (id: string) => void;
  getView: () => { zoom: number; scrollX: number; scrollY: number };
  revealPlayer: () => Promise<void>;
  destroy: () => void;
}

/** The engine is deliberately imported here, never while rendering a Profile. */
export async function mountHall(container: HTMLElement, options: HallOptions): Promise<HallController> {
  const Phaser = (await import('phaser')).default;
  let paused = false;
  let hidden = document.hidden;
  let destroyed = false;
  let nearby: string | null = null;
  let position: Point = { ...PLAYER_SPAWN };
  let touchDirection = { x: 0, y: 0 };
  let route: Point[] = [];
  let selectedExhibit: HallExhibit | null = null;
  const keys = new Set<string>();
  const visited = new Set<string>();
  const markers = new Map<string, PhaserTypes.GameObjects.Container>();
  const labels = new Map<string, PhaserTypes.GameObjects.Text>();
  let resolveReady: (controller: HallController) => void;
  let rejectReady: (reason: Error) => void;
  const ready = new Promise<HallController>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });

  const release = () => { keys.clear(); touchDirection = { x: 0, y: 0 }; route = []; selectedExhibit = null; };
  const active = () => !paused && !hidden && !destroyed;
  const setNearby = (id: string | null) => {
    if (nearby === id) return;
    nearby = id;
    for (const [labelId, label] of labels) label.setVisible(labelId === id);
    options.onNearby(id);
  };
  const interact = () => { if (active() && nearby) options.onInteract(nearby); };
  const isFormControl = (target: EventTarget | null) => target instanceof Element && Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="textbox"]'));
  const keydown = (event: KeyboardEvent) => {
    if (!active() || isFormControl(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (!['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'e'].includes(key)) return;
    event.preventDefault();
    if (key === 'e') { if (!event.repeat) interact(); return; }
    route = []; selectedExhibit = null; keys.add(key);
  };
  const keyup = (event: KeyboardEvent) => { keys.delete(event.key.toLowerCase()); };
  const visibility = () => { hidden = document.hidden; if (hidden) release(); };
  window.addEventListener('keydown', keydown);
  window.addEventListener('keyup', keyup);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', visibility);

  class GardenHall extends Phaser.Scene {
    private player!: PhaserTypes.GameObjects.Image;
    private shadow!: PhaserTypes.GameObjects.Graphics;
    private facing = 'up';
    private walkTime = 0;
    private arrivalOffset = options.arrival ? -65 : 0;

    preload() {
      this.load.image('garden-hall', '/art/garden-hall.png');
      this.load.image('trevor-player', '/art/player/castle-scholar-v2.png');
      this.load.once('loaderror', () => rejectReady(new Error('The Garden hall artwork could not load.')));
    }

    create() {
      this.add.image(0, 0, 'garden-hall').setOrigin(0).setDisplaySize(HALL_SIZE.width, HALL_SIZE.height);
      this.textures.get('garden-hall').setFilter(Phaser.Textures.FilterMode.NEAREST);
      const playerScale = registerPlayerFrames(this);
      this.shadow = this.add.graphics().setDepth(9);
      this.shadow.fillStyle(0x26382f, 0.35);
      this.shadow.fillRect(-24, -3, 48, 7); this.shadow.fillRect(-16, -5, 32, 11);
      this.player = this.add.image(position.x, position.y, 'trevor-player', 'up-0').setScale(playerScale).setDepth(10);
      if (options.arrival) { this.player.setAlpha(0); this.shadow.setAlpha(0); }
      for (const exhibit of options.exhibits) {
        const diamond = this.add.graphics();
        diamond.fillStyle(0x283c32, 1); diamond.fillRect(-7, -7, 14, 14);
        diamond.fillStyle(0xffda78, 1); diamond.fillRect(-3, -7, 6, 14); diamond.fillRect(-7, -3, 14, 6);
        diamond.fillStyle(0xfff1ba, 1); diamond.fillRect(-2, -3, 4, 4);
        const marker = this.add.container(exhibit.x, exhibit.y - 45, [diamond]).setDepth(15);
        marker.setSize(38, 42).setInteractive({ useHandCursor: true });
        marker.on('pointerdown', () => {
          if (!active()) return;
          if (Math.hypot(position.x - exhibit.x, position.y - exhibit.y) <= exhibit.radius) { setNearby(exhibit.id); interact(); }
          else { release(); selectedExhibit = exhibit; route = pathToExhibit(position, exhibit); }
        });
        markers.set(exhibit.id, marker);
        const label = this.add.text(exhibit.x, exhibit.y - 74, exhibit.label.toUpperCase(), {
          fontFamily: '"Press Start 2P", monospace', fontSize: '12px', color: '#fff2c5',
          backgroundColor: '#23352c', padding: { x: 10, y: 8 }, align: 'center',
        }).setOrigin(0.5, 1).setDepth(16).setVisible(false);
        labels.set(exhibit.id, label);
      }
      this.cameras.main.setBounds(0, 0, HALL_SIZE.width, HALL_SIZE.height).setRoundPixels(true);
      this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
      this.resize();
      this.cameras.main.centerOn(position.x, position.y);
      this.game.canvas.tabIndex = 0;
      this.game.canvas.setAttribute('role', 'img');
      this.game.canvas.setAttribute('aria-label', 'Garden hall. Move with arrow keys or WASD. Press E at a nearby Exhibit.');
      this.game.canvas.style.imageRendering = 'pixelated';
      this.game.canvas.focus({ preventScroll: true });
      this.input.on('pointerdown', () => this.game.canvas.focus({ preventScroll: true }));
      container.dataset.gameReady = 'true';
      container.dataset.playerX = String(Math.round(position.x));
      container.dataset.playerY = String(Math.round(position.y));
      container.dataset.paused = 'false';
      options.onReady();
      resolveReady(controller);
    }

    resize() {
      if (!this.player) return;
      const { width, height } = this.scale;
      this.cameras.main.setZoom(Math.max(width / 1400, height / 950));
    }

    update(_time: number, delta: number) {
      if (!this.player || destroyed) return;
      let dx = 0; let dy = 0;
      if (active()) {
        dx = touchDirection.x + Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
        dy = touchDirection.y + Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
        if (dx === 0 && dy === 0 && route.length) {
          const next = route[0];
          const distance = Math.hypot(next.x - position.x, next.y - position.y);
          if (distance < 6) route.shift();
          else { dx = (next.x - position.x) / distance; dy = (next.y - position.y) / distance; }
        }
        if (dx || dy) {
          const length = Math.hypot(dx, dy);
          const travel = 230 * Math.min(delta, 40) / 1000;
          const next = moveOnFloor(position, dx / length * travel, dy / length * travel);
          const moved = Math.hypot(next.x - position.x, next.y - position.y) > 0.05;
          position = next;
          if (moved) {
            this.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
            this.walkTime += delta;
          } else this.walkTime = 0;
        } else this.walkTime = 0;
        const closest = options.exhibits.filter((exhibit) => Math.hypot(position.x - exhibit.x, position.y - exhibit.y) <= exhibit.radius)
          .sort((a, b) => Math.hypot(position.x - a.x, position.y - a.y) - Math.hypot(position.x - b.x, position.y - b.y))[0];
        setNearby(closest?.id ?? null);
        if (selectedExhibit && Math.hypot(position.x - selectedExhibit.x, position.y - selectedExhibit.y) <= selectedExhibit.radius * 0.72) {
          const selected = selectedExhibit;
          route = []; selectedExhibit = null; setNearby(selected.id); interact();
        }
      } else this.walkTime = 0;
      const walkingFrame = this.walkTime ? [0, 1, 0, 2][Math.floor(this.walkTime / 130) % 4] : 0;
      this.player.setFrame(`${this.facing}-${walkingFrame}`).setPosition(Math.round(position.x), Math.round(position.y) + this.arrivalOffset - (walkingFrame === 1 ? 1 : 0));
      this.shadow.setPosition(Math.round(position.x), Math.round(position.y) - 3);
      const x = String(Math.round(position.x)); const y = String(Math.round(position.y));
      if (container.dataset.playerX !== x) container.dataset.playerX = x;
      if (container.dataset.playerY !== y) container.dataset.playerY = y;
      for (const [id, marker] of markers) {
        marker.setAlpha(visited.has(id) ? 0.65 : 1);
        marker.setScale(nearby === id ? 1.2 : 1);
      }
    }
  }

  const scene = new GardenHall('garden-hall');
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: Math.max(1, container.clientWidth), height: Math.max(1, container.clientHeight),
    pixelArt: true, roundPixels: true, antialias: false,
    backgroundColor: '#1d2c25',
    input: { keyboard: false },
    scene,
    render: { pixelArt: true, antialias: false, roundPixels: true },
    audio: { noAudio: true },
  });
  const observer = new ResizeObserver(() => {
    if (destroyed) return;
    game.scale.resize(Math.max(1, container.clientWidth), Math.max(1, container.clientHeight));
    scene.resize();
  });
  observer.observe(container);

  const controller: HallController = {
    setPaused(value) {
      paused = value; release(); container.dataset.paused = String(value);
      if (value) setNearby(null);
      else game.canvas.focus({ preventScroll: true });
    },
    setDirection(x, y) { if (active()) { route = []; selectedExhibit = null; touchDirection = { x: Math.sign(x), y: Math.sign(y) }; } },
    interact,
    markVisited(id) { visited.add(id); },
    getView() {
      const camera = scene.cameras.main;
      return { zoom: camera.zoom, scrollX: camera.worldView.x, scrollY: camera.worldView.y };
    },
    revealPlayer() {
      return new Promise(resolve => {
        const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
        scene.tweens.add({ targets: scene, arrivalOffset: 0, duration, ease: 'Cubic.Out' });
        scene.tweens.add({ targets: [scene['player'], scene['shadow']], alpha: 1, duration, onComplete: () => resolve() });
      });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true; release(); observer.disconnect();
      window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', release); document.removeEventListener('visibilitychange', visibility);
      game.destroy(true); markers.clear(); labels.clear();
      delete container.dataset.gameReady; delete container.dataset.playerX;
      delete container.dataset.playerY; delete container.dataset.paused;
    },
  };
  return ready.catch((error) => { controller.destroy(); throw error; });
}
