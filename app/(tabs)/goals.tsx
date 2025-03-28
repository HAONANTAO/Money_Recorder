import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getUserByEmail } from "@/services/userManagement";
import { StorageService } from "@/utils/storageService";
import BudgetForm from "@/components/BudgetForm";

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
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      {userId && <BudgetForm userId={userId} />}
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
