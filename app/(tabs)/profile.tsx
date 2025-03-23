/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 22:34:14
 * @FilePath: /Money_Recorder/app/(tabs)/profile.tsx
 */
import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { StorageService } from "@/utils/storageService";
import { router } from "expo-router";
import { getUserByEmail } from "@/services/userManagement";

const Profile = () => {
  const handleLogOut = async () => {
    // 清除缓存
    await StorageService.clearEmail();
    router.replace("/");
  };

  useEffect(() => {
    const getEmailNow = async () => {
      try {
        const email = await StorageService.getEmail();
        // console.log("这里", email);
        // get user info by email
        const userInfo = await getUserByEmail(email as string);
        console.log("userInfo", userInfo);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    getEmailNow();
  }, []);

  return (
    <>
      <View className="flex-1 justify-center items-center">
        <Text className="text-5xl font-bold text-primary">Profile</Text>
      </View>
      <Button title="LogOut" onPress={() => handleLogOut()}></Button>
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({});
