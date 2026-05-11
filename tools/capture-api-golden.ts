// S5/06 — Capture golden API responses cho regression check sau S1 cutover.
// Run trên prod read-only (hoặc dev seeded với data giống prod).
// Cookie / Bearer token đặt qua env (KHÔNG commit).
//
// Usage:
//   BE_URL=https://tienthanhapi.datviet.ai \
//   AUTH_BEARER='eyJ...' \
//   npx ts-node tools/capture-api-golden.ts old   # capture trước S1 cutover
//   npx ts-node tools/capture-api-golden.ts new   # capture sau S1 (vào DB PG)
//
// So sánh:
//   diff <(jq -S . tests/fixtures/golden/old/<endpoint>.json) \
//        <(jq -S . tests/fixtures/golden/new/<endpoint>.json)

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BE_URL = process.env.BE_URL || 'http://localhost:3002';
const AUTH = process.env.AUTH_BEARER || '';
const STAGE = process.argv[2] || 'old';

if (!AUTH) {
  console.error('Set AUTH_BEARER env var (admin token).');
  process.exit(1);
}

// Endpoint list — derived from FE services (audit grep -rn "request.get/post" src/services/).
// Mỗi endpoint: name (dùng làm filename), method, url, body (nếu POST).
const ENDPOINTS: Array<{
  name: string;
  method: 'GET' | 'POST';
  url: string;
  body?: object;
}> = [
  // S1 collections migrate — most critical to verify shape.
  { name: 'real_estate.list', method: 'GET', url: '/_api/real-estate?limit=10' },
  { name: 'real_estate.detail', method: 'GET', url: '/_api/real-estate/1' },
  { name: 'real_estate_history', method: 'GET', url: '/_api/real-estate/1/history' },
  { name: 'import_errors.list', method: 'GET', url: '/_api/import-errors?limit=10' },
  { name: 'subscriptions.list', method: 'GET', url: '/_api/subscriptions' },
  { name: 'permissions.list', method: 'GET', url: '/_api/permissions' },
  { name: 'settings.get', method: 'GET', url: '/_api/setting/get' },
  // Master data (cached) — verify shape stable.
  { name: 'province.list', method: 'GET', url: '/_api/province/list' },
  // Auth / me.
  { name: 'users.me', method: 'GET', url: '/_api/users/info' },
];

const outDir = path.join(__dirname, '..', 'tests', 'fixtures', 'golden', STAGE);
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const summary: Array<{ name: string; status: number | string; size: number }> = [];

  for (const ep of ENDPOINTS) {
    try {
      const res = await axios.request({
        method: ep.method,
        url: BE_URL + ep.url,
        data: ep.body,
        headers: { Authorization: `Bearer ${AUTH}` },
        validateStatus: () => true,
        timeout: 15_000,
      });
      const body = JSON.stringify(res.data, null, 2);
      fs.writeFileSync(path.join(outDir, `${ep.name}.json`), body);
      summary.push({ name: ep.name, status: res.status, size: body.length });
      console.log(`✓ ${ep.name} ${res.status} (${body.length}B)`);
    } catch (e: any) {
      summary.push({ name: ep.name, status: 'ERROR', size: 0 });
      console.error(`✗ ${ep.name}: ${e.message}`);
    }
  }

  fs.writeFileSync(
    path.join(outDir, '_summary.json'),
    JSON.stringify({ stage: STAGE, capturedAt: new Date().toISOString(), summary }, null, 2),
  );
  console.log(`\nDone. Wrote to ${outDir}`);
})();
