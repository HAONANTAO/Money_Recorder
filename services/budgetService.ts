/*
 * @Date: 2025-03-28 14:00:00
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 13:49:28
 * @FilePath: /Money_Recorder/services/budgetService.ts
 */

import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const BUDGET_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_BUDGET_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// 连接数据库
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库
const database = new Databases(client);

// 创建新预算
export const createBudget = async (
  budget: Omit<Budget, "$id" | "createAt">,
) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const now = new Date().toISOString();
    const newBudget = await database.createDocument(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      ID.unique(),
      {
        ...budget,
        createAt: now,
        updateAt: now,
      },
    );

    return newBudget;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

// 获取用户的所有预算
export const getBudgets = async (userId: string) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const budgets = await database.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    return budgets;
  } catch (error) {
    console.error("Error getting budgets:", error);
    throw error;
  }
};

// 获取用户特定月份的预算
export const getMonthlyBudget = async (
  userId: string,
  year: number,
  month: number,
) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const budgets = await database.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("year", year),
        Query.equal("month", month),
      ],
    );

    return budgets.documents[0]; // 返回当前生效的预算
  } catch (error) {
    console.error("Error getting monthly budget:", error);
    throw error;
  }
};

// 更新预算
export const updateBudget = async (
  budgetId: string,
  data: Partial<Omit<Budget, "$id" | "userId" | "createAt" | "updateAt">>,
) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const updatedBudget = await database.updateDocument(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      budgetId,
      {
        ...data,
        updateAt: new Date().toISOString(),
      },
    );

    return updatedBudget;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
};

// 删除预算
export const deleteBudget = async (budgetId: string) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    await database.deleteDocument(DATABASE_ID, BUDGET_COLLECTION_ID, budgetId);
    return true;
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
};
