import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 測試配置
 * 用於隔代共學 AI 媒合系統的端對端測試
 */
export default defineConfig({
  testDir: './e2e',

  // 測試超時設定
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  // 測試執行設定
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // 測試報告設定
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // 全域設定
  use: {
    // Base URL 設定
    baseURL: 'http://localhost:4173',

    // 追蹤設定
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 瀏覽器設定
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
  },

  // 測試專案(不同瀏覽器)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Web Server 設定已移除
  // 在執行測試前請手動啟動以下伺服器:
  // 1. Backend: cd server && npm run dev
  // 2. Frontend: cd frontend && python -m http.server 4173
});
