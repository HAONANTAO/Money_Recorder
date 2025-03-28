import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getUserByEmail } from "@/services/userManagement";
import { StorageService } from "@/utils/storageService";

const Goals = () => {
  const { theme } = useTheme();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getInitialUser = async () => {
      const email = await StorageService.getEmail();
      const user = await getUserByEmail(email as unknown as string);
      setUserId(user.$id as unknown as null);
      console.log("这里的user是：", userId);
    };
    getInitialUser();
  }, []);
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="text-5xl font-bold text-primary">Goals</Text>
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
