/*
 * @Date: 2025-03-21 21:40:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-21 21:46:11
 * @FilePath: /Money_Recorder/services/appwrite.ts
 */
// track the searches made by user
import { Client, Databases, Query, ID } from "react-native-appwrite";
// expo特性 简化配置dotenv.config()
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

// 连接数据库
const client = new Client()
  // 这是 Appwrite 的云服务版本的默认端点。
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID!);

// 初始化数据库
const database = new Databases(client);
