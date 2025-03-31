/*
 * @Date: 2025-03-23 17:00:58
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 22:29:24
 * @FilePath: /Money_Recorder/utils/storageService.ts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// as const 是TypeScript的类型断言
export const StorageKeys = {
  EMAIL: "userEmail",
  RECORDS_CACHE: "recordsCache",
  MONTHLY_STATS: "monthlyStats",
  LAST_FETCH: "lastFetch",
} as const;

export const StorageService = {
  // 保存用户ID
  saveEmail: async (email: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.EMAIL, email);
    } catch (error) {
      console.error("Error saving email:", error);
      throw error;
    }
  },

  // 获取用户ID
  getEmail: async () => {
    try {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (email === null || email === "userEmail") {
        return null;
      }
      return email;
    } catch (error) {
      console.error("Error getting email:", error);
      throw error;
    }
  },

  // 清除用户ID
  clearEmail: async () => {
    try {
      await AsyncStorage.removeItem(StorageKeys.EMAIL);
    } catch (error) {
      console.error("Error clearing email:", error);
      throw error;
    }
  },

  // 缓存记录数据
  cacheRecords: async (records: any[]) => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.RECORDS_CACHE,
        JSON.stringify(records),
      );
      await AsyncStorage.setItem(
        StorageKeys.LAST_FETCH,
        new Date().toISOString(),
      );
    } catch (error) {
      console.error("Error caching records:", error);
      throw error;
    }
  },

  // 获取缓存的记录
  getCachedRecords: async () => {
    try {
      const records = await AsyncStorage.getItem(StorageKeys.RECORDS_CACHE);
      const lastFetch = await AsyncStorage.getItem(StorageKeys.LAST_FETCH);
      if (!records || !lastFetch) return null;

      // 检查缓存是否过期（30分钟）
      const cacheAge = new Date().getTime() - new Date(lastFetch).getTime();
      if (cacheAge > 30 * 60 * 1000) return null;

      return JSON.parse(records);
    } catch (error) {
      console.error("Error getting cached records:", error);
      return null;
    }
  },

  // 缓存月度统计数据
  cacheMonthlyStats: async (stats: any) => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.MONTHLY_STATS,
        JSON.stringify(stats),
      );
    } catch (error) {
      console.error("Error caching monthly stats:", error);
      throw error;
    }
  },

  // 获取缓存的月度统计数据
  getCachedMonthlyStats: async () => {
    try {
      const stats = await AsyncStorage.getItem(StorageKeys.MONTHLY_STATS);
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error("Error getting cached monthly stats:", error);
      return null;
    }
  },
};
