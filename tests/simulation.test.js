import test from 'node:test';
import assert from 'node:assert/strict';
import { reservationPlan } from '../js/simulation.js';

test('one available seat cannot be allocated more than once with the version check', () => {
  for (const requests of [1, 2, 5, 25]) {
    const result = reservationPlan({ guarded: true, requests });
    assert.equal(result.accepted, 1);
    assert.equal(result.conflicts, requests - 1);
    assert.equal(result.oversold, 0);
    assert.equal(result.remaining, 0);
    assert.equal(result.version, 2);
  }
});

test('uncoordinated stale writes can hide allocations beyond the one-seat capacity', () => {
  const result = reservationPlan({ guarded: false, requests: 5 });
  assert.equal(result.accepted, 5);
  assert.equal(result.oversold, 4);
  assert.equal(result.remaining, 0);
  assert.equal(result.conflicts, 0);
});

test('each new round starts from an independent snapshot', () => {
  const first = reservationPlan({ guarded: true });
  const second = reservationPlan({ guarded: true });
  assert.deepEqual(first, second);
  assert.notEqual(first.outcomes, second.outcomes);
  assert.ok(Object.isFrozen(first.outcomes));
});

test('invalid request counts are rejected by the teaching model', () => {
  for (const requests of [0, -1, 1.5, NaN]) assert.throws(() => reservationPlan({ requests }), RangeError);
});
