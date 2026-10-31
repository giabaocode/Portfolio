import { readPreference, writePreference } from './preferences.js?v=8';

export function initScene() {
  const canvas = document.querySelector('#scene');
  const art = document.querySelector('.scene-art');
  const explore = document.querySelector('#explode');
  const pause = document.querySelector('#pause-motion');
  const description = document.querySelector('#core-description');
  const compact = matchMedia('(max-width: 800px), (max-width: 1100px) and (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas.transferControlToOffscreen || !window.Worker || !window.DecompressionStream) {
    canvas.dataset.renderer = 'fallback';
    return;
  }
  const state = { expanded: false, paused: reduced.matches || readPreference('gia-bao-motion-paused') === 'true', reducedMotion: reduced.matches, pointerX: 0, pointerY: 0, visible: false };
  let worker, startupTimer, scheduled = false, failed = false;
  const events = new AbortController();
  function measure() {
    Object.assign(state, {
      width: Math.max(1, art.clientWidth), height: Math.max(1, art.clientHeight),
      viewportHeight: innerHeight, mobile: compact.matches,
      pixelRatio: Math.min(devicePixelRatio, compact.matches ? 1 : 1.25),
      heroHeight: document.querySelector('.hero').offsetHeight,
      approachTop: document.querySelector('#approach').offsetTop,
      approachBottom: document.querySelector('#approach').offsetTop + document.querySelector('#approach').offsetHeight,
      workTop: document.querySelector('#work').offsetTop,
      contactTop: document.querySelector('#contact').offsetTop,
      scroll: scrollY, hidden: document.hidden,
    });
  }
  const send = () => worker?.postMessage({ type: 'state', state });
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; send(); });
  };
  function fallback() {
    clearTimeout(startupTimer);
    failed = true;
    worker?.terminate(); worker = null;
    canvas.dataset.renderer = 'fallback';
    canvas.classList.remove('ready');
    document.body.classList.remove('ready-3d');
    explore.hidden = pause.hidden = true;
    description.textContent = 'An illustration of the systems behind the interface.';
  }
  function updatePause() {
    document.body.classList.toggle('motion-paused', state.paused);
    pause.setAttribute('aria-pressed', String(state.paused));
    pause.querySelector('.pause-symbol').textContent = state.paused ? '▷' : 'Ⅱ';
    pause.querySelector('.pause-text').textContent = state.paused ? 'Resume motion' : 'Pause motion';
  }
  function start() {
    if (worker || failed || document.hidden) return;
    measure();
    try {
      worker = new Worker(new URL('./cinematic-3d.min.js?v=8', import.meta.url), { type: 'module' });
      startupTimer = setTimeout(fallback, 15000);
      worker.addEventListener('error', fallback);
      worker.addEventListener('message', event => {
        if (event.data.type === 'fallback') return fallback();
        if (event.data.type === 'initialized') { clearTimeout(startupTimer); return; }
        if (event.data.type !== 'ready') return;
        clearTimeout(startupTimer);
        canvas.dataset.renderer = 'webgl2';
        canvas.dataset.thread = 'worker';
        canvas.classList.add('ready');
        document.body.classList.add('ready-3d');
        explore.hidden = pause.hidden = false;
        description.textContent = 'An interactive architecture sculpture.';
        // Revealing controls changes mobile flow; update section offsets after layout.
        requestAnimationFrame(() => { measure(); send(); });
      });
      const surface = canvas.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: surface, state }, [surface]);
    } catch { fallback(); }
  }
  updatePause();
  explore.addEventListener('click', () => {
    state.expanded = !state.expanded;
    explore.setAttribute('aria-pressed', String(state.expanded));
    explore.children[1].textContent = state.expanded ? 'Bring it together' : 'Explore the layers';
    description.textContent = state.expanded ? 'Input. Business rules. Data. Audit. One coherent system.' : 'An interactive architecture sculpture.';
    send();
  }, { signal: events.signal });
  pause.addEventListener('click', () => { state.paused = !state.paused; writePreference('gia-bao-motion-paused', state.paused); updatePause(); send(); }, { signal: events.signal });
  reduced.addEventListener('change', () => { state.reducedMotion = reduced.matches; state.paused = reduced.matches; updatePause(); send(); }, { signal: events.signal });
  const visibility = new IntersectionObserver(entries => {
    state.visible = entries[0].isIntersecting;
    if (state.visible) start();
    send();
  });
  visibility.observe(art);
  const resize = new ResizeObserver(() => { measure(); schedule(); });
  resize.observe(art);
  document.fonts.ready.then(() => { measure(); send(); });
  document.addEventListener('toggle', event => {
    if (event.target.matches('.work-archive')) { measure(); schedule(); }
  }, { capture: true, signal: events.signal });
  window.addEventListener('resize', () => { measure(); schedule(); }, { passive: true, signal: events.signal });
  window.addEventListener('scroll', () => {
    state.scroll = scrollY;
    const total = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('#scroll-progress').style.transform = `scaleY(${total ? scrollY / total : 0})`;
    schedule();
  }, { passive: true, signal: events.signal });
  window.addEventListener('pointermove', event => {
    if (compact.matches || state.paused || state.reducedMotion) return;
    state.pointerX = event.clientX / innerWidth * 2 - 1;
    state.pointerY = event.clientY / innerHeight * 2 - 1;
    schedule();
  }, { passive: true, signal: events.signal });
  document.addEventListener('visibilitychange', () => {
    state.hidden = document.hidden;
    if (!state.hidden && state.visible) start();
    send();
  }, { signal: events.signal });
  window.addEventListener('pagehide', event => {
    state.hidden = true;
    send();
    if (event.persisted) return;
    clearTimeout(startupTimer);
    worker?.terminate();
    visibility.disconnect(); resize.disconnect(); events.abort();
  }, { signal: events.signal });
  window.addEventListener('pageshow', event => { if (event.persisted) { measure(); send(); } }, { signal: events.signal });
}
