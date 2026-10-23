import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'vial.json'), 'utf8'));

assert.equal(manifest.schema, 'osmograph.domain-pack/1');
assert.match(manifest.id, /^praisejamesx\./);
assert.ok(manifest.whatItIsNot.length > 20, 'whatItIsNot must state a real refusal');
assert.ok(Array.isArray(manifest.citations) && manifest.citations.length >= 2, 'at least two citations');
assert.ok(Array.isArray(manifest.docs) && manifest.docs.length >= 3, 'at least three docs');

for (const key of ['ui', 'homeUi']) {
  if (!manifest[key]) continue;
  const file = join(root, manifest[key].entry);
  assert.ok(existsSync(file), `${key}.entry must exist: ${manifest[key].entry}`);
  const html = readFileSync(file, 'utf8');
  assert.doesNotMatch(html, /<html[\s>]|<head[\s>]|<body[\s>]/i, `${key} must be a body fragment`);
  assert.match(html, /bridge\.onData/, `${key} must receive host data`);
  assert.match(html, /bridge\.ready/, `${key} must signal readiness`);
  assert.match(html, /bridge\.action/, `${key} must use the host action bridge`);
  assert.doesNotMatch(html, /https?:\/\/(?!www\.w3\.org)/i, `${key} must not load network resources`);
  assert.doesNotMatch(html, /\blocalStorage\b/, `${key} must not use storage directly`);
  assert.doesNotMatch(html, /\bfetch\s*\(/, `${key} must not fetch`);
  assert.doesNotMatch(html, /\bXMLHttpRequest\b/, `${key} must not use XHR`);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  assert.ok(scripts.length > 0, `${key} must contain an inline script`);
  for (const script of scripts) new Function(script);
}

console.log(`PASS ${manifest.id}@${manifest.version}`);
