/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 17:15:46
 * @FilePath: /Money_Recorder/app/(tabs)/profile.tsx
 */
import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { StorageService } from "@/utils/storageService";
import { router } from "expo-router";
const Profile = () => {
  const handleLogOut = async () => {
    // 清除缓存
    await StorageService.clearUserId();
    router.replace("/");
  };
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
