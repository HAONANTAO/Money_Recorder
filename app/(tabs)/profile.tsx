/*
 * @Date: 2025-03-23 22:04:47
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 15:09:05
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
  Linking,
  Platform,
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
import { useTheme } from "../../contexts/ThemeContext";

const Profile = () => {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  // for edit considering
  // const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        const avatarUrl = await uploadAvatar(base64Image, avatar);
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

  // main body
  return (
    <View
      className={`flex-1 p-6 mt-16 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      {/* front profile info */}
      <View
        className={`p-6 mb-4 ${
          theme === "dark" ? "bg-quaternary" : "bg-gray-50"
        } rounded-xl shadow-md`}>
        <View className="flex justify-center items-center">
          <Text className="mb-6 text-3xl font-bold text-secondary">
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
            <View className="flex justify-center items-center mt-4">
              {/* <Text className="mb-1 text-gray-500">Username</Text> */}
              <Text
                className={`${
                  theme === "dark" ? "text-quinary" : ""
                } text-lg font-semibold`}>
                {username}
              </Text>
            </View>
            <View className="flex justify-center items-center mt-4 mb-4">
              {/* <Text className="mb-1 text-gray-500">Email:</Text> */}
              <Text
                className={`${
                  theme === "dark" ? "text-quinary" : ""
                } text-lg font-semibold`}>
                {email}
              </Text>
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
            <View className="flex justify-center items-center mt-4">
              <Text
                className={`${
                  theme === "dark" ? "text-secondary" : ""
                } mb-1 font-bold text-quaternary`}>
                Username
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                className={
                  "p-2 text-lg bg-white rounded-lg border border-gray-300"
                }></TextInput>
            </View>
            <View className="flex justify-center items-center mt-4">
              <Text
                className={`${
                  theme === "dark" ? "text-secondary" : ""
                } mb-1 font-bold text-quaternary`}>
                Email:
              </Text>
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
                color="#2c78e3"
              />
            )}
          </>
        )}
      </View>

      {/* middle box display view */}
      <View>
        <View className="flex flex-row justify-around items-center mt-4 mb-2">
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/settings")}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/setting.png")}
                className="w-12 h-12"
              />
              <Text className="mt-2 text-sm font-bold text-quaternary">
                Setting
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (Platform.OS === "ios") {
                    // TODO:替换为实际的App Store ID
                    await Linking.openURL(
                      "https://apps.apple.com/app/idYOUR_APP_ID?action=write-review",
                    );
                  } else {
                    Alert.alert(
                      "hint",
                      "This feature is only available on iOS devices.",
                    );
                  }
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "Unable to open App Store, please try again later",
                  );
                }
              }}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/rating.png")}
                className="w-10 h-10"
              />
              <Text className="mt-2 font-bold text-quaternary">Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row justify-around items-center mt-4 mb-2">
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/author")}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/author.png")}
                className="w-10 h-10"
              />

              <Text className="font-bold text-quaternary">Author</Text>
            </TouchableOpacity>
          </View>
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/more")}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/more.png")}
                className="w-10 h-10"
              />
              <Text className="font-bold text-quaternary">More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* logout button */}
      <View className="flex justify-end items-center mt-12">
        <TouchableOpacity
          onPress={() => handleLogOut()}
          className="py-3 mt-2  rounded-lg w-[140px] bg-tertiary ">
          <Text className="font-bold text-center text-white">Log out</Text>
        </TouchableOpacity>
      </View>
      {/* footer */}
      <View className="absolute right-0 bottom-0 px-4 py-2">
        <Text className="text-[10px] text-gray-400">Developed by AaronTAO</Text>
      </View>
    </View>
  );
};

export default Profile;
