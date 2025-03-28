/*
 * @Date: 2025-03-20 18:36:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 15:52:39
 * @FilePath: /Money_Recorder/services/recordService.ts
 */

import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

const RECORDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_RECORD_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// 连接数据库
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库
const database = new Databases(client);

// 创建新记录
export const createRecord = async (
  // Omit是一个工具类型，用于从一个类型中排除某些属性。在这里，record参数的类型是从MoneyRecord类型中排除了'$id'和'createAt'这两个属性的新类型。这意味着创建新记录时，不需要提供这两个字段，因为'$id'会由数据库自动生成，'createAt'会在函数内部设置为当前时间。
  record: Omit<MoneyRecord, "$id" | "createAt">,
) => {
  try {
    console.log(DATABASE_ID, RECORDS_COLLECTION_ID);
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("createRecord-Database configuration is missing");
    }

    const newRecord = await database.createDocument(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      ID.unique(),
      {
        ...record,
        createAt: new Date().toISOString(),
      },
    );

    return newRecord;
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};

// 删除记录
export const deleteRecord = async (recordId: string) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("deleteRecord-Database configuration is missing");
    }

    await database.deleteDocument(DATABASE_ID, RECORDS_COLLECTION_ID, recordId);
    return true;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

// 更新记录
export const updateRecord = async (
  recordId: string,
  data: Partial<Omit<MoneyRecord, "$id" | "userId" | "createAt">>,
) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      recordId,
      data,
    );

    return updatedRecord;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

// 获取用户的所有记录
export const getRecords = async (userId: string) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    return records.documents;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

// 获取特定记录
export const getRecordById = async (recordId: string) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const record = await database.getDocument(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      recordId,
    );

    return record;
  } catch (error) {
    console.error("Error fetching record:", error);
    throw error;
  }
};

// 获取用户特定月份的各类别消费总额

export const getMonthlyExpensesByCategory = async (
  userId: string,
  year: number,
  month: number,
) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 获取指定月份的开始和结束时间
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    console.log("Start Date:", startDate); // Debug log for start date
    console.log("End Date:", endDate); // Debug log for end date

    // 查询指定用户在特定月份内的所有记录
    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("type", "expense"),
        Query.greaterThanEqual("createAt", startDate),
        Query.lessThanEqual("createAt", endDate),
      ],
    );

    // 检查返回的 records 数据
    console.log("Raw Records:", records); // Debug log to check if any records are returned

    if (!records || !records.documents || records.documents.length === 0) {
      console.log("No records found for the specified date range and user");
      return {}; // Return empty if no records are found
    }

    // 按类别统计总额
    const expensesByCategory: { [key: string]: number } = {};
    records.documents.forEach((record: any) => {
      const { category, moneyAmount } = record;

      // 确保category是有效的
      if (category) {
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += moneyAmount; // 累加金额
      }
    });

    console.log("Expenses by Category:", expensesByCategory);
    return expensesByCategory;
  } catch (error) {
    console.error("Error fetching monthly expenses by category:", error);
    throw error;
  }
};
