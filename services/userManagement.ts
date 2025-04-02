/*
 * @Date: 2025-03-20 18:36:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-02 11:46:57
 * @FilePath: /Money_Recorder/services/userManagement.ts
 */

import { Client, Databases, ID, Query } from "react-native-appwrite";
import bcrypt from "react-native-bcrypt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../utils/storageService";
import { router } from "expo-router";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const SALT_ROUNDS = 10;

// 连接数据库
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库
const database = new Databases(client);

// 创建新用户
export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    if (!DATABASE_ID || !USERS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 检查邮箱是否已存在
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // 对密码进行哈希处理
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });

    // 创建新用户文档
    const user = await database.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        username,
        email,
        password: hashedPassword,
        created_at: new Date().toISOString(),
      },
    );

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// 验证用户密码
export const verifyPassword = (password: string, hashedPassword: string) => {
  try {
    // 修改: 使用 compareSync 代替 await bcrypt.compare
    return bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.log(error);
    return false;
  }
};

// 根据邮箱获取用户信息
export const getUserByEmail = async (email: string) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      [Query.equal("email", email)],
    );
    return result.documents[0] || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 更新用户信息
export const updateUser = async (userId: string, data: Partial<User>) => {
  try {
    const user = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId,
      data,
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 更新用户头像
export const updateAvatar = async (userId: string, avatar: string) => {
  try {
    const user = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId,
      { avatar },
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 用户登录
export const loginUser = async (email: string, password: string) => {
  try {
    // 获取用户信息
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // 验证密码
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 返回用户信息（不包含密码）
    const { password: _, $id, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, userId: $id };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// 删除用户
export const deleteUser = async (userId: string) => {
  try {
    if (!DATABASE_ID || !USERS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 删除用户的所有记录
    const records = await database.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_RECORD_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    ); // 批量删除用户的所有记录

    const recordDeletions = records.documents.map((record) =>
      database.deleteDocument(
        DATABASE_ID,
        process.env.EXPO_PUBLIC_APPWRITE_RECORD_COLLECTION_ID!,
        record.$id,
      ),
    );

    // 删除用户的所有预算
    const budgets = await database.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_BUDGET_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    );

    // 批量删除用户的所有预算
    const budgetDeletions = budgets.documents.map((budget) =>
      database.deleteDocument(
        DATABASE_ID,
        process.env.EXPO_PUBLIC_APPWRITE_BUDGET_COLLECTION_ID!,
        budget.$id,
      ),
    );

    // 删除用户的所有存款目标
    const deposits = await database.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_DEPOSIT_COLLECTION_ID!,
      [Query.equal("userId", userId)],
    );

    // 批量删除用户的所有存款目标
    const depositDeletions = deposits.documents.map((deposit) =>
      database.deleteDocument(
        DATABASE_ID,
        process.env.EXPO_PUBLIC_APPWRITE_DEPOSIT_COLLECTION_ID!,
        deposit.$id,
      ),
    );

    // 并行执行所有删除操作
    await Promise.all([
      ...recordDeletions,
      ...budgetDeletions,
      ...depositDeletions,
    ]);

    // 删除用户文档
    await database.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);

    // 清除所有本地存储的数据
    await AsyncStorage.multiRemove(Object.values(StorageKeys));

    // 使用React Navigation导航到登录页面
    router.replace("/");

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
