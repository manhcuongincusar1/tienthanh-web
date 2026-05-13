#!/usr/bin/env node
// Verify dist/index.html injects every sync chunk file at dist/ root.
// Catches the "splash forever" bug class: custom splitChunks tạo vendor.*.js
// nhưng html-webpack-plugin không inject script tag → entry queue
// `W.O(void 0, [...], ...)` chờ mãi → React không mount.
//
// Logic: any non-async .js file at dist/ root MUST be referenced in index.html.
// Async chunks (*.async.js, files in subdirs) are loaded on-demand by webpack
// runtime — không cần inject vào HTML.
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const HTML = path.join(DIST, 'index.html');

if (!fs.existsSync(HTML)) {
  console.error(`✗ ${HTML} not found — run umi build first.`);
  process.exit(1);
}

const html = fs.readFileSync(HTML, 'utf8');

// Files at dist/ root không cần inject vào HTML:
// - runtime-env.js: load via <script> tag riêng (đã có sẵn trong document.ejs).
// - runtime-env.template.js: template runtime-env-cra dùng để generate runtime-env.js, không load trực tiếp.
// - service-worker.js: register qua navigator.serviceWorker.register, không phải <script> tag.
const WHITELIST = new Set(['runtime-env.js', 'runtime-env.template.js', 'service-worker.js']);

const syncJsAtRoot = fs.readdirSync(DIST).filter((f) => {
  if (!f.endsWith('.js')) return false;
  if (f.endsWith('.async.js')) return false;
  if (f.endsWith('.map')) return false;
  if (WHITELIST.has(f)) return false;
  return true;
});

const orphans = syncJsAtRoot.filter((f) => !html.includes(f));

if (orphans.length) {
  console.error('✗ HTML chunks check FAILED.');
  console.error(`  Sync chunk files at dist/ root NOT referenced in index.html:`);
  for (const f of orphans) console.error(`    - ${f}`);
  console.error('');
  console.error('  Fix: add missing chunk names to `chunks: [...]` in config/config.ts.');
  console.error('  Symptom if shipped: splash spinner forever, no console error.');
  process.exit(1);
}

console.log(`✓ HTML chunks check passed — ${syncJsAtRoot.length} sync chunk(s) all injected.`);
