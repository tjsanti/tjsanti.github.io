import { mountHall, type HallController } from '../game/hall';
import type { Exhibit } from '../data/portfolio';

export async function initGame(options: { arrival?: boolean; paused?: boolean } = {}): Promise<HallController | undefined> {
  const exhibits: Exhibit[] = JSON.parse(document.querySelector('#exhibit-manifest')!.textContent!);
  const host = document.querySelector<HTMLElement>('#hall')!;
  const shell = document.querySelector<HTMLElement>('.game-shell')!;
  const overlay = document.querySelector<HTMLElement>('.evidence-backdrop')!;
  const dialog = document.querySelector<HTMLElement>('.evidence-dialog')!;
  const reader = document.querySelector<HTMLElement>('.evidence-reader')!;
  const directory = document.querySelector<HTMLDetailsElement>('.exhibit-directory')!;
  const interactButton = document.querySelector<HTMLButtonElement>('[data-interact]')!;
  const touchInteract = document.querySelector<HTMLButtonElement>('[data-touch-interact]')!;
  let controller: HallController | undefined;
  let current: string | null = null;
  let pushedPanel = false;

  function showPanel(id: string | null) {
    current = exhibits.some(exhibit => exhibit.id === id) ? id : null;
    overlay.hidden = !current;
    shell.inert = Boolean(current);
    controller?.setPaused(Boolean(current) || location.pathname === '/');
    document.querySelectorAll<HTMLElement>('[data-evidence]').forEach(panel => { panel.hidden = panel.dataset.evidence !== current; });
    if (current) {
      controller?.markVisited(current);
      directory.open = false;
      dialog.setAttribute('aria-labelledby', `evidence-title-${current}`);
      reader.scrollTop = 0;
      dialog.focus();
    } else host.querySelector('canvas')?.focus();
  }
  function openPanel(id: string) {
    if (current || !exhibits.some(exhibit => exhibit.id === id)) return;
    const url = new URL(location.href);
    url.searchParams.set('exhibit', id);
    history.pushState({ hallPanel: true }, '', url);
    pushedPanel = true;
    showPanel(id);
  }
  function closePanel() {
    if (!current) return;
    if (pushedPanel) history.back();
    else {
      const url = new URL(location.href); url.searchParams.delete('exhibit');
      history.replaceState(null, '', url); showPanel(null);
    }
  }
  // A refresh starts a fresh visit, including the position and opened panel.
  const initialURL = new URL(location.href);
  initialURL.searchParams.delete('arrived'); initialURL.searchParams.delete('exhibit');
  if (location.pathname !== '/') history.replaceState(null, '', initialURL);
  window.addEventListener('popstate', () => {
    pushedPanel = Boolean(history.state?.hallPanel);
    showPanel(new URL(location.href).searchParams.get('exhibit'));
    if (document.querySelector('.landing')) window.dispatchEvent(new CustomEvent('hall-route-change'));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-open-exhibit]').forEach(button => button.addEventListener('click', () => openPanel(button.dataset.openExhibit!)));
  document.querySelectorAll('[data-close-panel]').forEach(button => button.addEventListener('click', closePanel));
  overlay.addEventListener('click', event => { if (event.target === overlay) closePanel(); });
  window.addEventListener('keydown', event => {
    if (!current) return;
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      // Preserve caret movement and selection in the Q&A form.
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="textbox"]')) return;
      event.preventDefault();
      reader.scrollBy(0, event.key === 'ArrowDown' ? 48 : -48);
      return;
    }
    if (event.key === 'Escape') { event.preventDefault(); closePanel(); }
    if (event.key === 'Tab') {
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('a, button, input, textarea, select, [tabindex="0"]')).filter(element => element.getClientRects().length && !element.hasAttribute('disabled'));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first?.focus(); }
    }
  });
  interactButton.addEventListener('click', () => controller?.interact());
  touchInteract.addEventListener('click', () => controller?.interact());
  const pointers = new Map<number, number[]>();
  function updateTouch() {
    const sum = [...pointers.values()].reduce((total, value) => [total[0] + value[0], total[1] + value[1]], [0, 0]);
    controller?.setDirection(sum[0], sum[1]);
  }
  document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(button => {
    button.addEventListener('pointerdown', event => {
      event.preventDefault(); button.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, button.dataset.direction!.split(',').map(Number)); updateTouch();
    });
    const release = (event: PointerEvent) => { pointers.delete(event.pointerId); updateTouch(); };
    button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
  });
  window.addEventListener('blur', () => { pointers.clear(); updateTouch(); });
  window.addEventListener('pagehide', event => {
    pointers.clear(); updateTouch();
    if (event.persisted) controller?.setPaused(true);
    else controller?.destroy();
  });
  window.addEventListener('pageshow', event => { if (event.persisted) controller?.setPaused(Boolean(current) || location.pathname === '/'); });

    try {
      await document.fonts.ready;
      controller = await mountHall(host, {
        exhibits,
        arrival: options.arrival,
        onNearby(id) {
          interactButton.disabled = touchInteract.disabled = !id;
          document.querySelector('[data-nearby-label]')!.textContent = id ? `Inspect ${exhibits.find(exhibit => exhibit.id === id)!.label}` : 'Walk to an exhibit';
        },
        onInteract: openPanel,
        onReady() { document.querySelector<HTMLElement>('.game-loading')!.hidden = true; host.dataset.ready = 'true'; host.focus(); },
      });
      controller.setPaused(Boolean(current) || Boolean(options.paused));
      return controller;
    } catch (error) {
      document.querySelector<HTMLElement>('.game-loading')!.hidden = true;
      document.querySelector<HTMLElement>('.game-failure')!.hidden = false;
      host.dataset.ready = 'failed'; console.error('Garden hall failed to load', error);
    }
}
