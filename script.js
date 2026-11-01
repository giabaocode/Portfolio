import { initSiteUI } from './js/site-ui.js?v=8';
import { initDialogs } from './js/dialogs.js';
import { initSearch } from './js/search.js';
import { initSimulation } from './js/simulation.js';

initSiteUI();
const dialogs = initDialogs();
initSearch(dialogs);
initSimulation();

// Each scenario illustrates a design decision; there is no implied live telemetry.
const scenarios = {
  request: 'Validate the request. Apply the rules. Commit a traceable result.',
  duplicate: 'Same message, same result. An idempotency key prevents a second business operation.',
  fallback: 'AI times out. Local rules take over; the backend still owns the decision.',
};
const system = document.querySelector('.system-model');
const scenarioDescription = document.querySelector('#scenario-description');
const scenarioButtons = [...document.querySelectorAll('.scenario-controls [data-scenario]')];
scenarioButtons.forEach(button => button.addEventListener('click', () => {
  system.dataset.scenario = button.dataset.scenario;
  scenarioDescription.textContent = scenarios[button.dataset.scenario];
  scenarioButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
}));

// Reveal content once. Without JavaScript every section remains visible.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 40px 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  // Keyboard navigation can move focus into a section before it intersects the screen.
  document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('is-visible'));
}

// The default archive is compact; an explicit project hash can reveal a matching row.
if (location.hash === '#more-work') {
  const archive = document.querySelector('.work-archive');
  if (archive) archive.open = true;
}
