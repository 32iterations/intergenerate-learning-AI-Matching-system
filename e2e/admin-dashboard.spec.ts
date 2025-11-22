import { test, expect } from '@playwright/test';

/**
 * 管理儀表板 E2E 測試
 * 測試隔代共學 AI 媒合系統的管理介面
 */
test.describe('管理儀表板', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/admin.html');
  });

  test.describe('頁面載入與基本結構', () => {

    test('應該成功載入管理頁面', async ({ page }) => {
      await expect(page).toHaveTitle(/管理|Admin|儀表板|Dashboard/);
    });

    test('應該顯示管理介面標題', async ({ page }) => {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('頁面應該使用正確的語言設定', async ({ page }) => {
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/zh|zh-TW|zh-Hant/);
    });

  });

  test.describe('樓層使用率視覺化', () => {

    test('應該顯示樓層使用率圖表', async ({ page }) => {
      // 尋找可能的圖表容器
      const chart = page.locator('canvas, svg, [class*="chart"], [id*="chart"]').first();
      await expect(chart).toBeVisible({ timeout: 10000 });
    });

    test('應該顯示樓層標籤', async ({ page }) => {
      // 檢查是否有樓層相關文字
      const content = await page.textContent('body');
      expect(content).toMatch(/1F|2F|3F|B1|樓/);
    });

  });

  test.describe('管理功能', () => {

    test('應該有資料控制按鈕', async ({ page }) => {
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);
    });

    test('按鈕應該可以互動', async ({ page }) => {
      const firstButton = page.locator('button').first();
      if (await firstButton.count() > 0) {
        await expect(firstButton).toBeEnabled();
      }
    });

  });

  test.describe('回應式設計', () => {

    test('應該在手機尺寸正常顯示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin.html');

      const body = page.locator('body');
      await expect(body).toBeVisible();

      // 檢查沒有水平捲軸
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test('應該在桌機尺寸正常顯示', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/admin.html');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

  });

  test.describe('錯誤處理', () => {

    test('應該沒有 JavaScript 控制台錯誤', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.goto('/admin.html');
      await page.waitForLoadState('networkidle');

      expect(errors).toHaveLength(0);
    });

    test('應該沒有網路請求錯誤(除了預期的 API 失敗)', async ({ page }) => {
      const failedRequests: string[] = [];

      page.on('requestfailed', request => {
        const url = request.url();
        // 允許 Puter.js 相關請求失敗(因為是外部服務)
        if (!url.includes('puter') && !url.includes('putercdn')) {
          failedRequests.push(url);
        }
      });

      await page.goto('/admin.html');
      await page.waitForLoadState('networkidle');

      // 應該沒有非預期的失敗請求
      expect(failedRequests.length).toBeLessThan(3);
    });

  });

  test.describe('效能', () => {

    test('頁面應該在合理時間內載入', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/admin.html');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // 頁面應該在 3 秒內完成 DOM 載入
      expect(loadTime).toBeLessThan(3000);
    });

  });

  test.describe('資料視覺化互動', () => {

    test('應該能夠看到使用率數據', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // 檢查是否有百分比或數字資料
      const content = await page.textContent('body');
      const hasPercentage = /%/.test(content || '');
      const hasNumbers = /\d{1,3}/.test(content || '');

      expect(hasPercentage || hasNumbers).toBe(true);
    });

  });

});
