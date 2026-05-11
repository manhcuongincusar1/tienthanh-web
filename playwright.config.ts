// S5/07 — Smoke suite config (DECISIONS F1 + F3 + E10).
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts', '**/*.e2e.spec.ts'],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.PW_BASE_URL || 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'smoke',
      testMatch: ['**/smoke/*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'legacy-routes',
      testMatch: ['**/baseLayout.e2e.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
