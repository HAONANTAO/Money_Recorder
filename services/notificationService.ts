/*
 * @Date: 2025-04-04 20:34:14
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-10 23:29:44
 * @FilePath: /Money_Recorder/services/notificationService.ts
 */
import * as Notifications from "expo-notifications";
import { useLanguage } from "../contexts/LanguageContext";
import { Linking } from "react-native";

// 配置全局通知处理器
// 定义如何在应用程序中显示通知
// - shouldShowAlert: 是否显示通知横幅
// - shouldPlaySound: 是否播放通知声音
// - shouldSetBadge: 是否显示应用图标角标
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 显示通知横幅
    shouldPlaySound: true, // 播放通知声音
    shouldSetBadge: false, // 不显示角标数字
  }),
});

/**
 * 请求通知权限
 * 检查并请求应用的通知权限
 * 1. 首先检查现有权限状态
 * 2. 如果未授权，则请求用户授权
 * 3. 返回最终的授权状态
 * @returns {Promise<boolean>} 如果获得授权则返回true，否则返回false
 */
export const requestNotificationPermissions = async () => {
  // 获取当前的通知权限状态
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // 如果还没有授权，请求用户授权
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // 返回是否获得了通知权限
  return finalStatus === "granted";
};

/**
 * 设置每日提醒通知
 * 配置一个每天固定时间触发的通知
 * @param {number} hour - 提醒时间（小时，24小时制），默认20点
 * @param {number} minute - 提醒时间（分钟），默认0分
 * @returns {Promise<boolean>} 设置成功返回true，失败返回false
 */
export const scheduleDailyReminder = async (
  hour: number = 8,
  minute: number = 10,
  translations: { notifications: { title: string; body: string } } = {
    notifications: {
      title: "Accounting reminder",
      body: "Don’t forget to record your spending today!",
    },
  },
) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: translations.notifications.title,
        body: translations.notifications.body,
        sound: true,
      },
      trigger: {
        type: "calendar",
        hour,
        minute,
        repeats: true,
      } as unknown as Notifications.NotificationTriggerInput, // ✅ 加这行断言！,
    });

    return true;
  } catch (error) {
    console.error("setting notification failed", error);
    return false;
  }
};

/**
 * 取消所有已设置的通知
 * 清除所有待发送的通知
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * 检查通知权限状态
 * 获取当前应用的通知权限状态
 * @returns {Promise<boolean>} 如果已授权返回true，否则返回false
 */
export const checkNotificationStatus = async () => {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
};

/**
 * 打开系统通知设置
 * 跳转到iOS系统设置中的应用通知设置页面
 */
export const openNotificationSettings = async () => {
  await Linking.openSettings();
};

/**
 * 发送测试通知
 * 用于测试通知功能是否正常工作
 * @returns {Promise<boolean>} 发送成功返回true，失败返回false
 */
export const sendTestNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "测试通知",
        body: "如果你看到这条通知，说明通知功能正常工作！",
        sound: true,
      },
      trigger: null, // 立即发送通知
    });
    return true;
  } catch (error) {
    console.error("sending test notification failed", error);
    return false;
  }
};
