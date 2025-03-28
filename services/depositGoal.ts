/*
 * @Date: 2025-03-20 18:36:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 19:45:53
 * @FilePath: /Money_Recorder/services/depositGoal.ts
 */

import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

const DEPOSIT_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_DEPOSIT_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// 连接数据库
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库
const database = new Databases(client);

// 创建新记录
export const createDeposit = async (
  // Omit是一个工具类型，用于从一个类型中排除某些属性。在这里，record参数的类型是从MoneyRecord类型中排除了'$id'和'createAt'这两个属性的新类型。这意味着创建新记录时，不需要提供这两个字段，因为'$id'会由数据库自动生成，'createAt'会在函数内部设置为当前时间。
  record: Omit<MoneyRecord, "$id" | "createAt">,
) => {
  try {
    console.log(DATABASE_ID, DEPOSIT_COLLECTION_ID);
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("createRecord-Database configuration is missing");
    }

    const newRecord = await database.createDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
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
export const deleteDeposit = async (recordId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("deleteRecord-Database configuration is missing");
    }

    await database.deleteDocument(DATABASE_ID, DEPOSIT_COLLECTION_ID, recordId);
    return true;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

// 更新记录
export const updateDeposit = async (
  recordId: string,
  data: Partial<Omit<MoneyRecord, "$id" | "userId" | "createAt">>,
) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
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
export const getDeposits = async (userId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const records = await database.listDocuments(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      [Query.equal("userId", userId)],
    );

    return records.documents;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

// 获取特定记录
export const getDepositById = async (recordId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const record = await database.getDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      recordId,
    );

    return record;
  } catch (error) {
    console.error("Error fetching record:", error);
    throw error;
  }
};
