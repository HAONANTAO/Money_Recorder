import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Record = () => {
  const { theme } = useTheme();
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="text-5xl font-bold text-primary">Record</Text>
    </View>
  );
};

export default Record;

const styles = StyleSheet.create({});
