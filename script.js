import { initDialogs } from './js/dialogs.js';
import { initSearch } from './js/search.js';
import { initSimulation } from './js/simulation.js';

const dialogs = initDialogs();
initSearch(dialogs);
initSimulation();

// Theme is progressive enhancement, never a dependency for the rest of the page.
const root = document.documentElement;
const themeButtons = [...document.querySelectorAll('.theme-toggle')];
function updateThemeLabels() {
  themeButtons.forEach(button => button.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'light' ? 'dark' : 'light'} theme`));
}
updateThemeLabels();
themeButtons.forEach(button => button.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('gia-bao-theme', root.dataset.theme); } catch {}
  updateThemeLabels();
}));

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

const header = document.querySelector('.site-header');
let scrollScheduled = false;
function updateHeader() { header?.classList.toggle('scrolled', window.scrollY > 12); }
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(() => { scrollScheduled = false; updateHeader(); });
}, { passive: true });
updateHeader();

let toastTimer;
function toast(message) {
  const element = document.querySelector('#toast');
  if (!element) return;
  clearTimeout(toastTimer);
  element.textContent = message;
  element.classList.add('visible');
  toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
}
document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
  const email = JSON.parse(document.querySelector('#profile-data')?.textContent || '{"email":"pn.giabao9705@gmail.com"}').email;
  try {
    await navigator.clipboard.writeText(email);
    toast('Email copied. Looking forward to hearing from you.');
  } catch {
    button.textContent = email;
    button.style.userSelect = 'text';
    toast('Select the email address to copy, or use the email link above.');
  }
}));

// The default archive is compact; an explicit project hash can reveal a matching row.
if (location.hash === '#more-work') {
  const archive = document.querySelector('.work-archive');
  if (archive) archive.open = true;
}
