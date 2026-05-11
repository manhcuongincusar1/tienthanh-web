// S5/07 — List + detail real estate.
import { test, expect } from './_setup';

test('list real estate page loads', async ({ authedPage }) => {
  // Path BĐS sell — adjust nếu route khác.
  await authedPage.goto('/cms/real-estate-sell');
  await authedPage.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  // Bảng table render — hoặc empty state, hoặc rows.
  const table = authedPage.locator('table, [class*="ProTable"], [class*="ant-table"]').first();
  await expect(table).toBeVisible({ timeout: 10_000 });
});

test.skip('detail real estate + history', async ({ authedPage }) => {
  // SKIP: cần seeded data với row id biết trước. Bật khi seed pipeline ổn định.
  await authedPage.goto('/cms/real-estate-sell');
  await authedPage.locator('table tbody tr a').first().click();
  await expect(authedPage.locator('h1, [class*="title"]')).toBeVisible();
});
