import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'vial.json'), 'utf8'));

assert.equal(manifest.schema, 'osmograph.domain-pack/2');
assert.match(manifest.id, /^praisejamesx\./);
assert.ok(manifest.scope.length >= 30, 'scope must name the decision this Vial supports');
assert.ok(Array.isArray(manifest.limits) && manifest.limits.length > 0, 'limits must name the operating envelope');
assert.ok(manifest.whatItIsNot.length > 20, 'whatItIsNot must state a real refusal');
assert.ok(Array.isArray(manifest.citations) && manifest.citations.length >= 2, 'at least two citations');
assert.ok(Array.isArray(manifest.docs) && manifest.docs.length >= 3, 'at least three docs');
assert.equal(manifest.ui?.runtime, 'sandbox/1', 'ui must use the host sandbox');
assert.equal(manifest.homeUi?.runtime, 'sandbox/1', 'homeUi must use the host sandbox');
assert.ok(manifest.anomaly?.baseline, 'v2 requires a baseline profile');
assert.ok(manifest.anomaly?.detection, 'v2 requires a detection profile');
assert.ok(manifest.anomaly.baseline.warmupS >= 0.5, 'baseline warmup must be at least 0.5 s');
assert.ok(manifest.anomaly.detection.minChannels >= 2, 'these domain Vials require corroboration from at least two channels');
assert.ok(manifest.anomaly.detection.alertThreshold > 0 && manifest.anomaly.detection.alertThreshold <= 1, 'the profile confidence floor must be a probability');
assert.ok(manifest.anomaly.admissibility.minCoverage > 0 && manifest.anomaly.admissibility.minCoverage <= 1, 'the coverage gate must be a fraction');
const workspace = readFileSync(join(root, manifest.ui.entry), 'utf8');
assert.match(workspace, /snapshot\.detection|\.detection\b/, 'the workspace must read the host profile verdict');
assert.match(workspace, /triggeredChannels/, 'the workspace must show which channels the profile triggered');
assert.match(workspace, /profileActive/, 'the workspace must use the profile verdict as the change call');

// Missing evidence is a warning, not a test failure: the host installs this as
// Ungated. The test must not imply a held-out report exists when it does not.
if (!manifest.evidence) {
  console.log(`NOTE ${manifest.id}@${manifest.version} has no evidence block; it is Ungated and cannot be listed.`);
} else {
  const evidence = manifest.evidence;
  assert.match(evidence.reportUrl, /^https:\/\//, 'evidence.reportUrl must be HTTPS');
  assert.ok(evidence.dataset.length >= 10, 'evidence.dataset must describe the corpus and rig');
  assert.match(evidence.measuredAt, /^\d{4}-\d{2}-\d{2}/, 'evidence.measuredAt must be an ISO date');
  assert.ok(Array.isArray(evidence.fixtures) && evidence.fixtures.length > 0, 'evidence.fixtures must contain at least one case');
}

for (const key of ['ui', 'homeUi']) {
  if (!manifest[key]) continue;
  const file = join(root, manifest[key].entry);
  assert.ok(existsSync(file), `${key}.entry must exist: ${manifest[key].entry}`);
  const html = readFileSync(file, 'utf8');
  assert.doesNotMatch(html, /<html[\s>]|<head[\s>]|<body[\s>]/i, `${key} must be a body fragment`);
  assert.match(html, /(?:bridge\.onData|HOST\.on\s*\()/, `${key} must receive host data`);
  assert.match(html, /(?:bridge\.ready|HOST\.getSnapshot)/, `${key} must signal readiness or read a snapshot`);
  assert.match(html, /bridge\.action/, `${key} must use the host action bridge`);
  assert.doesNotMatch(html, /bridge\.(?:setDetection|setTransforms|setTrajectory)\b/, `${key} must not set the profile from the UI`);
  assert.doesNotMatch(html, /https?:\/\/(?!www\.w3\.org)/i, `${key} must not load network resources`);
  assert.doesNotMatch(html, /\blocalStorage\b/, `${key} must not use storage directly`);
  assert.doesNotMatch(html, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/, `${key} must not use the network`);
  assert.doesNotMatch(html, /\beval\s*\(|new\s+Function\s*\(/, `${key} must not evaluate strings as code`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  assert.ok(scripts.length > 0, `${key} must contain an inline script`);
  for (const script of scripts) new Function(script);
}

console.log(`PASS ${manifest.id}@${manifest.version}`);
