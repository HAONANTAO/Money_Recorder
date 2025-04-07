/*
 * @Date: 2025-04-07 12:52:15
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-07 12:52:16
 * @FilePath: /Money_Recorder/utils/validationUtils.ts
 */
/**
 * 通用数据验证和错误处理工具
 */

// 验证错误类
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// 数据库错误类
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

/**
 * 验证记录数据
 * @param record - 待验证的记录数据
 * @throws {ValidationError} 当数据验证失败时抛出
 */
export const validateRecord = (record: any) => {
  if (!record) {
    throw new ValidationError("Record data is required");
  }

  if (!record.userId) {
    throw new ValidationError("User ID is required");
  }

  if (!record.type) {
    throw new ValidationError("Record type is required");
  }

  if (typeof record.moneyAmount !== "number" || record.moneyAmount < 0) {
    throw new ValidationError("Invalid money amount");
  }

  if (!record.category) {
    throw new ValidationError("Category is required");
  }
};

/**
 * 验证数据库配置
 * @param databaseId - 数据库ID
 * @param collectionId - 集合ID
 * @throws {ValidationError} 当配置无效时抛出
 */
export const validateDatabaseConfig = (
  databaseId?: string,
  collectionId?: string,
) => {
  if (!databaseId || !collectionId) {
    throw new ValidationError("Database configuration is missing");
  }
};

/**
 * 处理数据库操作错误
 * @param error - 捕获的错误对象
 * @param operation - 操作名称
 * @throws {DatabaseError} 包装后的数据库错误
 */
export const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  throw new DatabaseError(`Failed to ${operation}: ${error.message}`);
};

/**
 * 验证搜索参数
 * @param userId - 用户ID
 * @param searchText - 搜索文本
 * @throws {ValidationError} 当参数无效时抛出
 */
export const validateSearchParams = (userId: string, searchText: string) => {
  if (!userId) {
    throw new ValidationError("User ID is required for search");
  }

  if (!searchText || typeof searchText !== "string") {
    throw new ValidationError("Valid search text is required");
  }
};
