// S5/07 — Smoke suite shared setup.
// Login fixture sử dụng `storageState` cache localStorage TOKEN sau khi login lần 1.
import { test as base, expect, Page } from '@playwright/test';

export type AuthedFixtures = {
  authedPage: Page;
};

const PW_USER = process.env.PW_USER || 'admin@local.test';
const PW_PASS = process.env.PW_PASS || 'Admin123';

export const test = base.extend<AuthedFixtures>({
  authedPage: async ({ page }, use) => {
    await page.goto('/cms/user/login');
    await page.waitForLoadState('domcontentloaded');
    // Form fields use UMI Pro / Ant Design — selector dựa trên `name` attribute hoặc placeholder.
    await page.fill('input[name="username"], input[id="username"], input[type="text"]', PW_USER);
    await page.fill('input[name="password"], input[id="password"], input[type="password"]', PW_PASS);
    await page.click('button[type="submit"]');
    // Sau login redirect về dashboard hoặc trang chủ — chờ TOKEN xuất hiện trong localStorage.
    await page.waitForFunction(
      () => !!localStorage.getItem('auth_token'),
      { timeout: 10_000 },
    );
    await use(page);
  },
});

export { expect };
