/*
 * @Date: 2025-03-23 17:00:58
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-31 13:21:01
 * @FilePath: /Money_Recorder/utils/storageService.ts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// as const 是TypeScript的类型断言
export const StorageKeys = {
  EMAIL: "userEmail",
  RECORDS_CACHE: "recordsCache",
  MONTHLY_STATS: "monthlyStats",
  // 如果超过30分钟，就认为缓存已过期，
  // 需要重新从服务器获取数据。这样可以确保用户看到的数据不会太旧，同时又能减少不必要的网络请求。
  LAST_FETCH: "lastFetch",
  // 存储最新的备份信息
  BACKUP_INFO: "backupInfo",
  // 标记用户是否已删除
  IS_DELETED: "isDeleted",
  // 标记用户是否为游客模式
  IS_GUEST: "isGuest",
} as const;

export const StorageService = {
  // 设置游客模式状态
  setIsGuest: async (isGuest: boolean) => {
    try {
      await AsyncStorage.setItem(StorageKeys.IS_GUEST, isGuest.toString());
    } catch (error) {
      console.error("Error setting isGuest:", error);
      throw error;
    }
  },

  // 获取游客模式状态
  getIsGuest: async () => {
    try {
      const isGuest = await AsyncStorage.getItem(StorageKeys.IS_GUEST);
      return isGuest === "true";
    } catch (error) {
      console.error("Error getting isGuest:", error);
      throw error;
    }
  },

  // 设置用户删除状态
  setIsDeleted: async (isDeleted: boolean) => {
    try {
      await AsyncStorage.setItem(StorageKeys.IS_DELETED, isDeleted.toString());
    } catch (error) {
      console.error("Error setting isDeleted:", error);
      throw error;
    }
  },

  // 获取用户删除状态
  getIsDeleted: async () => {
    try {
      const isDeleted = await AsyncStorage.getItem(StorageKeys.IS_DELETED);
      return isDeleted === "true";
    } catch (error) {
      console.error("Error getting isDeleted:", error);
      throw error;
    }
  },

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

  // 保存备份信息
  saveBackupInfo: async (backupInfo: {
    fileId: string;
    backupDate: string;
  }) => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.BACKUP_INFO,
        JSON.stringify(backupInfo),
      );
    } catch (error) {
      console.error("Error saving backup info:", error);
      throw error;
    }
  },

  // 获取备份信息
  getBackupInfo: async () => {
    try {
      const backupInfo = await AsyncStorage.getItem(StorageKeys.BACKUP_INFO);
      return backupInfo ? JSON.parse(backupInfo) : null;
    } catch (error) {
      console.error("Error getting backup info:", error);
      return null;
    }
  },
};
