import type { HallController } from '../game/hall';
const landing = document.querySelector<HTMLElement>('.landing')!;
const game = document.querySelector<HTMLElement>('.game-shell')!;
const art = landing.querySelector<HTMLImageElement>('.hall-art')!;
let entering = false;
let entryGeneration = 0;
let controller: HallController | undefined;
let booting: Promise<HallController | undefined> | undefined;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function syncRoute() {
  entryGeneration++;
  const inHall = location.pathname.startsWith('/explore');
  landing.hidden = inHall; game.hidden = !inHall;
  landing.classList.remove('entering', 'handoff'); landing.inert = inHall;
  game.inert = !inHall || Boolean(new URL(location.href).searchParams.get('exhibit'));
  controller?.setPaused(!inHall || Boolean(new URL(location.href).searchParams.get('exhibit')));
  document.body.dataset.page = inHall ? 'game' : 'landing';
  document.querySelector('.skip-link')?.setAttribute('href', inHall ? '#game-content' : '#main-content');
  art.removeAttribute('style');
  art.getAnimations().forEach(animation => animation.cancel());
  entering = false;
  distance = 0;
}
window.addEventListener('hall-route-change', syncRoute);
window.addEventListener('pageshow', event => { if (event.persisted) syncRoute(); });

async function enter() {
  if (entering || location.pathname !== '/') return;
  entering = true;
  const generation = ++entryGeneration;
  // Keep this in the input event so native Back keeps the Landing entry.
  history.pushState({ hall: true }, '', '/explore/');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  landing.classList.add('entering');
  landing.querySelector('[role="status"]')!.textContent = 'Entering Garden hall';
  landing.inert = true;
  // Keep the original artwork in front while Phaser boots behind it.
  game.hidden = false; game.inert = true;
  if (!booting) booting = import('./explore')
    .then(module => module.initGame({ arrival: true, paused: true }))
    .catch(error => {
      console.error('Garden hall entry failed', error);
      document.querySelector<HTMLElement>('.game-loading')!.hidden = true;
      document.querySelector<HTMLElement>('.game-failure')!.hidden = false;
      return undefined;
    });
  controller = await booting;
  if (generation !== entryGeneration || location.pathname === '/') return;
  if (!controller) {
    syncRoute(); return;
  }
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  if (generation !== entryGeneration) return;
  const stage = document.querySelector('.game-stage')!.getBoundingClientRect();
  const { zoom, scrollX, scrollY } = controller.getView();
  const scale = Math.max(innerWidth / 1536, innerHeight / 1024);
  const startX = (innerWidth - 1536 * scale) * .5;
  const startY = (innerHeight - 1024 * scale) * (innerWidth <= 650 ? .35 : .45);
  const endX = stage.left - scrollX * zoom;
  const endY = stage.top - scrollY * zoom;
  Object.assign(art.style, { width: '1536px', height: '1024px', objectFit: 'fill', transformOrigin: '0 0', transition: 'none' });
  const duration = reduced ? 0 : 850;
  const movement = art.animate([
    { transform: `translate(${startX}px, ${startY}px) scale(${scale})` },
    { transform: `translate(${endX}px, ${endY}px) scale(${zoom})` },
  ], { duration, easing: 'cubic-bezier(.22,.7,.18,1)', fill: 'forwards' });
  try { await movement.finished; } catch { return; }
  if (generation !== entryGeneration) return;
  landing.classList.add('handoff');
  await Promise.all([controller.revealPlayer(), delay(reduced ? 0 : 240)]);
  if (generation !== entryGeneration) return;
  syncRoute();
}
document.querySelector('[data-enter]')?.addEventListener('click', event => {
  const mouse = event as MouseEvent;
  if (mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey) return;
  event.preventDefault(); void enter();
});
window.addEventListener('keydown', event => {
  if (location.pathname !== '/' || event.ctrlKey || event.metaKey || event.altKey || (event.target as Element)?.closest('input, textarea, button, a')) return;
  if (['s', 'arrowdown'].includes(event.key.toLowerCase())) { event.preventDefault(); void enter(); }
});
let distance = 0;
window.addEventListener('wheel', event => { if (location.pathname !== '/') return; distance = Math.max(0, distance + event.deltaY); if (distance > 80) void enter(); }, { passive: true });
let touchY = 0;
window.addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY ?? 0; }, { passive: true });
window.addEventListener('touchend', event => { if (location.pathname === '/' && touchY - (event.changedTouches[0]?.clientY ?? touchY) > 70) void enter(); }, { passive: true });
