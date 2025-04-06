/*
 * @Date: 2025-03-28 15:21:48
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-06 19:22:23
 * @FilePath: /Money_Recorder/app/(func)/Budget.tsx
 */
import { View } from "react-native";
import React, { useEffect, useState } from "react";

import { getUserByEmail } from "@/services/userManagement";
import { StorageService } from "@/utils/storageService";
import BudgetForm from "@/components/BudgetForm";
import { useTheme } from "@/contexts/ThemeContext";

const Budget = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getInitialUser = async () => {
      const email = await StorageService.getEmail();
      const user = await getUserByEmail(email as unknown as string);
      setUserId(user.$id as unknown as null);
    };
    getInitialUser();
  }, []);

  return (
    <View className={`flex-1 p-4 ${isDark ? " bg-gray-700" : "bg-white"}`}>
      {userId ? (
        <BudgetForm userId={userId} />
      ) : (
        <BudgetForm userId="guest" isGuest={true} />
      )}
    </View>
  );
};

export default Budget;
