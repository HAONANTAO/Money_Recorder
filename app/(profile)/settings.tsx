import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 引入图标库
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  checkNotificationStatus,
  cancelAllNotifications,
} from "@/services/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = () => {
  // Use the theme context and language context
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, translations } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // 检查通知状态
  useEffect(() => {
    const checkNotifications = async () => {
      const isEnabled = await AsyncStorage.getItem("notificationsEnabled");
      setNotificationsEnabled(isEnabled === "true");
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

  // 处理通知开关变化
  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyReminder();
        await AsyncStorage.setItem("notificationsEnabled", "true");
        setNotificationsEnabled(true);
        Alert.alert(
          translations.common.success,
          translations.notifications.enableSuccess,
        );
      } else {
        Alert.alert(
          translations.notifications.permissionRequired,
          translations.notifications.openSettings,
          [
            { text: translations.common.cancel, style: "cancel" },
            {
              text: translations.common.settings,
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        setNotificationsEnabled(false);
      }
    } else {
      await cancelAllNotifications();
      await AsyncStorage.setItem("notificationsEnabled", "false");
      setNotificationsEnabled(false);
      Alert.alert(
        translations.common.success,
        translations.notifications.disableSuccess,
      );
    }
  };

  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <View className="absolute left-4 top-12 z-50">
        <BackButton navigateTo="/(tabs)/profile" />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-10">
          <Text
            className={`mb-8 text-3xl font-extrabold text-center ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
            {translations.settings.title}
          </Text>

          <View className="gap-4 space-y-6">
            {/* Notifications 设置 */}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              }}
              className={`flex-row items-center justify-between p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <View className="flex-row items-center">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={theme === "dark" ? "#60A5FA" : "#4B5563"}
                />
                <Text
                  className={`ml-4 text-lg font-semibold ${
                    theme === "dark" ? "text-gray-200" : "text-gray-700"
                  }`}>
                  {translations.settings.notifications}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
            </TouchableOpacity>

            {/* 主题切换按钮 */}
            <TouchableOpacity
              onPress={toggleTheme} // 使用context中的toggleTheme函数
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name={theme === "dark" ? "sunny-outline" : "moon-outline"}
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
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
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.clearCache}
              </Text>
            </TouchableOpacity>

            {/* 语言切换按钮 */}
            <TouchableOpacity
              onPress={() => setLanguage(language === "en" ? "zh" : "en")}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="language-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.language}:{" "}
                {language === "en" ? "English" : "中文"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-16">
            <Text
              className={`text-sm text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              {translations.settings.version}: 1.0.2
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
