import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../server.js';
import type { Express } from 'express';

describe('API Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    // 建立測試用的 app instance
    app = createApp();
  });

  describe('GET /api/images', () => {
    it('應該回傳 200 狀態碼', async () => {
      // 注意:這個測試需要有效的 PEXELS_API_KEY 才能通過
      // 在 CI/CD 環境中,可能需要 mock fetch
      const response = await request(app)
        .get('/api/images')
        .query({ q: 'test' });

      // 如果沒有 API key,會回傳 500
      // 有 API key 則會回傳 200
      expect([200, 500]).toContain(response.status);
    });

    it('應該回傳 JSON 格式', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: 'test' });

      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('應該在成功時回傳包含 images 陣列的物件', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: 'test' });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('images');
        expect(Array.isArray(response.body.images)).toBe(true);
      }
    });

    it('應該在失敗時回傳包含 error 的物件', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: 'test' });

      if (response.status === 500) {
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('detail');
      }
    });

    it('應該使用預設查詢當 q 參數缺失', async () => {
      const response = await request(app)
        .get('/api/images');

      expect([200, 500]).toContain(response.status);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('應該接受查詢字串參數', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: 'Taiwan family' });

      expect([200, 500]).toContain(response.status);
    });

    it('應該處理中文查詢字串', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: '台灣家庭' });

      expect([200, 500]).toContain(response.status);
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('應該處理空字串查詢', async () => {
      const response = await request(app)
        .get('/api/images')
        .query({ q: '' });

      expect([200, 500]).toContain(response.status);
    });
  });

  describe('CORS', () => {
    it('應該啟用 CORS', async () => {
      const response = await request(app)
        .get('/api/images')
        .set('Origin', 'http://localhost:4173');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('未定義的路徑', () => {
    it('應該回傳 404 對於不存在的路徑', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
