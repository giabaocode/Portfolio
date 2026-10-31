import { initSimulation } from './js/simulation.js';
import { initScene } from './js/cinematic-controller.js';

// Content and navigation stay usable even if the optional 3D module cannot load.
initSimulation();
const menu = document.querySelector('.mobile-navigation');
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
if (location.hash === '#more-work') document.querySelector('#more-work').open = true;

const staticView = new URLSearchParams(location.search).get('view') === 'static';
if (staticView) {
  const link = document.querySelector('#view-mode');
  link.href = './index.html#top';
  link.textContent = 'ENABLE 3D ↗';
}
if (!staticView && !navigator.connection?.saveData) {
  // Render the page first; the worker owns all heavy 3D work.
  requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(initScene, { timeout: 350 });
    else setTimeout(initScene, 0);
  });
}
