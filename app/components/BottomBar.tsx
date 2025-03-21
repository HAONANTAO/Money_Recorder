import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const tabs = [
  { name: "首页", icon: "home-outline", route: "/" },
  { name: "统计", icon: "stats-chart-outline", route: "/stats" },
  { name: "记账", icon: "add-circle-outline", route: "/record" },
  { name: "目标", icon: "trophy-outline", route: "/goals" },
  { name: "我的", icon: "person-outline", route: "/profile" },
];

const BottomBar = () => {
  const [activeTab, setActiveTab] = useState("首页");

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Link key={tab.name} href={tab.route as any} asChild>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.name)}>
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={activeTab === tab.name ? "#1E40AF" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.name ? "#1E40AF" : "#9CA3AF" },
              ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});
