import { initSimulation } from './js/simulation.js';
import { initScene } from './js/cinematic-controller.js?v=8';
import { initSiteUI } from './js/site-ui.js?v=8';
import { resolveViewMode } from './js/preferences.js?v=8';

// Content and navigation stay usable even if the optional 3D module cannot load.
initSimulation();
initSiteUI();
if (location.hash === '#more-work') document.querySelector('#more-work').open = true;

const staticView = resolveViewMode() === 'static';
if (!staticView && !navigator.connection?.saveData) {
  // Render the page first; the worker owns all heavy 3D work.
  requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) requestIdleCallback(initScene, { timeout: 350 });
    else setTimeout(initScene, 0);
  });
}
