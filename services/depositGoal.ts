/*
 * @Date: 2025-03-20 18:36:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-31 14:15:28
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
  deposit: Omit<Deposit, "$id" | "createAt">,
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
        ...deposit,
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
export const deleteDeposit = async (depositId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("deleteRecord-Database configuration is missing");
    }

    await database.deleteDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
    );
    return true;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

// 更新记录
export const updateDeposit = async (
  depositId: string,
  data: Partial<Omit<MoneyRecord, "$id" | "userId" | "createAt">>,
) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
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
export const getDepositById = async (depositId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const record = await database.getDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
    );

    return record;
  } catch (error) {
    console.error("Error fetching record:", error);
    throw error;
  }
};

// 标记存款目标为已完成
export const completeDeposit = async (depositId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // Fetch the deposit record
    const depositRecord = await database.getDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
    );

    // Check if the deposit is already completed
    if (depositRecord?.completed) {
      throw new Error("This deposit has already been completed.");
    }

    // Update the deposit to completed
    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
      {
        completed: true,
      },
    );

    return updatedRecord;
  } catch (error) {
    console.error("Error completing deposit:", error);
    throw error;
  }
};

// 更新存款目标的已存金额
export const updateSaveAmount = async (
  depositId: string,
  saveAmount: Number,
) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    if (Number(saveAmount) < 0) {
      throw new Error("Save amount cannot be negative");
    }

    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
      {
        saveAmount: saveAmount,
      },
    );

    // 检查是否达到存款目标
    return await checkDepositCompletion(depositId);
  } catch (error) {
    console.error("Error updating save amount:", error);
    throw error;
  }
};

// 减少存款目标的已存金额
export const decreaseSaveAmount = async (
  depositId: string,
  decreaseAmount: Number,
) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 获取当前存款记录
    const currentDeposit = await getDepositById(depositId);
    const currentSaveAmount = Number(currentDeposit.saveAmount || 0);

    // 验证减少金额不能大于已存金额
    if (Number(decreaseAmount) > currentSaveAmount) {
      throw new Error(
        "The reduction amount cannot be greater than the deposited amount",
      );
    }

    const newSaveAmount = currentSaveAmount - Number(decreaseAmount);

    if (newSaveAmount < 0) {
      throw new Error("Decrease amount would result in negative save amount");
    }

    const updatedRecord = await database.updateDocument(
      DATABASE_ID,
      DEPOSIT_COLLECTION_ID,
      depositId,
      {
        saveAmount: newSaveAmount,
      },
    );

    return updatedRecord;
  } catch (error) {
    console.error("Error decreasing save amount:", error);
    throw error;
  }
};

// 检查存款目标是否完成
export const checkDepositCompletion = async (depositId: string) => {
  try {
    if (!DATABASE_ID || !DEPOSIT_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const deposit = await getDepositById(depositId);
    const saveAmount = Number(deposit.saveAmount || 0);
    const targetAmount = Number(deposit.amount || 0);

    // 只有在saveAmount大于等于targetAmount时才会将completed设置为true
    if (saveAmount >= targetAmount) {
      const updatedRecord = await database.updateDocument(
        DATABASE_ID,
        DEPOSIT_COLLECTION_ID,
        depositId,
        {
          completed: true,
        },
      );
      return updatedRecord;
    } else {
      // 如果saveAmount小于targetAmount，确保completed为false
      const updatedRecord = await database.updateDocument(
        DATABASE_ID,
        DEPOSIT_COLLECTION_ID,
        depositId,
        {
          completed: false,
        },
      );
      return updatedRecord;
    }

    return deposit;
  } catch (error) {
    console.error("Error checking deposit completion:", error);
    throw error;
  }
};
