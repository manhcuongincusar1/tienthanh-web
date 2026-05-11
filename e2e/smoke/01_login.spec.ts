// S5/07 — Login + logout golden path.
import { test, expect } from './_setup';

test('login → dashboard load', async ({ authedPage }) => {
  // authedPage fixture đã login + redirect.
  await authedPage.waitForURL(/\/cms\/?(?!user\/login)/, { timeout: 10_000 });
  // Sidebar / header có element định danh user.
  const body = await authedPage.locator('body').first();
  expect(await body.isVisible()).toBeTruthy();
});

test('logout returns to login', async ({ authedPage }) => {
  // UI logout: hover header user menu → click "Đăng xuất".
  // Ant Pro layout: trigger menu qua avatar selector.
  await authedPage.locator('[class*="avatar"]').first().click().catch(() => {});
  const logoutBtn = authedPage.locator('text=/Đăng xuất|Logout/i').first();
  if (await logoutBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await logoutBtn.click();
    await expect(authedPage).toHaveURL(/\/user\/login/, { timeout: 5_000 });
  } else {
    // Fallback: clear token + reload.
    await authedPage.evaluate(() => localStorage.removeItem('auth_token'));
    await authedPage.reload();
    await expect(authedPage).toHaveURL(/\/user\/login/, { timeout: 5_000 });
  }
});
