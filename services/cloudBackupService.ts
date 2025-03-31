import { Client, Storage, ID } from "react-native-appwrite";
import { getRecords } from "./recordService";
import { getBudgets } from "./budgetService";
import { getDeposits } from "./depositGoal";
import { encode as btoa, decode as atob } from "base-64"; // Base64 编码解码

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATA_BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_DATA_BUCKET_ID;

// 连接 Appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化 Storage 服务
const storage = new Storage(client);

// ✅ 备份数据 ➝ Base64 编码 ➝ 上传到 Appwrite
//✅ 恢复数据 ➝ 下载 Base64 ➝ 解码并解析 JSON
//这样，就能轻松实现 云备份 & 恢复 了 🚀

// 备份用户数据
export const backupUserData = async (userId: string, email: string) => {
  try {
    if (!DATA_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 获取用户所有数据
    const records = await getRecords(userId);
    const budgets = await getBudgets(userId);
    const depositGoals = await getDeposits(userId);

    // 创建备份数据对象（增加 email）
    const backupData = {
      email, // 存储用户 email
      records,
      budgets,
      depositGoals,
      backupDate: new Date().toISOString(),
    };

    // JSON 转 Base64
    const backupContent = JSON.stringify(backupData);
    const base64Content = btoa(backupContent);
    const fileName = `backup_${userId}_${Date.now()}.json`;

    // 创建文件对象
    const fileObject = {
      name: fileName,
      type: "application/json",
      size: Math.round(base64Content.length * 0.75), // 估算大小
      uri: base64Content,
    };

    // 上传备份文件
    const file = await storage.createFile(
      DATA_BUCKET_ID,
      ID.unique(),
      fileObject,
      [`user:${userId}`], // 只允许当前用户访问
    );

    return {
      fileId: file.$id,
      fileName,
      backupDate: backupData.backupDate,
    };
  } catch (error) {
    console.error("Error backing up user data:", error);
    throw error;
  }
};

// 恢复用户数据
export const restoreUserData = async (
  userId: string,
  email: string,
  fileId: string,
) => {
  try {
    if (!DATA_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 获取备份文件
    const fileResponse = await storage.getFileView(DATA_BUCKET_ID, fileId);
    const response = await fetch(fileResponse.href);
    const base64Content = await response.text();

    let backupContent;
    try {
      backupContent = atob(base64Content); // Base64 解码
    } catch (e) {
      throw new Error("Invalid backup file format");
    }

    let backupData;
    try {
      backupData = JSON.parse(backupContent);
    } catch (e) {
      throw new Error("Invalid JSON format in backup file");
    }

    // 检查数据完整性
    if (
      !backupData.records ||
      !backupData.budgets ||
      !backupData.depositGoals ||
      !backupData.email
    ) {
      throw new Error("Invalid backup data format");
    }

    // **检查 email 是否匹配**
    if (backupData.email !== email) {
      throw new Error("Email does not match backup data");
    }

    return {
      success: true,
      restoreDate: new Date().toISOString(),
      backupDate: backupData.backupDate,
      data: backupData,
    };
  } catch (error) {
    console.error("Error restoring user data:", error);
    throw error;
  }
};
