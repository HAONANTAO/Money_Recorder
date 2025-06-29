import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getRecords } from "@/services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { backupUserData, restoreUserData } from "@/services/cloudBackupService";
import { Alert } from "react-native";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";

const More = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const { language } = useLanguage();

  // react-native-device-info 的库，可以用来获取应用的版本号、构建号等信息。你可以按照以下步骤集成它来动态获取版本号：
  // 可惜expo go不支持！
  const appVersion = "2.1.0";
  const [refreshing, setRefreshing] = useState(false);
  const [backupInfo, setBackupInfo] = useState({
    backupDate: "",
  });
  const [usageStats, setUsageStats] = useState({
    daysUsed: 0,
    totalRecords: 0,
    lastUpdate: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const email = await StorageService.getEmail();
      if (email) {
        const userInfo = await getUserByEmail(email);
        const records = await getRecords(userInfo.$id);
        const backupData = await StorageService.getBackupInfo();

        // 更新备份信息
        if (backupData) {
          setBackupInfo({
            backupDate: new Date(backupData.backupDate).toLocaleString(
              "zh-CN",
              { hour12: false },
            ),
          });
        }

        // 计算使用统计数据
        const totalRecords = records.length;
        const lastUpdate =
          records.length > 0
            ? new Date(
                Math.max(...records.map((r) => new Date(r.createAt).getTime())),
              )
                .toISOString()
                .split("T")[0]
            : "";

        const uniqueDates = new Set(
          records.map((r) => r.createAt.split("T")[0]),
        );
        const daysUsed = uniqueDates.size;

        setUsageStats({
          daysUsed,
          totalRecords,
          lastUpdate,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const menuItems = [
    {
      title: translations.settings.title,
      items: [
        {
          label: translations.settings.language,
          value: language === "en" ? "English" : "中文",
        },
      ],
    },
    {
      title: translations.settings.title,
      items: [
        { label: translations.settings.version, value: appVersion },
        { label: translations.settings.title, value: usageStats.lastUpdate },
      ],
    },
    {
      title: translations.stats.title,
      items: [
        {
          label: translations.stats.records,
          value: `${usageStats.daysUsed} ${translations.stats.records}`,
        },
        {
          label: translations.stats.total,
          value: `${usageStats.totalRecords} ${translations.stats.records}`,
        },
      ],
    },
  ];

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <BackButton navigateTo="/(tabs)/profile" />

      <View className="p-6 mt-20">
        <Text
          className={`text-2xl font-bold mb-6 text-center ${
            isDark ? "text-white" : "text-black"
          }`}>
          {translations.profile.more}
        </Text>

        {menuItems.map((section, sectionIndex) => (
          <View
            key={sectionIndex}
            className={`mb-6 rounded-lg overflow-hidden ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-md`}>
            <Text
              className={`px-4 py-2 text-lg font-semibold ${
                isDark ? "text-white" : "text-quaternary"
              }`}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                className={`flex-row justify-between items-center p-4 border-t ${
                  isDark ? "border-gray-600" : "border-gray-100"
                }`}>
                <Text
                  className={`${isDark ? "text-gray-200" : "text-gray-600"}`}>
                  {item.label}
                </Text>
                <Text
                  className={`font-medium ${
                    isDark ? "text-white" : "text-quaternary"
                  }`}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* buttons */}
        <View className="flex-1 gap-4 justify-center items-center w-full bg-light-blue-200">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirm Backup",
                "Are you sure you want to back up your data?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Backup Cancelled"),
                    style: "cancel",
                  },
                  {
                    text: translations.common.confirm,
                    onPress: async () => {
                      try {
                        const email = await StorageService.getEmail();
                        const userInfo = await getUserByEmail(email as string);
                        const backupResult = await backupUserData(
                          userInfo.$id,
                          email as string,
                        );
                        await StorageService.saveBackupInfo({
                          fileId: backupResult.fileId,
                          backupDate: backupResult.backupDate,
                        });
                        alert(
                          `${translations.alerts.clearCache.success} ${new Date(
                            backupResult.backupDate,
                          ).toLocaleString("zh-CN", { hour12: false })}`,
                        );
                      } catch (error) {
                        console.error("Backup failed:", error);
                        alert("Backup failed, please try again later");
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
            className={`p-4 rounded-3xl ${
              isDark ? "bg-secondary" : "bg-blue-100"
            } shadow-lg active:opacity-80 transform transition-all duration-200 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } w-80`}>
            <Text
              className={`text-lg font-medium text-center ${
                isDark ? "text-white" : "text-quaternary"
              }`}>
              {translations.settings.backup}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Confirm Restore",
                "Are you sure you want to restore your data? This will overwrite your current data.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Restore Cancelled"),
                    style: "cancel",
                  },
                  {
                    text: translations.common.confirm,
                    onPress: async () => {
                      try {
                        const email = await StorageService.getEmail();
                        const userInfo = await getUserByEmail(email as string);
                        const backupInfo = await StorageService.getBackupInfo();
                        if (!backupInfo) {
                          throw new Error(translations.record.none);
                        }
                        const result = await restoreUserData(
                          email as string,
                          backupInfo.fileId,
                          userInfo.$id,
                        );
                        alert(
                          `${translations.alerts.clearCache.success} ${new Date(
                            result.restoreDate,
                          ).toLocaleString("zh-CN", { hour12: false })}`,
                        );
                      } catch (error) {
                        console.error("Restore failed:", error);
                        alert(
                          error instanceof Error
                            ? error.message
                            : "Restore failed, Please try again later",
                        );
                      }
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
            className={`p-4 rounded-3xl ${
              isDark ? "bg-secondary" : "bg-blue-100"
            } shadow-lg active:opacity-80 transform transition-all duration-200 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } w-80`}>
            <Text
              className={`text-lg font-medium text-center ${
                isDark ? "text-white" : "text-quaternary"
              }`}>
              {translations.settings.restore}
            </Text>
          </TouchableOpacity>
          {/* Terms of Use Button */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.termsfeed.com/live/3cacc431-dc86-4318-b0c9-7c785b79577c",
              )
            }
            className={`p-4 rounded-3xl ${
              isDark ? "bg-secondary" : "bg-blue-100"
            } shadow-lg active:opacity-80 transform transition-all duration-200 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } w-80`}>
            <Text
              className={`text-lg font-medium text-center ${
                isDark ? "text-white" : "text-quaternary"
              }`}>
              {translations.settings.termsofuse}
            </Text>
          </TouchableOpacity>
          {/* Privacy Policy Button */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.termsfeed.com/live/995afd4d-fa4d-4c85-8f05-4c00d3e17928",
              )
            }
            className={`p-4 rounded-3xl ${
              isDark ? "bg-secondary" : "bg-blue-100"
            } shadow-lg active:opacity-80 transform transition-all duration-200 border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } w-80`}>
            <Text
              className={`text-lg font-medium text-center ${
                isDark ? "text-white" : "text-quaternary"
              }`}>
              {translations.settings.privacyPolicy}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default More;
