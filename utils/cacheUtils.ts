/*
 * @Date: 2025-04-07 12:51:02
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-07 12:51:03
 * @FilePath: /Money_Recorder/utils/cacheUtils.ts
 */
import { StorageService } from "./storageService";

/**
 * 更新记录缓存并计算统计数据
 * @param records - 需要缓存的记录列表
 * @param userId - 用户ID
 * @param date - 统计日期
 * @param getMonthlyStats - 获取月度统计数据的函数
 */
export const updateRecordCacheAndStats = async (
  records: any[],
  userId: string,
  date: Date,
  getMonthlyStats: (
    userId: string,
    year: number,
    month: number,
  ) => Promise<any>,
) => {
  // 更新记录缓存
  await StorageService.cacheRecords(records);

  // 计算收入和支出总额
  const incomeTotal = records
    .filter((r: any) => r.type === "income")
    .reduce((sum: number, r: any) => sum + r.moneyAmount, 0);
  const expenseTotal = records
    .filter((r: any) => r.type === "expense")
    .reduce((sum: number, r: any) => sum + r.moneyAmount, 0);

  // 获取月度统计数据
  const monthlyStats = await getMonthlyStats(
    userId,
    date.getFullYear(),
    date.getMonth() + 1,
  );

  // 更新月度统计缓存
  await StorageService.cacheMonthlyStats({
    budgets: monthlyStats,
    expenses: monthlyStats,
    records,
    incomeTotal,
    expenseTotal,
  });
};

/**
 * 计算总收入和支出
 * @param records - 记录列表
 * @returns 返回包含总收入和支出的对象
 */
export const calculateTotals = (records: any[]) => {
  const incomeTotal = records
    .filter((r: any) => r.type === "income")
    .reduce((sum: number, r: any) => sum + r.moneyAmount, 0);
  const expenseTotal = records
    .filter((r: any) => r.type === "expense")
    .reduce((sum: number, r: any) => sum + r.moneyAmount, 0);

  return { incomeTotal, expenseTotal };
};
