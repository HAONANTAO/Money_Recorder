/*
 * @Date: 2025-03-21 21:44:20
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 19:41:41
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

interface MoneyRecord {
  $id: string;
  userId: string; // 关联的用户ID
  createAt: string; // 记录创建时间
  moneyAmount: number; // 金额
  type: "income" | "expense"; // 收入或支出
  category: string; // 收支类别（如餐饮、交通等）
  paymentMethod: string; // 支付方式（如现金、信用卡等）
  tags?: string; // 自定义标签（以逗号分隔的字符串）
  location?: string; // 消费地点 ！
  recurring: boolean; // 是否为周期性收支 ！
  comment?: string; // 备注说明
}

interface Budget {
  $id: string; // 文档ID
  userId: string; // 关联的用户ID
  amount: number; // 预算金额
  year: number; // 预算年份
  month: number; // 预算月份（1-12）
  createAt: string; // 创建时间
  category?: string; // 可选：特定类别的预算
  note?: string; // 可选：预算备注
}

interface Deposit {
  $id: string; // 文档ID
  userId: string; // 关联的用户ID
  amount: number; // 预算金额
  year: number; // 预算年份
  month: number; // 预算月份（1-12）
  createAt: string; // 创建时间
  category?: string; // 可选：特定类别的预算
  note?: string; // 可选：预算备注
}