import { test, expect } from '@playwright/test';

/**
 * 主要展示頁面 E2E 測試
 * 測試隔代共學 AI 媒合系統的主要使用者介面
 */
test.describe('主要展示頁面', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('頁面載入與基本結構', () => {

    test('應該成功載入頁面並顯示正確標題', async ({ page }) => {
      await expect(page).toHaveTitle(/隔代共學|赤土崎/);
    });

    test('應該顯示主要導覽列', async ({ page }) => {
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('應該顯示 Hero 區塊', async ({ page }) => {
      const hero = page.locator('[data-testid="hero"], .hero, section').first();
      await expect(hero).toBeVisible();
    });

    test('應該包含主要 CTA 按鈕', async ({ page }) => {
      // 尋找可能的主要行動按鈕
      const ctaButton = page.locator('button:has-text("立即"), a:has-text("立即"), button:has-text("開始"), a:has-text("開始")').first();
      await expect(ctaButton).toBeVisible();
    });

  });

  test.describe('回應式設計', () => {

    test('應該在手機尺寸正常顯示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const body = page.locator('body');
      await expect(body).toBeVisible();

      // 檢查沒有水平捲軸
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test('應該在平板尺寸正常顯示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('應該在桌機尺寸正常顯示', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

  });

  test.describe('內容區塊', () => {

    test('應該顯示價值主張區塊', async ({ page }) => {
      // 尋找可能包含價值主張的區塊
      const valueSection = page.locator('section').nth(1);
      await expect(valueSection).toBeVisible();
    });

    test('應該包含相關圖片', async ({ page }) => {
      const images = page.locator('img');
      const imageCount = await images.count();
      expect(imageCount).toBeGreaterThan(0);
    });

    test('所有圖片都應該成功載入', async ({ page }) => {
      // 等待所有圖片載入
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });

  });

  test.describe('互動功能', () => {

    test('導覽連結應該可以點擊', async ({ page }) => {
      const navLinks = page.locator('nav a, nav button');
      const linkCount = await navLinks.count();

      if (linkCount > 0) {
        const firstLink = navLinks.first();
        await expect(firstLink).toBeEnabled();
      }
    });

    test('應該沒有 JavaScript 錯誤', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      expect(errors).toHaveLength(0);
    });

  });

  test.describe('效能與可訪問性', () => {

    test('頁面應該在合理時間內載入', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // 頁面應該在 3 秒內完成 DOM 載入
      expect(loadTime).toBeLessThan(3000);
    });

    test('應該有適當的語言設定', async ({ page }) => {
      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toMatch(/zh|zh-TW|zh-Hant/);
    });

    test('主要標題應該使用正確的語意標籤', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });

  });

});
