export function readPreference(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export function writePreference(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* Preferences are optional. */ }
}

export function resolveViewMode() {
  const explicit = new URLSearchParams(location.search).get('view');
  if (explicit === 'static' || explicit === '3d') writePreference('gia-bao-view', explicit);
  const value = explicit === 'static' || explicit === '3d' ? explicit : readPreference('gia-bao-view', '3d');
  return value === 'static' ? 'static' : '3d';
}
