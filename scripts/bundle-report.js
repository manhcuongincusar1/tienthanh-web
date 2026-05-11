#!/usr/bin/env node
/**
 * S5/10 — Đo bundle initial + total size sau khi UMI build.
 * Run: `npm run bundle:report` (build + đo) hoặc node scripts/bundle-report.js (đo only).
 *
 * Output: dist/bundle-report.json + console summary.
 * Exit 1 nếu initial gzip > BUDGET_INITIAL.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUDGET_INITIAL = 600 * 1024; // 600 KB gzipped (DECISIONS C7 — vẫn giữ moment.js).

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.error(`dist/ không tồn tại — chạy 'umi build' trước.`);
  process.exit(2);
}

function listJs(dir, base = '') {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    if (ent.isDirectory()) out.push(...listJs(path.join(dir, ent.name), rel));
    else if (ent.name.endsWith('.js') && !ent.name.endsWith('.map.js')) out.push(rel);
  }
  return out;
}

const files = listJs(distDir);
const sizes = files.map((rel) => {
  const buf = fs.readFileSync(path.join(distDir, rel));
  return {
    file: rel,
    raw: buf.length,
    gzip: zlib.gzipSync(buf).length,
  };
});

// Initial = entrypoint chunks loaded ngay khi mở trang (umi.*, vendors.*, polyfill).
// UMI 3 đặt entry name là 'umi.<hash>.js' + tách vendor sang 'vendors.<hash>.js'.
const initialPattern = /^(umi|vendors|polyfill)\b/;
const initial = sizes.filter((s) => initialPattern.test(path.basename(s.file)));
const initialGzip = initial.reduce((a, b) => a + b.gzip, 0);
const totalGzip = sizes.reduce((a, b) => a + b.gzip, 0);

const top10 = [...sizes].sort((a, b) => b.gzip - a.gzip).slice(0, 10).map((s) => ({
  file: s.file,
  rawKB: +(s.raw / 1024).toFixed(1),
  gzipKB: +(s.gzip / 1024).toFixed(1),
}));

const report = {
  timestamp: new Date().toISOString(),
  git: process.env.GITHUB_SHA || 'local',
  budgetInitialKB: BUDGET_INITIAL / 1024,
  initialGzipKB: +(initialGzip / 1024).toFixed(1),
  totalGzipKB: +(totalGzip / 1024).toFixed(1),
  initialFiles: initial.map((s) => s.file),
  fileCount: sizes.length,
  top10,
};

fs.writeFileSync(
  path.join(distDir, 'bundle-report.json'),
  JSON.stringify(report, null, 2),
);

console.log('--- Bundle report ---');
console.log(`Initial gzip: ${report.initialGzipKB} KB (budget ${report.budgetInitialKB} KB)`);
console.log(`Total gzip:   ${report.totalGzipKB} KB`);
console.log(`File count:   ${report.fileCount}`);
console.log(`Top 5 chunks:`);
top10.slice(0, 5).forEach((t, i) => {
  console.log(`  ${i + 1}. ${t.file} — ${t.gzipKB} KB gzip / ${t.rawKB} KB raw`);
});

if (initialGzip > BUDGET_INITIAL) {
  console.error(`\n✗ Bundle initial vượt budget (${report.initialGzipKB} > ${report.budgetInitialKB} KB)`);
  process.exit(1);
}
console.log(`\n✓ Bundle initial under budget`);
