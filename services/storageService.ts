/*
 * @Date: 2025-03-24 13:21:36
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 14:18:51
 * @FilePath: /Money_Recorder/services/storageService.ts
 */

import { Client, Storage, ID } from "react-native-appwrite";

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID;

// 连接Appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化Storage服务
const storage = new Storage(client);

// 上传头像图片
export const uploadAvatar = async (imageBase64: string) => {
  try {
    if (!BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    // 创建符合React Native的文件对象
    const fileName = `avatar_${Date.now()}.jpg`;
    const fileObject = {
      name: fileName,
      type: "image/jpeg",
      size: Math.round(imageBase64.length * 0.75), // 估算base64解码后的大小
      uri: imageBase64,
    };

    // 上传文件到Storage
    const file = await storage.createFile(BUCKET_ID, ID.unique(), fileObject);

    // 获取文件的预览URL
    const fileUrl = storage.getFilePreview(BUCKET_ID, file.$id);

    return fileUrl.toString();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// 删除头像图片
export const deleteAvatar = async (fileId: string) => {
  try {
    if (!BUCKET_ID) {
      throw new Error("Storage configuration is missing");
    }

    await storage.deleteFile(BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
};
