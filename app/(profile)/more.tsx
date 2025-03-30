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
        </View>
      </View>
    </ScrollView>
  );
};

export default More;
