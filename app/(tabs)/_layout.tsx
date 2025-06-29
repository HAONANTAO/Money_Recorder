/*
 * @Date: 2025-04-04 20:11:58
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-29 17:00:48
 * @FilePath: /Money_Recorder/app/(tabs)/_layout.tsx
 */
/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 21:07:12
 * @FilePath: /Money_Recorder/app/(tabs)/_layout.tsx
 */
import { Stack, Tabs } from "expo-router";
import ".././globals.css";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";

// 主页面的基础配置
export default function RootLayout() {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: isDark ? "#171717" : "#7ee8f824", // 浅蓝色背景
            paddingVertical: 4,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#333333" : "#33c9dc", // 边框颜色
          },
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 4,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginTop: 4,
          },
          tabBarActiveTintColor: isDark ? "#60A5FA" : "#2094f3", // 浅蓝色选中的文字颜色
          tabBarInactiveTintColor: isDark ? "#6B7280" : "#B0BEC5", // 不选中时的文字颜色
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: translations.tabs.home,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="home-outline" size={size} color={color} />
                <Text
                  className={`${
                    isDark ? "text-primary " : ""
                  } text-[10px] font-bold`}
                  numberOfLines={1}>
                  {translations.tabs.home}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: translations.tabs.stats,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons
                  name="stats-chart-outline"
                  size={size}
                  color={color}
                />
                <Text
                  className={`${
                    isDark ? "text-primary " : ""
                  } text-xs font-bold`}
                  numberOfLines={1}>
                  {translations.tabs.stats}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: translations.tabs.record,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons
                  name="add-circle-outline"
                  size={size * 1.3}
                  color={color}
                  style={{ marginBottom: -4 }} // 减小负值，调整图标与标签之间的距离
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: translations.tabs.goal,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="trophy-outline" size={size} color={color} />
                <Text
                  className={`${
                    isDark ? "text-primary " : ""
                  } text-xs font-bold`}
                  numberOfLines={1}>
                  {translations.tabs.goal}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: translations.tabs.profile,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="person-outline" size={size} color={color} />
                <Text
                  className={`${
                    isDark ? "text-primary " : ""
                  } text-xs font-bold`}
                  numberOfLines={1}>
                  {translations.tabs.profileTab}
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
