/*
 * @Date: 2025-06-26 21:58:00
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-26 21:58:02
 * @FilePath: /Money_Recorder/services/homeImageStorageService.ts
 */
/*
 * @Date: 2025-04-10
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @FilePath: /Money_Recorder/services/homeImageStorageService.ts
 * @Description: 主页图片存储服务
 */

import { Client, Storage, ID } from "react-native-appwrite";

/**
 * Appwrite项目配置
 * PROJECT_ID: Appwrite项目ID，从环境变量获取
 * HOME_IMAGE_BUCKET_ID: 存储主页图片的桶ID，从环境变量获取
 */
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const HOME_IMAGE_BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_HOMEIMAGE_BUCKET_ID;

/**
 * 初始化Appwrite客户端
 * 设置API端点和项目ID
 */
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

/**
 * 初始化Appwrite存储服务
 */
const storage = new Storage(client);

/**
 * 获取主页图片
 * @description 从Appwrite存储桶中获取最新上传的主页图片
 * @param retryCount - 当前重试次数，用于处理502错误的重试机制
 * @returns 返回图片的预览URL，如果没有图片则返回null
 * @throws 如果配置缺失或发生其他错误则抛出异常
 */
export const fetchHomeImage = async (retryCount = 0): Promise<string | null> => {
  try {
    if (!HOME_IMAGE_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 获取存储桶中的文件列表
    const files = await storage.listFiles(HOME_IMAGE_BUCKET_ID);
    
    // 如果有文件，获取最新的一个
    if (files.files.length > 0) {
      const latestFile = files.files[0];
      const fileUrl = storage.getFilePreview(HOME_IMAGE_BUCKET_ID, latestFile.$id);
      return fileUrl.toString();
    }
    return null;
  } catch (error) {
    console.error("Error fetching home image:", error);
    
    // 如果是网络错误且重试次数小于3次，则等待后重试
    if (error instanceof Error && 
        error.message.includes('502: Bad') && 
        retryCount < 3) {
      const retryDelay = Math.pow(2, retryCount) * 1000; // 指数退避策略
      console.log(`Retrying in ${retryDelay}ms... (Attempt ${retryCount + 1}/3)`);
      return new Promise((resolve) => {
        setTimeout(() => {
          fetchHomeImage(retryCount + 1).then(resolve);
        }, retryDelay);
      });
    }
    throw error;
  }
};

/**
 * 从URL中提取文件ID
 * @description 从Appwrite文件预览URL中提取文件ID
 * @param url - Appwrite文件预览URL
 * @returns 返回文件ID，如果无法提取则返回null
 * @example
 * const url = "https://cloud.appwrite.io/v1/storage/files/123456/preview";
 * const fileId = getFileIdFromUrl(url); // 返回 "123456"
 */
export const getFileIdFromUrl = (url: string): string | null => {
  const match = url.match(/files\/([^\/]+)\/preview/);
  return match ? match[1] : null;
};

/**
 * 上传主页图片
 * @description 上传新的主页图片到Appwrite存储桶，如果存在旧图片则会先删除
 * @param imageBase64 - 图片的base64编码字符串（包含MIME类型前缀）
 * @param oldImageUrl - 可选，旧图片的URL，如果提供则会先删除旧图片
 * @returns 返回新上传图片的预览URL
 * @throws 如果配置缺失、上传失败或发生其他错误则抛出异常
 */
export const uploadHomeImage = async (
  imageBase64: string,
  oldImageUrl?: string,
) => {
  try {
    if (!HOME_IMAGE_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 如果存在旧图片，先删除
    if (oldImageUrl) {
      const oldFileId = getFileIdFromUrl(oldImageUrl);
      if (oldFileId) {
        try {
          await deleteHomeImage(oldFileId);
          console.log("Successfully deleted old home image");
        } catch (error) {
          // 只记录错误但不中断流程
          console.log(
            "Error deleting old home image, but continuing with upload:",
            error,
          );
        }
      }
    }

    // 创建符合React Native的文件对象
    const fileName = `home_image_${Date.now()}.jpg`;
    const fileObject = {
      name: fileName,
      type: "image/jpeg",
      size: Math.round(imageBase64.length * 0.75), // 估算base64解码后的大小
      uri: imageBase64,
    };

    // 上传文件到Storage
    const file = await storage.createFile(HOME_IMAGE_BUCKET_ID, ID.unique(), fileObject);

    // 获取文件的预览URL
    const fileUrl = storage.getFilePreview(HOME_IMAGE_BUCKET_ID, file.$id);

    // 返回文件的预览URL
    return fileUrl.toString();
  } catch (error) {
    console.error("Error uploading home image:", error);
    throw error;
  }
};

/**
 * 删除主页图片
 * @description 从Appwrite存储桶中删除指定ID的图片
 * @param fileId - 要删除的文件ID
 * @throws 如果配置缺失、删除失败或发生其他错误则抛出异常
 */
export const deleteHomeImage = async (fileId: string) => {
  try {
    if (!HOME_IMAGE_BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    await storage.deleteFile(HOME_IMAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error deleting home image:", error);
    throw error;
  }
};