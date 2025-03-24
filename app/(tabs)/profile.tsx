/*
 * @Date: 2025-03-23 22:04:47
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 13:12:23
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
} from "react-native";
import React, { useEffect, useState } from "react";
import { StorageService } from "@/utils/storageService";
import { router } from "expo-router";
import { getUserByEmail } from "@/services/userManagement";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(false);
  const [avatar, setAvatar] = useState("");
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
  // handleSave
  const handleSave = () => {
    // start to edit and change display
    setEdit(!edit);
  };

  return (
    <View className="flex-1 p-6 mt-16 bg-white">
      <View className="p-6 mb-6 bg-gray-50 rounded-xl shadow-sm">
        <View className="flex justify-center items-center">
          <Text className="mb-6 text-3xl font-bold text-primary">
            My Profile
          </Text>
          {/* 有avatar就显示 */}
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
      <View className="flex justify-center items-center mb-4">
        <TouchableOpacity
          onPress={() => handleLogOut()}
          className="py-3 mt-6 rounded-lg w-[180px] bg-tertiary ">
          <Text className="font-bold text-center text-white">Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
