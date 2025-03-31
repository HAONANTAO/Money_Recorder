import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getRecords } from "@/services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { backupUserData, restoreUserData } from "@/services/cloudBackupService";

const More = () => {
  const { theme } = useTheme();
  // React Native 提供了一个名为 react-native-device-info 的库，可以用来获取应用的版本号、构建号等信息。你可以按照以下步骤集成它来动态获取版本号：
  const appVersion = "1.0.0";
  const [usageStats, setUsageStats] = useState({
    daysUsed: 0,
    totalRecords: 0,
    lastUpdate: "",
  });

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const email = await StorageService.getEmail();
        if (email) {
          const userInfo = await getUserByEmail(email);
          const records = await getRecords(userInfo.$id);

          // 计算使用统计数据
          const totalRecords = records.length;
          const lastUpdate =
            records.length > 0
              ? new Date(
                  Math.max(
                    ...records.map((r) => new Date(r.createAt).getTime()),
                  ),
                )
                  .toISOString()
                  .split("T")[0]
              : "";

          // 计算使用天数（根据记录的不同日期数量）
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
        console.error("Error fetching usage stats:", error);
      }
    };

    fetchUsageStats();
  }, []);

  const menuItems = [
    {
      title: "Application Information",
      items: [
        { label: "Version", value: appVersion },
        { label: "Last Updated", value: usageStats.lastUpdate },
      ],
    },
    {
      title: "Usage Statistics",
      items: [
        { label: "Use days", value: `${usageStats.daysUsed} days` },
        {
          label: "Total number of records",
          value: `${usageStats.totalRecords} records`,
        },
      ],
    },
  ];

  return (
    <ScrollView
      className={`flex-1  ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <View className="p-6 mt-20">
        <Text
          className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-secondary"
          }`}>
          More
        </Text>

        {menuItems.map((section, sectionIndex) => (
          <View
            key={sectionIndex}
            className={`mb-6 rounded-lg overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <Text
              className={`px-4 py-2 text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-quaternary"
              }`}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <View
                key={itemIndex}
                className={`flex-row justify-between items-center p-4 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-100"
                }`}>
                <Text
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                  {item.label}
                </Text>
                <Text
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-quaternary"
                  }`}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.termsfeed.com/live/3cacc431-dc86-4318-b0c9-7c785b79577c",
              )
            }
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <Text
              className={`text-lg ${
                theme === "dark" ? "text-white" : "text-quaternary"
              }`}>
              Terms Of Use
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.termsfeed.com/live/995afd4d-fa4d-4c85-8f05-4c00d3e17928",
              )
            }
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <Text
              className={`text-lg ${
                theme === "dark" ? "text-white" : "text-quaternary"
              }`}>
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              try {
                const email = await StorageService.getEmail();
                const userInfo = await getUserByEmail(email as string);
                const backupResult = await backupUserData(
                  userInfo.$id,
                  email as string,
                );
                // 保存备份信息到本地存储
                await StorageService.saveBackupInfo({
                  fileId: backupResult.fileId,
                  backupDate: backupResult.backupDate,
                });
                alert(
                  `数据备份成功！备份时间: ${new Date(
                    backupResult.backupDate,
                  ).toLocaleString()}`,
                );
              } catch (error) {
                console.error("备份失败:", error);
                alert("备份失败，请稍后重试");
              }
            }}
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <Text
              className={`text-lg ${
                theme === "dark" ? "text-white" : "text-quaternary"
              }`}>
              备份数据
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              try {
                const email = await StorageService.getEmail();
                const userInfo = await getUserByEmail(email as string);

                // 从本地存储获取最新的备份信息
                const backupInfo = await StorageService.getBackupInfo();
                if (!backupInfo) {
                  throw new Error("未找到备份信息，请先进行数据备份");
                }

                // 使用本地存储的备份信息进行恢复
                const result = await restoreUserData(
                  email as string,
                  backupInfo.fileId,
                  userInfo.$id,
                );

                alert(
                  `数据恢复成功！恢复时间: ${new Date(
                    result.restoreDate,
                  ).toLocaleString()}`,
                );
              } catch (error) {
                console.error("恢复失败:", error);
                alert(
                  error instanceof Error
                    ? error.message
                    : "恢复失败，请稍后重试",
                );
              }
            }}
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-sm`}>
            <Text
              className={`text-lg ${
                theme === "dark" ? "text-white" : "text-quaternary"
              }`}>
              恢复数据
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default More;
