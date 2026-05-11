// S5/07 — Customer list + create skeleton.
import { test, expect } from './_setup';

test('customer list page loads', async ({ authedPage }) => {
  await authedPage.goto('/cms/customers');
  await authedPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  const tableOrEmpty = authedPage.locator('table, [class*="ant-empty"]').first();
  await expect(tableOrEmpty).toBeVisible({ timeout: 10_000 });
});

test.skip('create + delete customer', async ({ authedPage }) => {
  // SKIP: cần seed + permission tạo. Bật khi cutover S1 + role super_admin sẵn sàng.
});
