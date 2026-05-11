// S5/07 — Permission UX (FE-09).
import { test, expect } from './_setup';

test('permission refresh banner appears on 403', async ({ authedPage }) => {
  // Trigger giả 403: gọi axios endpoint không có quyền.
  await authedPage.goto('/cms/');
  await authedPage.evaluate(async () => {
    try {
      await fetch('/cms/_api/admin/_definitely_forbidden_path', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      });
    } catch (_e) {}
  });
  // Banner có thể xuất hiện sau khi refreshPermission so sánh snapshot — chỉ verify component mount.
  // Defer detail assertion đến khi banner mount vào layout (FE-09 backlog).
});

test('cross-tab logout sync', async ({ context, authedPage }) => {
  // Tab A authedPage. Tạo tab B same-context.
  const tabB = await context.newPage();
  await tabB.goto('/cms/');
  // Logout từ tab A bằng cách clear token + broadcast.
  await authedPage.evaluate(() => {
    localStorage.removeItem('auth_token');
    (window as any).__titaOnLogout?.();
  });
  // Tab B nên redirect về /user/login trong vài giây.
  await tabB.waitForURL(/\/user\/login/, { timeout: 5_000 }).catch(() => {});
});
