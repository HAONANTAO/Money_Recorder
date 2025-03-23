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
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL); // 确保使用 await
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
};
