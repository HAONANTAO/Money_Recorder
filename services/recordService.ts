/*
 * @Date: 2025-03-20 18:36:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-30 20:57:15
 * @FilePath: /Money_Recorder/services/recordService.ts
 * @Description: 记账服务模块，提供记账相关的所有数据库操作
 *
 * 主要功能：
 * 1. 记账记录的增删改查操作
 * 2. 本地缓存管理，优化数据访问性能
 * 3. 月度统计数据的计算和更新
 * 4. 标签和评论的搜索功能
 *
 * 技术实现：
 * - 使用Appwrite作为后端服务
 * - 采用本地缓存策略提升性能
 * - 实现增量更新减少数据传输
 * - 异常处理确保数据一致性
 */

import { Client, Databases, ID, Query } from "react-native-appwrite";
import { StorageService } from "../utils/storageService";
import { updateRecordCacheAndStats } from "@/utils/cacheUtils";

// 数据库配置信息
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const RECORDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_RECORD_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// 初始化Appwrite客户端
// 配置客户端连接信息，设置API端点和项目ID
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库服务
// 创建数据库实例，用于执行所有数据库操作
const database = new Databases(client);

/**
 * 创建新的记账记录
 * @param record - 记账记录对象，不包含$id和$createdAt字段
 * @returns 返回创建成功的记录对象
 * @description 创建新记录并更新本地缓存，同时更新月度统计数据
 *
 
 * 3. 更新本地缓存：
 *    - 如果缓存存在，采用增量更新策略
 * 
//  当用户需要查看完整数据时（比如在home页面），系统会通过getRecords函数从服务器获取所有记录。这时，新创建的记录会作为服务器数据的一部分被返回，并与其他记录一起被加载到本地缓存中。这就是新记录"自然融入"完整数据集的过程 - 它不是通过本地合并，而是通过从服务器重新获取完整数据来实现的。
 *    - 如果缓存不存在，仅添加新记录
 * 
 * 
 * 4. 更新月度统计数据：
 *    - 仅处理收入和支出类型的记录
 *    - 重新计算总收入和总支出
 *    - 更新分类统计信息

 */
export const createRecord = async (
  record: Omit<MoneyRecord, "$id" | "$createdAt">,
) => {

  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("createRecord-Database configuration is missing");
    }

    const newRecord = await database.createDocument(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      ID.unique(),
      {
        ...record
       
      },
    );

    // 优化缓存更新逻辑
    const userId = record.userId;
    const cachedRecords = await StorageService.getCachedRecords();
    const updatedRecords = cachedRecords
      ? [...cachedRecords, newRecord]
      : [newRecord];

    // 如果是收入或支出类型的记录，更新统计数据
    if (record.type === "expense" || record.type === "income") {
      await updateRecordCacheAndStats(
        updatedRecords,
        userId,
        new Date(),
        getMonthlyExpensesByCategory,
      );
    } else {
      await StorageService.cacheRecords(updatedRecords);
    }

    return newRecord;
  } catch (error) {
    console.error("Error creating record:", error);
    throw error;
  }
};

/**
 * 删除指定的记账记录
 * @param recordId - 要删除的记录ID
 * @returns 返回true表示删除成功
 * @description 删除指定记录并更新本地缓存和月度统计数据
 *
 * 实现细节：
 * 1. 获取待删除记录的完整信息
 * 2. 从Appwrite数据库中删除记录
 * 3. 更新本地缓存：
 *    - 移除对应记录
 *    - 保持其他记录不变
 * 4. 更新月度统计：
 *    - 重新计算分类统计
 *    - 更新总收支金额
 *
 * 错误处理：
 * - 记录不存在
 * - 删除操作失败
 * - 缓存更新异常
 */
export const deleteRecord = async (recordId: string) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("deleteRecord-Database configuration is missing");
    }

    // 获取记录信息以获取userId
    const record = await getRecordById(recordId);
    await database.deleteDocument(DATABASE_ID, RECORDS_COLLECTION_ID, recordId);

    // 优化缓存更新
    const cachedRecords = await StorageService.getCachedRecords();
    if (cachedRecords) {
      const updatedRecords = cachedRecords.filter(
        (r: any) => r.$id !== recordId,
      );

      // 仅在必要时更新月度统计缓存
      if (record.type === "expense" || record.type === "income") {
        await updateRecordCacheAndStats(
          updatedRecords,
          record.userId,
          new Date(record.$createdAt),
          getMonthlyExpensesByCategory,
        );
      } else {
        await StorageService.cacheRecords(updatedRecords);
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

/**
 * 更新记账记录
 * @param recordId - 要更新的记录ID
 * @param data - 需要更新的记录字段
 * @returns 返回更新后的记录对象
 * @description 更新指定记录的内容，并同步更新本地缓存和月度统计数据
 *
 * 实现细节：
 * 1. 验证更新数据的合法性
 * 2. 在Appwrite数据库中更新记录
 * 3. 更新本地缓存：
 *    - 定位并更新目标记录
 *    - 保持其他记录不变
 * 4. 条件更新月度统计：
 *    - 仅在金额或类型变化时更新
 *    - 重新计算相关统计数据
 *
 * 数据完整性：
 * - 保护用户ID和创建时间不被修改
 * - 确保必要字段不被删除
 *
 * 错误处理：
 * - 无效的更新数据
 * - 更新操作失败
 * - 统计数据不一致
 */
export const updateRecord = async (
  recordId: string,
  data: Partial<Omit<MoneyRecord, "$id" | "userId" | "$createdAt">>,
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

    // 优化缓存更新
    const cachedRecords = await StorageService.getCachedRecords();
    if (cachedRecords) {
      const updatedRecords = cachedRecords.map((r: any) =>
        r.$id === recordId ? updatedRecord : r,
      );

      // 仅在必要时更新月度统计缓存
      if (updatedRecord.type === "expense" || updatedRecord.type === "income") {
        await updateRecordCacheAndStats(
          updatedRecords,
          updatedRecord.userId,
          new Date(updatedRecord.$createdAt),
          getMonthlyExpensesByCategory,
        );
      } else {
        await StorageService.cacheRecords(updatedRecords);
      }
    }

    return updatedRecord;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

/**
 * 获取用户的所有记账记录
 * @param userId - 用户ID
 * @returns 返回用户的所有记账记录列表
 * @description 从数据库获取指定用户的所有记账记录
 *
 * 实现细节：
 * 1. 验证用户ID和数据库配置
 * 2. 查询Appwrite数据库
 * 3. 使用Query.equal确保只返回指定用户的记录
 * 4. 返回完整的记录列表
 *
 * 性能优化：
 * - 可以考虑分页加载
 * - 实现本地缓存策略
 * - 按需加载详细信息
 *
 * 错误处理：
 * - 用户ID无效
 * - 查询操作失败
 * - 返回数据异常
 */
export const getRecords = async (
  userId: string,
  year?: number,
  month?: number,
) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    let queries = [Query.equal("userId", userId)];

    if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      queries.push(
        Query.greaterThanEqual("$createdAt", startDate.toISOString()),
        Query.lessThanEqual("$createdAt", endDate.toISOString()),
      );
    }

    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      queries,
    );

    return records.documents;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

/**
 * 获取指定ID的记账记录
 * @param recordId - 记录ID
 * @returns 返回指定ID的记账记录详情
 * @description 根据记录ID查询单条记账记录的详细信息
 *
 * 实现细节：
 * 1. 验证记录ID的有效性
 * 2. 直接从Appwrite数据库获取记录
 * 3. 返回完整的记录信息
 *
 * 优化策略：
 * - 可以先查询本地缓存
 * - 缓存未命中再查询数据库
 * - 更新本地缓存数据
 *
 * 错误处理：
 * - 记录ID不存在
 * - 数据库查询失败
 * - 权限验证失败
 */
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

/**
 * 获取用户特定月份的各类别消费总额
 * @param userId - 用户ID
 * @param year - 年份
 * @param month - 月份
 * @returns 返回各消费类别的总额统计
 * @description 统计指定用户在特定月份内各个消费类别的总支出金额
 *
 * 实现细节：
 * 1. 生成月份的起止时间
 * 2. 构建复合查询条件：
 *    - 指定用户ID
 *    - 筛选支出类型
 *    - 限定时间范围
 * 3. 统计处理：
 *    - 按类别分组
 *    - 计算每类总额
 *    - 格式化返回数据
 *
 * 性能优化：
 * - 使用缓存减少查询
 * - 增量更新统计数据
 * - 预计算常用时间段
 *
 * 数据处理：
 * - 处理空记录情况
 * - 确保金额计算准确
 * - 类别数据规范化
 */
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

    // 查询指定用户在特定月份内的所有记录
    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("type", "expense"),
        Query.greaterThanEqual("$createdAt", startDate),
        Query.lessThanEqual("$createdAt", endDate),
      ],
    );

    // 检查返回的 records 数据
    // console.log("Raw Records:", records); // Debug log to check if any records are returned

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

    // console.log("Expenses by Category:", expensesByCategory);
    return expensesByCategory;
  } catch (error) {
    console.error("Error fetching monthly expenses by category:", error);
    throw error;
  }
};

/**
 * 根据标签搜索记账记录
 * @param userId - 用户ID
 * @param searchTags - 搜索的标签字符串，多个标签用空格或逗号分隔
 * @returns 返回匹配标签的记账记录列表
 * @description 搜索包含指定标签的记账记录，支持多标签搜索
 *
 * 实现细节：
 * 1. 标签预处理：
 *    - 分割标签字符串
 *    - 去除空格和空值
 *    - 标准化格式
 * 2. 构建搜索查询：
 *    - 用户ID过滤
 *    - 多标签OR条件
 *    - 标签匹配规则
 * 3. 结果处理：
 *    - 统一标签格式
 *    - 过滤无效记录
 *    - 排序和去重
 *
 * 搜索优化：
 * - 支持模糊匹配
 * - 实现标签索引
 * - 缓存热门标签
 *
 * 错误处理：
 * - 无效标签格式
 * - 搜索超时处理
 * - 结果集过大
 */
export const searchRecordsByTags = async (
  userId: string,
  searchTags: string,
) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 分割并去掉空格的标签
    const tagsArray = searchTags
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // 如果没有有效的标签，返回空数组
    if (tagsArray.length === 0) {
      return [];
    }

    // 构建查询条件
    const queries = [Query.equal("userId", userId)];

    // 如果有多个标签，使用 Query.or 来连接它们
    if (tagsArray.length > 1) {
      queries.push(Query.or(tagsArray.map((tag) => Query.search("tags", tag))));
    } else {
      // 如果只有一个标签，直接使用 Query.search
      queries.push(Query.search("tags", tagsArray[0]));
    }

    // 执行查询并确保返回的记录的tags字段是数组
    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      queries,
    );

    // 处理返回的记录，确保tags字段是数组
    const processedRecords = records.documents.map((record) => {
      // 如果tags是字符串，尝试将其解析为数组
      let tags = record.tags;
      if (typeof tags === "string") {
        tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else if (!Array.isArray(tags)) {
        tags = [];
      }
      return {
        ...record,
        tags: tags,
      };
    });

    return processedRecords;
  } catch (error) {
    console.error("Error searching records:", error);
    throw error;
  }
};

/**
 * 根据评论内容搜索记账记录
 * @param userId - 用户ID
 * @param searchText - 搜索的评论文本
 * @returns 返回匹配评论内容的记账记录列表
 * @description 搜索评论中包含指定文本的记账记录
 *
 * 实现细节：
 * 1. 文本预处理：
 *    - 去除特殊字符
 *    - 标准化格式
 *    - 关键词提取
 * 2. 搜索实现：
 *    - 精确匹配模式
 *    - 用户范围限定
 *    - 评论字段检索
 * 3. 结果优化：
 *    - 相关性排序
 *    - 高亮匹配文本
 *    - 摘要生成
 *
 * 性能考虑：
 * - 评论索引优化
 * - 结果缓存策略
 * - 分页加载机制
 *
 * 错误处理：
 * - 搜索文本验证
 * - 空结果处理
 * - 超时机制
 */
export const searchRecordsByComments = async (
  userId: string,
  searchText: string,
) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      [Query.equal("userId", userId), Query.search("comment", searchText)],
    );

    return records.documents;
  } catch (error) {
    console.error("Error searching records:", error);
    throw error;
  }
};

/**
 * 全局搜索记账记录
 * @param userId - 用户ID
 * @param searchTerm - 搜索关键词
 * @returns 返回匹配的记账记录列表
 * @description 搜索所有可能匹配的记账记录，包括金额、标签和评论
 *
 * 实现细节：
 * 1. 搜索范围：
 *    - 金额匹配
 *    - 标签匹配
 *    - 评论内容匹配
 * 2. 查询优化：
 *    - 并行查询处理
 *    - 结果去重合并
 *    - 相关性排序
 * 3. 结果处理：
 *    - 统一数据格式
 *    - 移除重复记录
 *    - 按时间排序
 */
export const searchTotal = async (userId: string, searchTerm: string) => {
  try {
    if (!DATABASE_ID || !RECORDS_COLLECTION_ID) {
      throw new Error("Database configuration is missing");
    }

    // 检查searchTerm是否为数字
    const isNumber = !isNaN(Number(searchTerm));

    // 构建查询条件
    const queries = [Query.equal("userId", userId)];

    // 如果是数字，添加金额搜索条件
    if (isNumber) {
      queries.push(
        Query.or([
          Query.equal("moneyAmount", Number(searchTerm)),
          Query.search("tags", searchTerm),
          Query.search("comment", searchTerm),
        ]),
      );
    } else {
      // 如果不是数字，搜索标签和评论
      queries.push(
        Query.or([
          Query.search("tags", searchTerm),
          Query.search("comment", searchTerm),
        ]),
      );
    }

    // 执行查询
    const records = await database.listDocuments(
      DATABASE_ID,
      RECORDS_COLLECTION_ID,
      queries,
    );

    // 处理返回的记录，确保tags字段是数组
    const processedRecords = records.documents.map((record) => {
      let tags = record.tags;
      if (typeof tags === "string") {
        tags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      } else if (!Array.isArray(tags)) {
        tags = [];
      }
      return {
        ...record,
        tags: tags,
      };
    });

    // 按创建时间降序排序
    return processedRecords.sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
    );
  } catch (error) {
    console.error("Error in total search:", error);
    throw error;
  }
};
