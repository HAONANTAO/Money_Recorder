/*
 * @Date: 2025-03-21 21:44:20
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 22:33:45
 * @FilePath: /Money_Recorder/interfaces/interfaces.d.ts
 */
interface User {
  $id: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  // AWS S3 存储用户头像的路径？？
  avatar: string; // 用户头像，类型为 string，通常是一个 URL
}
