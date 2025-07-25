/*
 * @Date: 2025-03-23 22:04:47
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-29 16:18:08
 * @FilePath: /Money_Recorder/app/(tabs)/profile.tsx
 */
import {
  Button,
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
  deleteUser,
} from "@/services/userManagement";
import { uploadAvatar } from "@/services/bucketStorageService";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [edit, setEdit] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [userId, setUserId] = useState("");
  const [isGuest, setIsGuest] = useState<boolean>();

  const getEmailNow = async () => {
    try {
      const isGuest = await StorageService.getIsGuest();
      setIsGuest(isGuest);
      if (isGuest === true) {
        setUsername("admin");
        setEmail("admin@gmail.com");
        return;
      }
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

  useEffect(() => {
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
          translations.alerts.notifications.title,
          translations.alerts.notifications.message,
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

        // 存数据库
        updateAvatar(userId, avatarUrl);
        setAvatar(avatarUrl);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
      Alert.alert(translations.common.error, translations.alerts.updateError);
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
      Alert.alert(
        translations.common.success,
        translations.alerts.updateSuccess,
      );
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert(translations.common.error, translations.alerts.updateError);
    }
  };

  // main body
  return (
    <View className={`flex-1 p-6  ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* front profile info */}
      <View
        className={`p-6 mb-4 mt-16 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        } rounded-xl shadow-md`}>
        <View className="flex justify-center items-center">
          <Text
            className={`mb-6 text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
            {translations.tabs.profile}
          </Text>
          {/* 有avatar就显示 */}
          <TouchableOpacity onPress={handleAvatarPress}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-28 h-28 rounded-full border border-gray-600"
              />
            ) : (
              <Image
                source={require("../../assets/images/DefaultUser.png")}
                className="w-28 h-28 rounded-full border border-gray-600"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 本来 */}
        {edit && username && email && (
          <>
            <View className="flex justify-center items-center mt-4">
              <Text
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                {username}
              </Text>
            </View>
            <View className="flex justify-center items-center mt-4 mb-4">
              <Text
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}>
                {email}
              </Text>
            </View>
            {edit ? (
              <Button
                title={translations.common.edit}
                onPress={() => handleEdit()}
                color={theme === "dark" ? "#60A5FA" : "#E63946"}
                disabled={isGuest === true}
              />
            ) : (
              <Button
                title={translations.common.save}
                onPress={() => handleSave()}
                color={theme === "dark" ? "#60A5FA" : "#2c78e3"}
              />
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
                {translations.profile.username}
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
                title={translations.common.edit}
                onPress={() => handleEdit()}
                color="#E63946"
              />
            ) : (
              <View className="flex-row justify-around mt-4">
                <Button
                  title={translations.common.save}
                  onPress={() => handleSave()}
                  color="#2c78e3"
                />
                <Button
                  title={translations.common.cancel}
                  onPress={() => {
                    handleEdit();
                    getEmailNow();
                  }}
                  color="#E63946"
                />
              </View>
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
                source={require("../../assets/images/icons/setting.png")}
                className="w-12 h-12"
              />
              <Text className={`mt-2 text-sm font-bold ${"text-quaternary"}`}>
                {translations.settings.title}
              </Text>
            </TouchableOpacity>
          </View>
          {/* search box */}
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/searchbar")}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/search.png")}
                className="w-10 h-10"
              />
              <Text className={`mt-2 font-bold text-quaternary`}>
                {translations.common.search || "搜索"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* faq */}
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/faq")}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/help.png")}
                className="w-10 h-10"
              />
              <Text className={`font-bold text-quaternary`}>
                {translations.profile.faq}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row justify-around items-center mt-4 mb-2">
          {/* author box */}
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
              <Text className={`font-bold ${"text-quaternary"}`}>
                {translations.profile.author}
              </Text>
            </TouchableOpacity>
          </View>

          {/* rating box */}
          <View
            className={`${
              theme === "dark" ? "bg-blue-200" : "bg-white "
            } flex justify-center items-center w-24 h-24 rounded-xl border border-gray-200 shadow-md`}>
            <TouchableOpacity
              onPress={async () => {
                try {
                  if (Platform.OS === "ios") {
                    await Linking.openURL(
                      "https://apps.apple.com/app/id6744058988?action=write-review",
                    );
                  } else {
                    Alert.alert(
                      translations.common.warning,
                      translations.alerts.notifications.iosOnly,
                    );
                  }
                } catch (error) {
                  Alert.alert(
                    translations.common.error,
                    "Unable to open App Store, please try again later",
                  );
                }
              }}
              className="flex justify-center items-center w-full h-full">
              <Image
                source={require("../../assets/images/icons/rating.png")}
                className="w-10 h-10"
              />
              <Text className={`mt-2 font-bold ${"text-quaternary"}`}>
                {translations.profile.rating}
              </Text>
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
              <Text className={`font-bold text-quaternary`}>
                {translations.profile.more}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* footer */}
      <View className="absolute right-0 bottom-0 left-0 px-4 py-3 bg-opacity-80">
        <View className="flex-row justify-center items-center space-x-2">
          <Text className="text-[12px] text-gray-400">Developed by</Text>
          <Text className="text-[12px] text-gray-400 font-semibold">
            AaronTAO
          </Text>
          <Ionicons name="heart" size={12} color="#9CA3AF" />
        </View>
      </View>
    </View>
  );
};

export default Profile;
