// S5/07 — Import CSV (Multer route giữ — DECISIONS D1 ngoại lệ).
import path from 'path';
import { test, expect } from './_setup';

test.skip('import CSV via /api/import', async ({ authedPage }) => {
  // SKIP: cần fixture sample.csv với schema BĐS đúng + BE seed master_data.
  await authedPage.goto('/cms/import');
  const fixture = path.join(__dirname, '../fixtures/sample.csv');
  const fileInput = authedPage.locator('input[type="file"]').first();
  await fileInput.setInputFiles(fixture);

  const importResp = authedPage.waitForResponse((r) =>
    r.url().includes('/import') && r.request().method() === 'POST',
  );
  await authedPage.click('button:has-text("Import")');
  const res = await importResp;
  expect(res.status()).toBeLessThan(400);
});
