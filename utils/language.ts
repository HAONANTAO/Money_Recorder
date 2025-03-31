// 定义支持的语言类型
export type Language = "en" | "zh";

// 定义翻译内容的接口
interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

// 翻译内容
export const translations: Translations = {
  settings: {
    en: "Settings",
    zh: "设置",
  },
  notifications: {
    en: "Notifications",
    zh: "通知",
  },
  theme: {
    en: "Theme",
    zh: "主题",
  },
  light: {
    en: "Light",
    zh: "浅色",
  },
  dark: {
    en: "Dark",
    zh: "深色",
  },
  clearCache: {
    en: "Clear Cache",
    zh: "清除缓存",
  },
  clearCacheConfirm: {
    en: "Are you sure you want to clear the cache? This action cannot be undone.",
    zh: "确定要清除缓存吗？此操作无法撤销。",
  },
  cancel: {
    en: "Cancel",
    zh: "取消",
  },
  clear: {
    en: "Clear",
    zh: "清除",
  },
  success: {
    en: "Success",
    zh: "成功",
  },
  error: {
    en: "Error",
    zh: "错误",
  },
  cacheCleared: {
    en: "Cache cleared successfully!",
    zh: "缓存清除成功！",
  },
  cacheClearFailed: {
    en: "Failed to clear cache.",
    zh: "清除缓存失败。",
  },
  notificationSettings: {
    en: "Open the Notification settings?",
    zh: "是否打开通知设置？",
  },
  openSettings: {
    en: "Open Settings",
    zh: "打开设置",
  },
  notificationIOSOnly: {
    en: "This functionality is only available on iOS.",
    zh: "此功能仅在iOS设备上可用。",
  },
  appVersion: {
    en: "App Version",
    zh: "应用版本",
  },
  language: {
    en: "Language",
    zh: "语言",
  },
  english: {
    en: "English",
    zh: "英文",
  },
  chinese: {
    en: "Chinese",
    zh: "中文",
  },
};
