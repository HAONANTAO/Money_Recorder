import { Client, Storage, ID } from "react-native-appwrite";
import { getRecords, createRecord, deleteRecord } from "./recordService";
import { getBudgets, createBudget, deleteBudget } from "./budgetService";
import { getDeposits, createDeposit, deleteDeposit } from "./depositGoal";
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
    console.log("需要备份的数据：", depositGoals);

    // 创建备份数据对象（包括 email）
    const backupData = {
      email, // 存储用户 email
      records,
      budgets,
      depositGoals,
      backupDate: new Date().toISOString(),
    };

    // JSON 转为字符串
    const backupContent = JSON.stringify(backupData);

    // 解决 Base64 编码问题：使用 UTF-8 编码并进行 Base64 编码
    const utf8Content = unescape(encodeURIComponent(backupContent)); // UTF-8 编码
    const base64Content = btoa(utf8Content); // 然后进行 Base64 编码

    const fileName = `backup_${userId}_${Date.now()}.json`;

    // 查询所有文件
    const existingFiles = await storage.listFiles(DATA_BUCKET_ID, [
      // 可以添加分页查询以防止文件过多
    ]);

    // 过滤出与当前用户 ID 相关的文件
    const userFiles = (existingFiles.files || []).filter((file) =>
      file.name.startsWith(`backup_${userId}`),
    );

    // 如果找到了旧备份文件，删除最近的一个
    if (userFiles.length > 0) {
      // 根据文件名中的时间戳排序，找到最近的备份文件
      const mostRecentFile = userFiles.sort((a, b) => {
        const aTimestamp = parseInt(a.name.split("_")[2].split(".")[0]);
        const bTimestamp = parseInt(b.name.split("_")[2].split(".")[0]);
        return bTimestamp - aTimestamp; // 降序排序
      })[0];

      // 删除最近的备份文件
      await storage.deleteFile(DATA_BUCKET_ID, mostRecentFile.$id);
      console.log(`已删除最近的备份文件: ${mostRecentFile.name}`);
    }

    // 上传新的备份文件
    const file = await storage.createFile(
      DATA_BUCKET_ID,
      ID.unique(),
      {
        name: fileName,
        type: "application/json",
        size: base64Content.length,
        uri: `data:application/json;base64,${base64Content}`,
      },
      ['read("any")', 'write("any")'], // 使用Appwrite标准权限格式
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

export const restoreUserData = async (
  email: string,
  fileId: string,
  userId: string,
) => {
  try {
    if (!DATA_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 获取备份文件
    let fileResponse;
    try {
      fileResponse = await storage.getFileView(DATA_BUCKET_ID, fileId);
    } catch (error: any) {
      if (error.code === 404) {
        throw new Error("备份文件不存在或已被删除，请检查文件ID是否正确");
      }
      throw new Error(`获取备份文件失败：${error.message}`);
    }

    let text;
    try {
      const response = await fetch(fileResponse.href);
      text = await response.text();
      if (!text) {
        throw new Error("备份文件内容为空");
      }
      console.log("获取到的原始文件内容:", text.substring(0, 100) + "...");
    } catch (error: any) {
      throw new Error(`读取备份文件内容失败：${error.message}`);
    }

    let backupData;
    try {
      // 首先尝试Base64解码，因为我们知道备份时使用了Base64编码
      const decodedContent = atob(text);
      // 尝试UTF-8解码
      const utf8Content = decodeURIComponent(escape(decodedContent));
      backupData = JSON.parse(utf8Content);
      console.log(
        "成功解析备份数据，包含字段:",
        Object.keys(backupData).join(", "),
      );
    } catch (e) {
      // 如果Base64解码失败，尝试直接解析JSON
      try {
        backupData = JSON.parse(text);
        console.log(
          "直接JSON解析成功，包含字段:",
          Object.keys(backupData).join(", "),
        );
      } catch (e) {
        console.error("数据解析错误:", e);
        throw new Error(
          "无法解析备份文件，文件格式可能已损坏或不是有效的备份文件。请确保文件未被修改且是通过本应用导出的备份文件。",
        );
      }
    }

    // 检查数据完整性
    if (!backupData || typeof backupData !== "object") {
      throw new Error("备份数据格式无效：不是有效的JSON对象");
    }

    // 验证必需的数据字段
    const requiredFields = [
      "records",
      "budgets",
      "depositGoals",
      "email",
      "backupDate",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in backupData),
    );

    if (missingFields.length > 0) {
      throw new Error(
        `备份数据格式无效：缺少必需字段 ${missingFields.join(", ")}`,
      );
    }

    // 验证数据类型和结构
    if (!Array.isArray(backupData.records)) {
      throw new Error("备份数据格式无效：records 不是数组类型");
    }
    // 验证budgets字段的结构
    if ("budgets" in backupData) {
      if (
        typeof backupData.budgets !== "object" ||
        backupData.budgets === null
      ) {
        throw new Error("备份数据格式无效：budgets 不是有效的对象");
      }
      if (typeof backupData.budgets.total !== "number") {
        throw new Error("备份数据格式无效：budgets.total 不是数字类型");
      }
      if (!Array.isArray(backupData.budgets.documents)) {
        throw new Error("备份数据格式无效：budgets.documents 不是数组类型");
      }
    } else {
      backupData.budgets = { total: 0, documents: [] }; // 如果不存在，初始化为空对象
    }
    if (!Array.isArray(backupData.depositGoals)) {
      throw new Error("备份数据格式无效：depositGoals 不是数组类型");
    }

    // 验证数组元素的必要字段
    backupData.records.forEach((record: any, index: number) => {
      // 检查字段是否存在且不为undefined或null
      if (
        (record.amount === undefined && record.moneyAmount === undefined) ||
        (record.amount === null && record.moneyAmount === null) ||
        record.category === undefined ||
        record.category === null ||
        record.type === undefined ||
        record.type === null
      ) {
        throw new Error(
          `备份数据格式无效：第 ${
            index + 1
          } 条记录缺少必要字段(amount/category/type)`,
        );
      }
      // 检查字段类型
      const amount = record.amount || record.moneyAmount;
      if (
        typeof amount !== "number" ||
        typeof record.category !== "string" ||
        typeof record.type !== "string"
      ) {
        throw new Error(`备份数据格式无效：第 ${index + 1} 条记录字段类型错误`);
      }
    });

    backupData.budgets.documents.forEach((budget: any, index: number) => {
      // 检查字段是否存在且不为undefined或null
      if (
        budget.amount === undefined ||
        budget.amount === null ||
        budget.category === undefined ||
        budget.category === null
      ) {
        throw new Error(
          `备份数据格式无效：第 ${
            index + 1
          } 条预算缺少必要字段(amount/category)`,
        );
      }
      // 检查字段类型
      if (
        typeof budget.amount !== "number" ||
        typeof budget.category !== "string"
      ) {
        throw new Error(`备份数据格式无效：第 ${index + 1} 条预算字段类型错误`);
      }
    });

    backupData.depositGoals.forEach((goal: any, index: number) => {
      // 检查字段是否存在且不为undefined或null
      if (
        goal.targetAmount === undefined ||
        goal.targetAmount === null ||
        goal.title === undefined ||
        goal.title === null
      ) {
        throw new Error(
          `备份数据格式无效：第 ${
            index + 1
          } 条存款目标缺少必要字段(targetAmount/title)`,
        );
      }
      // 检查字段类型
      if (
        typeof goal.targetAmount !== "number" ||
        typeof goal.title !== "string"
      ) {
        throw new Error(
          `备份数据格式无效：第 ${index + 1} 条存款目标字段类型错误`,
        );
      }
    });

    // 验证email格式
    if (
      typeof backupData.email !== "string" ||
      !backupData.email.includes("@")
    ) {
      throw new Error("备份数据格式无效：email 格式不正确");
    }

    // **检查 email 是否匹配**
    if (backupData.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error("邮箱地址与备份数据不匹配");
    }

    // 更新用户数据
    const { records, budgets, depositGoals } = backupData;

    // 获取现有数据以便清除
    const existingRecords = await getRecords(userId);
    const existingBudgets = await getBudgets(userId);
    const existingDeposits = await getDeposits(userId);

    // 清除现有数据
    await Promise.all([
      ...existingRecords.map((record) => deleteRecord(record.$id)),
      ...existingBudgets.documents.map((budget) => deleteBudget(budget.$id)),
      ...existingDeposits.map((deposit) => deleteDeposit(deposit.$id)),
    ]);

    // 恢复备份数据
    await Promise.all([
      // 更新记录
      Promise.all(
        records.map(async (record: any) => {
          // 移除所有系统属性字段
          const {
            $id,
            $databaseId,
            $collectionId,
            $createdAt,
            $updatedAt,
            $permissions,
            ...recordData
          } = record;
          recordData.userId = userId;
          await createRecord(recordData);
        }),
      ),
      // 更新预算
      Promise.all(
        budgets.documents.map(async (budget: any) => {
          // 移除所有系统属性字段
          const {
            $id,
            $databaseId,
            $collectionId,
            $createdAt,
            $updatedAt,
            $permissions,
            ...budgetData
          } = budget;
          budgetData.userId = userId;
          await createBudget(budgetData);
        }),
      ),
      // 更新存款目标
      Promise.all(
        depositGoals.map(async (goal: any) => {
          // 移除所有系统属性字段
          const {
            $id,
            $databaseId,
            $collectionId,
            $createdAt,
            $updatedAt,
            $permissions,
            ...goalData
          } = goal;
          goalData.userId = userId;
          await createDeposit(goalData);
        }),
      ),
    ]);

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
