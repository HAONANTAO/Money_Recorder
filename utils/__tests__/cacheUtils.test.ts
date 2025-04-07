import { updateRecordCacheAndStats, calculateTotals } from '../cacheUtils';
import { StorageService } from '../storageService';

// Mock StorageService
jest.mock('../storageService', () => ({
  StorageService: {
    cacheRecords: jest.fn(),
    cacheMonthlyStats: jest.fn(),
    getCachedRecords: jest.fn(),
  },
}));

describe('cacheUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRecordCacheAndStats', () => {
    const mockRecords = [
      { type: 'income', moneyAmount: 1000 },
      { type: 'expense', moneyAmount: 500 },
      { type: 'income', moneyAmount: 2000 },
    ];
    const mockUserId = 'user123';
    const mockDate = new Date('2024-01-01');
    const mockGetMonthlyStats = jest.fn().mockResolvedValue({
      category1: 100,
      category2: 200,
    });

    it('should update cache and calculate stats correctly', async () => {
      await updateRecordCacheAndStats(
        mockRecords,
        mockUserId,
        mockDate,
        mockGetMonthlyStats
      );

      // 验证缓存记录更新
      expect(StorageService.cacheRecords).toHaveBeenCalledWith(mockRecords);

      // 验证月度统计数据获取
      expect(mockGetMonthlyStats).toHaveBeenCalledWith(
        mockUserId,
        2024,
        1
      );

      // 验证月度统计缓存更新
      expect(StorageService.cacheMonthlyStats).toHaveBeenCalledWith({
        budgets: { category1: 100, category2: 200 },
        expenses: { category1: 100, category2: 200 },
        records: mockRecords,
        incomeTotal: 3000,
        expenseTotal: 500,
      });
    });

    it('should handle empty records array', async () => {
      await updateRecordCacheAndStats(
        [],
        mockUserId,
        mockDate,
        mockGetMonthlyStats
      );

      expect(StorageService.cacheRecords).toHaveBeenCalledWith([]);
      expect(StorageService.cacheMonthlyStats).toHaveBeenCalledWith({
        budgets: { category1: 100, category2: 200 },
        expenses: { category1: 100, category2: 200 },
        records: [],
        incomeTotal: 0,
        expenseTotal: 0,
      });
    });
  });

  describe('calculateTotals', () => {
    it('should calculate totals correctly', () => {
      const mockRecords = [
        { type: 'income', moneyAmount: 1000 },
        { type: 'expense', moneyAmount: 500 },
        { type: 'income', moneyAmount: 2000 },
        { type: 'expense', moneyAmount: 300 },
      ];

      const result = calculateTotals(mockRecords);

      expect(result).toEqual({
        incomeTotal: 3000,
        expenseTotal: 800,
      });
    });

    it('should handle empty records', () => {
      const result = calculateTotals([]);

      expect(result).toEqual({
        incomeTotal: 0,
        expenseTotal: 0,
      });
    });

    it('should handle records with no valid types', () => {
      const mockRecords = [
        { type: 'unknown', moneyAmount: 1000 },
        { type: 'invalid', moneyAmount: 500 },
      ];

      const result = calculateTotals(mockRecords);

      expect(result).toEqual({
        incomeTotal: 0,
        expenseTotal: 0,
      });
    });
  });
});
