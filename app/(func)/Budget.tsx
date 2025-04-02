/*
 * @Date: 2025-03-28 15:21:48
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 12:29:42
 * @FilePath: /Money_Recorder/app/(func)/budget.tsx
 */
import { View } from "react-native";
import React, { useEffect, useState } from "react";

import { getUserByEmail } from "@/services/userManagement";
import { StorageService } from "@/utils/storageService";
import BudgetForm from "@/components/BudgetForm";
import { useTheme } from "@/contexts/ThemeContext";

const Budget = () => {
  const { theme } = useTheme();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getInitialUser = async () => {
      const email = await StorageService.getEmail();
      const user = await getUserByEmail(email as unknown as string);
      setUserId(user.$id as unknown as null);
      // console.log("这里的user是：", userId);
    };
    getInitialUser();
  }, []);
  return (
    <View
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      {userId ? (
        <BudgetForm userId={userId} />
      ) : (
        <BudgetForm userId="guest" isGuest={true} />
      )}
    </View>
  );
};

export default Budget;
