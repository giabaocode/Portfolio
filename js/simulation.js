/** A teaching model of requests that all read the same single-seat snapshot. */
export function reservationPlan({ guarded = true, requests = 5 } = {}) {
  if (!Number.isInteger(requests) || requests < 1) throw new RangeError('requests must be a positive integer');
  const outcomes = Array.from({ length: requests }, (_, i) => guarded && i > 0 ? 'conflict' : 'accepted');
  const accepted = outcomes.filter(outcome => outcome === 'accepted').length;
  return Object.freeze({ outcomes: Object.freeze(outcomes), accepted, conflicts: requests - accepted, oversold: accepted - 1, remaining: 0, version: guarded ? 2 : 1 });
}

export function initSimulation() {
  const run = document.querySelector('#run-simulation');
  if (!run) return;
  const resetButton = document.querySelector('#reset-simulation');
  const result = document.querySelector('#simulation-result');
  const seatCount = document.querySelector('#seat-count');
  const versionCount = document.querySelector('#version-count');
  const rows = [...document.querySelectorAll('.request-row')];
  const modes = [...document.querySelectorAll('[data-locking]')];
  let guarded = true;
  let generation = 0;
  let pending = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const delay = (duration, signal) => new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException('Cancelled', 'AbortError'));
    const onAbort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve(); }, duration);
    signal.addEventListener('abort', onAbort, { once: true });
  });
  function reset() {
    generation++;
    pending?.abort();
    pending = null;
    run.disabled = false;
    run.firstChild.textContent = 'Run 5 requests ';
    seatCount.textContent = '1';
    versionCount.textContent = '1';
    rows.forEach(row => { row.removeAttribute('data-state'); row.querySelector('.worker-status').textContent = 'READY'; });
    result.textContent = guarded ? 'Ready. All five requests will read version 1.' : 'Ready. Every request will read one available seat, with no coordination.';
  }
  modes.forEach(button => button.addEventListener('click', () => {
    guarded = button.dataset.locking === 'true';
    modes.forEach(mode => mode.setAttribute('aria-pressed', String(mode === button)));
    reset();
  }));
  resetButton.addEventListener('click', reset);
  run.addEventListener('click', async () => {
    reset();
    const iteration = generation;
    const controller = new AbortController();
    pending = controller;
    run.disabled = true;
    run.firstChild.textContent = 'Requests in flight ';
    result.textContent = 'All requests read the same snapshot: one seat remaining, version 1.';
    const plan = reservationPlan({ guarded });
    const step = reduced.matches ? 0 : 100;
    try {
      for (const row of rows) {
        row.dataset.state = 'reading';
        row.querySelector('.worker-status').textContent = 'READ v1';
        await delay(step, controller.signal);
      }
      await delay(reduced.matches ? 0 : 300, controller.signal);
      for (const [index, row] of rows.entries()) {
        row.dataset.state = plan.outcomes[index];
        row.querySelector('.worker-status').textContent = plan.outcomes[index] === 'accepted' ? 'COMMITTED' : 'CONFLICT';
        await delay(step, controller.signal);
      }
      if (iteration !== generation) return;
      seatCount.textContent = String(plan.remaining);
      versionCount.textContent = String(plan.version);
      result.textContent = guarded
        ? '1 commit. 4 version conflicts. Only the first update matches version 1; the seat is allocated once.'
        : '5 accepted for 1 seat. Each stale write sets availability to zero, hiding 4 extra allocations.';
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    } finally {
      if (iteration === generation) {
        pending = null;
        run.disabled = false;
        run.firstChild.textContent = 'Run a fresh round ';
      }
    }
  });
  window.addEventListener('pagehide', () => pending?.abort(), { once: true });
}
