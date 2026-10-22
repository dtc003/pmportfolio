// Unit tests for the pure helpers in public/assets/js/storyline.js.
// Run with: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const h = require('../public/assets/js/storyline.js');

test('pickFocused: nothing intersecting → null', () => {
  assert.equal(h.pickFocused([], null), null);
  assert.equal(h.pickFocused([], 3), null);
});

test('pickFocused: single chapter wins', () => {
  assert.equal(h.pickFocused([2], null), 2);
  assert.equal(h.pickFocused([5], 2), 5);
});

test('pickFocused: overlap keeps the last focused chapter', () => {
  assert.equal(h.pickFocused([2, 3], 2), 2);
  assert.equal(h.pickFocused([2, 3], 3), 3);
});

test('pickFocused: overlap without a previous pick takes the first', () => {
  assert.equal(h.pickFocused([4, 5], null), 4);
  assert.equal(h.pickFocused([4, 5], 1), 4);
});

test('formatCount: thousands separators, prefix and suffix', () => {
  assert.equal(h.formatCount(50000, '$', '+'), '$50,000+');
  assert.equal(h.formatCount(0, '$', '+'), '$0+');
  assert.equal(h.formatCount(1234.6, '', ''), '1,235');
});

test('tween: exact endpoints, clamped, monotonic', () => {
  assert.equal(h.tween(0, 100, 0), 0);
  assert.equal(h.tween(0, 100, 1), 100);
  assert.equal(h.tween(0, 100, -1), 0);
  assert.equal(h.tween(0, 100, 2), 100);
  let prev = -1;
  for (let t = 0; t <= 1; t += 0.05) {
    const v = h.tween(0, 100, t);
    assert.ok(v >= prev);
    prev = v;
  }
});

test('org graph: every edge references existing nodes', () => {
  const ids = new Set(h.ORG.nodes.map((n) => n.id));
  for (const e of h.ORG.edges) {
    assert.ok(ids.has(e.from), `missing ${e.from}`);
    assert.ok(ids.has(e.to), `missing ${e.to}`);
  }
});

test('linkedIds: includes reporting and decision links', () => {
  const r = h.linkedIds(h.ORG, 'cfo');
  assert.ok(r.nodes.includes('ceo'));
  assert.ok(r.nodes.includes('coo'));
  assert.ok(r.nodes.includes('fin'));
  assert.ok(!r.nodes.includes('cfo'));
  assert.ok(r.edges.length >= 3);
});

test('linkedIds: unknown id → empty', () => {
  assert.deepEqual(h.linkedIds(h.ORG, 'nope'), { nodes: [], edges: [] });
});

test('describeNode: readable sentence for the live region', () => {
  const s = h.describeNode(h.ORG, 'cfo');
  assert.match(s, /^CFO:/);
  assert.match(s, /reports to President & CEO/);
  assert.match(s, /budget/i);
  assert.equal(h.describeNode(h.ORG, 'nope'), '');
});

test('Ballard data: new record is 57% above the prior record', () => {
  const prior = h.DATA.ballard.find((d) => d.note === 'prior record');
  const latest = h.DATA.ballard[h.DATA.ballard.length - 1];
  assert.equal(Math.round(h.pctIncrease(prior.value, latest.value)), 57);
});

test('Sandbox data: rises from 70% to 79%', () => {
  const s = h.DATA.sandbox;
  assert.equal(s[0].value, 70);
  assert.equal(s[s.length - 1].value, 79);
});
