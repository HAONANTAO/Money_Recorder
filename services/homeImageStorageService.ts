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

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const HOME_IMAGE_BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_HOMEIMAGE_BUCKET_ID;

// 连接Appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化Storage服务
const storage = new Storage(client);

// 从URL中提取文件ID
export const getFileIdFromUrl = (url: string): string | null => {
  const match = url.match(/files\/([^\/]+)\/preview/);
  return match ? match[1] : null;
};

// 上传主页图片
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

// 删除主页图片
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