/*
 * @Date: 2025-03-23 22:04:47
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 14:27:05
 * @FilePath: /Money_Recorder/app/(tabs)/profile.tsx
 */
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { StorageService } from "@/utils/storageService";
import { router } from "expo-router";
import {
  getUserByEmail,
  updateAvatar,
  updateUser,
} from "@/services/userManagement";
import { uploadAvatar } from "@/services/bucketStorageService";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  // for edit considering
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // logout functions
  const handleLogOut = async () => {
    await StorageService.clearEmail();
    router.replace("/");
  };

  useEffect(() => {
    const getEmailNow = async () => {
      try {
        const email = await StorageService.getEmail();
        // user info
        const userInfo = await getUserByEmail(email as string);

        setUsername(userInfo.username);
        setEmail(userInfo.email);
        setAvatar(userInfo.avatar);
        setUserId(userInfo.$id);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    // execute
    getEmailNow();
  }, []);

  // handle edit
  const handleEdit = () => {
    // start to edit and change display
    setEdit(!edit);
  };
  // 处理头像选择
  const handleAvatarPress = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        // 获取相册权限
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions to change your avatar.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;

        // 上传头像到Storage并获取URL
        const avatarUrl = await uploadAvatar(base64Image);
        // console.log("这里看", avatarUrl);
        // 存数据库
        updateAvatar(userId, avatarUrl);
        setAvatar(avatarUrl);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  // handleSave
  const handleSave = async () => {
    try {
      const email = await StorageService.getEmail();
      const userInfo = await getUserByEmail(email as string);
      await updateUser(userInfo.$id, { username });
      await updateAvatar(userInfo.$id, avatar);
      setEdit(!edit);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <View className="flex-1 p-6 mt-16 bg-white">
      <View className="p-6 mb-6 bg-gray-50 rounded-xl shadow-sm">
        <View className="flex justify-center items-center">
          <Text className="mb-6 text-3xl font-bold text-primary">
            My Profile
          </Text>
          {/* 有avatar就显示 */}
          <TouchableOpacity onPress={handleAvatarPress}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-28 h-28 rounded-full border border-gray-100"
              />
            ) : (
              <Image
                source={require("../../assets/images/DefaultUser.png")}
                className="w-28 h-28 rounded-full border border-gray-100"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 本来 */}
        {edit && username && email && (
          <>
            <View className="mb-4">
              <Text className="mb-1 text-gray-500">Username</Text>
              <Text className="text-lg font-semibold">{username}</Text>
            </View>
            <View className="mb-4">
              <Text className="mb-1 text-gray-500">Email:</Text>
              <Text className="text-lg font-semibold">{email}</Text>
            </View>
            {edit ? (
              <Button
                title="Edit"
                onPress={() => handleEdit()}
                color="#E63946"
              />
            ) : (
              <Button title="Save" onPress={() => handleSave()} color="" />
            )}
          </>
        )}

        {/* 点击完edit */}
        {!edit && username && email && (
          <>
            <View className="mb-4">
              <Text className="mb-1 font-bold text-quaternary">Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                className="p-2 text-lg bg-white rounded-lg border border-gray-300"></TextInput>
            </View>
            <View className="mb-4">
              <Text className="mb-1 font-bold text-quaternary">Email:</Text>
              <TextInput
                value={email}
                className="p-2 text-lg bg-white rounded-lg border border-gray-300"></TextInput>
            </View>
            {edit ? (
              <Button
                title="Edit"
                onPress={() => handleEdit()}
                color="#E63946"
              />
            ) : (
              <Button
                title="Save"
                onPress={() => handleSave()}
                color="#1E40AF"
              />
            )}
          </>
        )}
      </View>
      <View className="flex flex-1 justify-end items-center pb-6">
        <TouchableOpacity
          onPress={() => handleLogOut()}
          className="py-3 mt-6 mb-4 rounded-lg w-[180px] bg-tertiary ">
          <Text className="font-bold text-center text-white">Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
