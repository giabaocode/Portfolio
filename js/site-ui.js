import { resolveViewMode } from './preferences.js?v=8';

export function initSiteUI() {
  const header = document.querySelector('[data-site-header]');
  const menu = header?.querySelector('.site-menu');
  const updateHeader = () => header?.classList.toggle('scrolled', scrollY > 24);
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; updateHeader(); });
  }, { passive: true });
  updateHeader();
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('pointerdown', event => {
    if (document.querySelector('dialog[open]')) return;
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu?.open || document.querySelector('dialog[open]')) return;
    menu.open = false;
    menu.querySelector('summary').focus();
  });
  const links = [...document.querySelectorAll('[data-section-link]')];
  const sections = [...new Set(links.map(link => document.getElementById(link.dataset.sectionLink)).filter(Boolean))];
  const hero = document.getElementById('top');
  if (hero) sections.unshift(hero);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          if (link.dataset.sectionLink === entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  const mode = resolveViewMode();
  document.documentElement.dataset.view = mode;
  document.querySelectorAll('[data-view-link]').forEach(link => {
    const url = new URL(link.href, location.href);
    url.searchParams.set('view', mode === 'static' ? '3d' : 'static');
    link.href = url.href;
    link.textContent = mode === 'static' ? 'Enable 3D' : 'Static view';
  });

  const feedback = document.querySelector('#copy-feedback');
  const fallback = document.querySelector('.copy-fallback');
  let timer, lastTrigger;
  function announce(message) {
    if (!feedback) return;
    clearTimeout(timer);
    feedback.textContent = message;
    feedback.classList.add('visible');
    timer = setTimeout(() => feedback.classList.remove('visible'), 4000);
  }
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    lastTrigger = button;
    try {
      await navigator.clipboard.writeText(email);
      const label = button.querySelector('[data-copy-label]');
      if (label) {
        label.textContent = 'Copied ✓';
        setTimeout(() => { label.textContent = 'Copy email'; }, 3000);
      }
      announce('Email copied. Ready to paste.');
    } catch {
      if (fallback) {
        fallback.hidden = false;
        const input = fallback.querySelector('input');
        input.value = email;
        input.focus(); input.select();
      }
      announce('Select and copy the email, or use the email link.');
    }
  }));
  document.querySelector('[data-close-copy]')?.addEventListener('click', () => {
    fallback.hidden = true;
    lastTrigger?.focus({ preventScroll: true });
  });
}
