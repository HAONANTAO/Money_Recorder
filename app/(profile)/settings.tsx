import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { deleteUser, getUserByEmail } from "@/services/userManagement";
import { Ionicons } from "@expo/vector-icons"; // 引入图标库
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageService } from "@/utils/storageService";
import {
  requestNotificationPermissions,
  checkNotificationStatus,
  scheduleDailyReminder,
  openNotificationSettings,
  sendTestNotification,
} from "@/services/notificationService";

const Settings = () => {
  // Use the theme context and language context
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { language, setLanguage, translations } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isGuest, setIsGuest] = useState<boolean>();
  const [userId, setUserId] = useState("");
  const [reminderTime, setReminderTime] = useState({ hour: 20, minute: 0 });

  useEffect(() => {
    const getInitialUser = async () => {
      const isGuest = await StorageService.getIsGuest();
      setIsGuest(isGuest);
      if (!isGuest) {
        const email = await StorageService.getEmail();
        const user = await getUserByEmail(email as string);
        setUserId(user.$id);
      }
    };
    getInitialUser();
  }, []);

  // 检查通知状态
  useEffect(() => {
    const checkNotifications = async () => {
      const isEnabled = await checkNotificationStatus();
      const storedEnabled = await AsyncStorage.getItem("notificationsEnabled");
      setNotificationsEnabled(storedEnabled === "true" && isEnabled);

      // 如果通知已启用，检查提醒时间设置
      if (isEnabled && storedEnabled === "true") {
        const savedHour = await AsyncStorage.getItem("reminderHour");
        const savedMinute = await AsyncStorage.getItem("reminderMinute");
        if (savedHour && savedMinute) {
          setReminderTime({
            hour: parseInt(savedHour),
            minute: parseInt(savedMinute),
          });
          // 重新设置每日提醒
          await scheduleDailyReminder(
            parseInt(savedHour),
            parseInt(savedMinute),
          );
        }
      }
    };
    checkNotifications();
  }, []);

  // 清除缓存函数
  const handleClearCache = async () => {
    Alert.alert(
      translations.alerts.clearCache.title,
      translations.alerts.clearCache.message,
      [
        { text: translations.common.cancel, style: "cancel" },
        {
          text: translations.common.clear,
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                translations.common.success,
                translations.alerts.clearCache.success,
              );
            } catch (error) {
              Alert.alert(
                translations.common.error,
                translations.alerts.clearCache.error,
              );
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-quaternary" : "bg-gray-100"}`}>
      <BackButton navigateTo="/(tabs)/profile" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-10">
          <Text
            className={`mb-8 text-3xl font-extrabold text-center ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}>
            {translations.settings.title}
          </Text>

          <View className="gap-4 space-y-6">
            {/* Notifications 设置 */}
            <View
              className={`flex-row items-center justify-between p-4 rounded-xl shadow-md ${
                isDark ? "bg-quaternary" : "bg-white"
              }`}>
              <View className="flex-row flex-1 items-center">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={isDark ? "#60A5FA" : "#4B5563"}
                />
                <Text
                  className={`ml-4 text-lg font-semibold ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                  {translations.settings.notifications}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={async (value) => {
                  if (value) {
                    const granted = await requestNotificationPermissions();
                    if (granted) {
                      setNotificationsEnabled(true);
                      await AsyncStorage.setItem(
                        "notificationsEnabled",
                        "true",
                      );
                      await scheduleDailyReminder(
                        reminderTime.hour,
                        reminderTime.minute,
                      );
                      await AsyncStorage.setItem(
                        "reminderHour",
                        reminderTime.hour.toString(),
                      );
                      await AsyncStorage.setItem(
                        "reminderMinute",
                        reminderTime.minute.toString(),
                      );
                    } else {
                      Alert.alert(
                        translations.common.notice,
                        translations.alerts.enableNotifications,
                        [
                          { text: translations.common.cancel, style: "cancel" },
                          {
                            text: translations.common.settings,
                            onPress: openNotificationSettings,
                          },
                        ],
                      );
                    }
                  } else {
                    setNotificationsEnabled(false);
                    await AsyncStorage.setItem("notificationsEnabled", "false");
                    await Notifications.cancelAllScheduledNotificationsAsync();
                  }
                }}
              />
            </View>

            {/* 测试通知按钮 */}
            {/* {notificationsEnabled && (
              <TouchableOpacity
                onPress={async () => {
                  await sendTestNotification();
                }}
                className={`flex-row items-center justify-between p-4 rounded-xl shadow-md ${
                  isDark ? "bg-quaternary" : "bg-white"
                }`}>
                <View className="flex-row items-center">
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={isDark ? "#60A5FA" : "#4B5563"}
                  />
                  <Text
                    className={`ml-4 text-lg font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>
                    测试
                  </Text>
                </View>
              </TouchableOpacity>
            )} */}

            {/* 主题切换按钮 */}
            <TouchableOpacity
              onPress={toggleTheme} // 使用context中的toggleTheme函数
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                isDark ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={24}
                color={isDark ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.theme}:{" "}
                {theme === "light"
                  ? translations.settings.themeLight
                  : translations.settings.themeDark}
              </Text>
            </TouchableOpacity>

            {/* 清除缓存按钮 */}
            <TouchableOpacity
              onPress={handleClearCache}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                isDark ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={isDark ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.clearCache}
              </Text>
            </TouchableOpacity>

            {/* 语言切换按钮 */}
            <TouchableOpacity
              onPress={() => setLanguage(language === "en" ? "zh" : "en")}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                isDark ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="language-outline"
                size={24}
                color={isDark ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.language}:{" "}
                {language === "en" ? "English" : "中文"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Delete Account and Logout buttons */}
          <View className="gap-3 mt-12 space-y-8">
            <TouchableOpacity
              disabled={isGuest === true}
              onPress={() => {
                Alert.alert(
                  translations.common.warning,
                  translations.alerts.deleteAccountConfirm,
                  [
                    {
                      text: translations.common.cancel,
                      style: "cancel",
                    },
                    {
                      text: translations.common.confirm,
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await StorageService.setIsDeleted(true);
                          await deleteUser(userId);
                          await StorageService.clearEmail();
                          router.replace("/");
                        } catch (error) {
                          console.error("Error deleting account:", error);
                          Alert.alert(
                            translations.common.error,
                            translations.alerts.deleteAccountError,
                          );
                        }
                      },
                    },
                  ],
                );
              }}
              className={`py-2 rounded-full w-3/5 mx-auto ${
                isGuest === true ? "bg-gray-400" : "bg-red-500"
              }`}>
              <Text className="text-sm font-bold text-center text-white">
                {translations.profile.deleteAccount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await StorageService.clearEmail();
                router.replace("/");
              }}
              className="py-2 mx-auto w-3/5 rounded-full bg-secondary">
              <Text className="text-sm font-bold text-center text-white">
                {translations.profile.logout}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="relative top-52">
            <Text
              className={`text-sm text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
              {translations.settings.version}: 2.1.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
