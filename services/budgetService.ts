/*
 * @Date: 2025-03-28 14:00:00
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 17:19:31
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

    const { year, month, category } = budget;

    // Ensure category is a valid string (non-empty)
    if (!category || typeof category !== "string" || category.trim() === "") {
      throw new Error("Category must be a valid non-empty string");
    }

    // Log the category for debugging
    console.log("Category being checked:", category);

    // Step 1: Check if a budget for the same category, year, and month already exists
    const existingBudgets = await database.listDocuments(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      [
        Query.equal("year", year),
        Query.equal("month", month),
        Query.equal("category", category), // Ensure category is a valid string
      ],
    );

    if (existingBudgets.documents.length > 0) {
      throw new Error(
        `A budget for category "${category}" already exists for ${year}-${month}`,
      );
    }

    // Step 2: Create the new budget if no existing one
    const now = new Date().toISOString();
    const newBudget = await database.createDocument(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      ID.unique(),
      {
        ...budget,
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

    // 创建一个数组，包含所有预算类别、预算金额和预算ID
    const budgetCategories = budgets.documents.map((document: any) => ({
      budgetId: document.$id, // 添加 budgetId
      category: document.category, // 预算类别
      budgetAmount: document.amount, // 预算金额
    }));

    return budgetCategories; // 返回包含 budgetId 的预算类别和金额的数组
  } catch (error) {
    console.error("Error getting monthly budget:", error);
    throw error;
  }
};

// 更新预算
export const updateBudget = async (
  documentId: string,
  data: Partial<Omit<Budget, "$id" | "userId" | "createAt" | "updateAt">>,
) => {
  try {
    if (!DATABASE_ID || !BUDGET_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const updatedBudget = await database.updateDocument(
      DATABASE_ID,
      BUDGET_COLLECTION_ID,
      documentId,
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
