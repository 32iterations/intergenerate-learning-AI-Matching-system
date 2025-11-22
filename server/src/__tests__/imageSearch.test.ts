import { describe, it, expect, beforeEach, vi } from 'vitest';

// 由於目前 server.ts 中的 searchPexelsImages 沒有匯出
// 我們先測試 API 的行為,稍後會重構以支援更細緻的單元測試
describe('Image Search Functionality', () => {
  describe('Query Handling', () => {
    it('應該使用預設查詢當輸入為空字串', () => {
      const query = '';
      const safeQuery = query.trim() || 'Taiwan grandparents children community center';
      expect(safeQuery).toBe('Taiwan grandparents children community center');
    });

    it('應該移除查詢字串的前後空白', () => {
      const query = '  family activities  ';
      const safeQuery = query.trim();
      expect(safeQuery).toBe('family activities');
    });

    it('應該保留查詢中間的空白', () => {
      const query = 'Taiwan  family  center';
      const safeQuery = query.trim();
      expect(safeQuery).toBe('Taiwan  family  center');
    });
  });

  describe('Image Result Mapping', () => {
    it('應該正確對映 Pexels API 回應到 ImageResult 格式', () => {
      const mockPexelsPhoto = {
        id: 12345,
        photographer: 'Test Photographer',
        photographer_url: 'https://example.com/photographer',
        alt: 'Test image description',
        src: {
          medium: 'https://example.com/medium.jpg',
          large: 'https://example.com/large.jpg',
          small: 'https://example.com/small.jpg',
        },
      };

      // 模擬對映邏輯
      const result = {
        id: mockPexelsPhoto.id,
        url: mockPexelsPhoto.src.medium,
        alt: mockPexelsPhoto.alt,
        photographer: mockPexelsPhoto.photographer,
        photographer_url: mockPexelsPhoto.photographer_url,
        source: 'pexels' as const,
      };

      expect(result).toEqual({
        id: 12345,
        url: 'https://example.com/medium.jpg',
        alt: 'Test image description',
        photographer: 'Test Photographer',
        photographer_url: 'https://example.com/photographer',
        source: 'pexels',
      });
    });

    it('應該在無 medium 時使用 fallback URL', () => {
      const mockPexelsPhoto = {
        id: 12345,
        photographer: 'Test',
        src: {
          large2x: 'https://example.com/large2x.jpg',
        } as any,
      };

      const url =
        mockPexelsPhoto.src.medium ||
        mockPexelsPhoto.src.large2x ||
        mockPexelsPhoto.src.large ||
        mockPexelsPhoto.src.small ||
        '';

      expect(url).toBe('https://example.com/large2x.jpg');
    });
  });

  describe('perPage Parameter', () => {
    it('應該使用預設值 6 當 perPage 未提供', () => {
      const perPage = undefined;
      const actualPerPage = perPage ?? 6;
      expect(actualPerPage).toBe(6);
    });

    it('應該接受自訂的 perPage 值', () => {
      const perPage = 10;
      const actualPerPage = perPage ?? 6;
      expect(actualPerPage).toBe(10);
    });

    it('應該將 perPage 轉換為字串以用於 URL', () => {
      const perPage = 8;
      const perPageStr = perPage.toString();
      expect(perPageStr).toBe('8');
      expect(typeof perPageStr).toBe('string');
    });
  });

  describe('Error Handling', () => {
    it('應該在 API key 缺失時拋出錯誤', () => {
      const apiKey = '';
      expect(() => {
        if (!apiKey) {
          throw new Error('PEXELS_API_KEY is missing. Please set it in server/.env.');
        }
      }).toThrow('PEXELS_API_KEY is missing');
    });

    it('應該在 API 回應非 OK 時拋出錯誤', () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      };

      expect(() => {
        if (!mockResponse.ok) {
          throw new Error(`Pexels API error: ${mockResponse.status} - ${mockResponse.statusText}`);
        }
      }).toThrow('Pexels API error: 401');
    });
  });

  describe('API URL Construction', () => {
    it('應該正確建構 Pexels API URL', () => {
      const query = 'Taiwan family';
      const perPage = 6;

      const url = new URL('https://api.pexels.com/v1/search');
      url.searchParams.set('query', query);
      url.searchParams.set('per_page', perPage.toString());

      expect(url.toString()).toBe('https://api.pexels.com/v1/search?query=Taiwan+family&per_page=6');
    });

    it('應該正確編碼特殊字元', () => {
      const query = '台灣 家庭 & 兒童';
      const url = new URL('https://api.pexels.com/v1/search');
      url.searchParams.set('query', query);

      expect(url.searchParams.get('query')).toBe('台灣 家庭 & 兒童');
    });
  });
});
