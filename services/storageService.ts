/*
 * @Date: 2025-03-23 17:00:58
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 17:08:48
 * @FilePath: /Money_Recorder/services/storageService.ts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// as const 是TypeScript的类型断言
export const StorageKeys = {
  USER_ID: "user_id",
} as const;

export const StorageService = {
  // 保存用户ID
  saveUserId: async (userId: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.USER_ID, userId);
    } catch (error) {
      console.error("Error saving userId:", error);
      throw error;
    }
  },

  // 获取用户ID
  getUserId: async () => {
    try {
      return await AsyncStorage.getItem(StorageKeys.USER_ID);
    } catch (error) {
      console.error("Error getting userId:", error);
      throw error;
    }
  },

  // 清除用户ID
  clearUserId: async () => {
    try {
      await AsyncStorage.removeItem(StorageKeys.USER_ID);
    } catch (error) {
      console.error("Error clearing userId:", error);
      throw error;
    }
  },
};
