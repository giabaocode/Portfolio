export function initDialogs() {
  const dialogs = [...document.querySelectorAll('dialog')];
  const triggers = new WeakMap();
  const syncScroll = () => {
    const open = dialogs.some(dialog => dialog.open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.style.overflow = open ? 'hidden' : '';
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', String(Boolean(document.querySelector('#mobile-menu[open]'))));
  };
  const close = dialog => { if (dialog?.open) dialog.close(); };
  const open = (dialog, trigger = document.activeElement) => {
    if (!dialog || dialog.open) return;
    dialogs.filter(other => other.open).forEach(close);
    triggers.set(dialog, trigger);
    dialog.showModal();
    syncScroll();
  };
  for (const dialog of dialogs) {
    dialog.addEventListener('close', () => {
      syncScroll();
      if (dialog.id === 'lightbox') dialog.querySelector('img')?.removeAttribute('src');
      const trigger = triggers.get(dialog);
      queueMicrotask(() => {
        if (!dialogs.some(item => item.open) && trigger?.isConnected) trigger.focus({ preventScroll: true });
      });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(dialog);
    });
    dialog.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => close(dialog)));
  }
  const menu = document.querySelector('#mobile-menu');
  document.querySelector('.menu-toggle')?.addEventListener('click', event => open(menu, event.currentTarget));
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close(menu)));
  const wideScreen = matchMedia('(min-width: 801px)');
  wideScreen.addEventListener('change', event => { if (event.matches) close(menu); });
  const lightbox = document.querySelector('#lightbox');
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    if (!lightbox) return;
    event.preventDefault();
    const source = link.querySelector('img');
    const caption = link.closest('figure')?.querySelector('figcaption');
    lightbox.querySelector('img').src = link.href;
    lightbox.querySelector('img').alt = source?.alt || 'Project image';
    lightbox.querySelector('figcaption').textContent = caption?.textContent || '';
    open(lightbox, link);
  }));
  return { open, close };
}
