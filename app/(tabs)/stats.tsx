import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Stats = () => {
  const { theme } = useTheme();
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="text-5xl font-bold text-primary">stats</Text>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({});
