// Runs before paint. Storage is optional; the OS preference remains a safe fallback.
(() => {
  let preference;
  try { preference = localStorage.getItem('gia-bao-theme'); } catch {}
  const fallback = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = ['dark', 'light'].includes(preference) ? preference : fallback;
})();
