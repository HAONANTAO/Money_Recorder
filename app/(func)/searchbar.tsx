/*
 * @Date: 2025-03-30 12:28:24
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 13:58:42
 * @FilePath: /Money_Recorder/app/(func)/searchbar.tsx
 */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  searchRecordsByTags,
  searchRecordsByComments,
} from "@/services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";

const Searchbar = () => {
  const { theme } = useTheme();
  const [userId, setUserId] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [tagResults, setTagResults] = useState<any | []>([]);
  const [commentResults, setCommentResults] = useState<any | []>([]);

  useEffect(() => {
    const getInitInfo = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);

      setUserId(userData.$id);
      console.log(userId);
    };
    getInitInfo();
  }, []);

  const handleTagSearch = async () => {
    if (!userId || !tagSearch.trim()) {
      setTagResults([]);
      return;
    }
    try {
      console.log("搜索标签:", tagSearch);
      const results = await searchRecordsByTags(userId, tagSearch);
      console.log("标签搜索结果:", results);
      setTagResults(results);
    } catch (error) {
      console.error("标签搜索错误:", error);
      setTagResults([]);
    }
  };

  const handleCommentSearch = async () => {
    if (!userId || !commentSearch.trim()) {
      setCommentResults([]);
      return;
    }
    try {
      console.log("搜索评论:", commentSearch);
      const results = await searchRecordsByComments(userId, commentSearch);
      console.log("评论搜索结果:", results);
      setCommentResults(results);
    } catch (error) {
      console.error("评论搜索错误:", error);
      setCommentResults([]);
    }
  };

  return (
    <View
      className={`flex-1 p-4 mt-8 ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <View className="space-y-6">
        <View>
          <View className="flex-row items-center space-x-2">
            <TextInput
              className={`flex-1 p-3 rounded-lg border ${
                theme === "dark"
                  ? "border-gray-600 text-white bg-tertiary"
                  : "border-gray-300 text-black bg-gray-50"
              }`}
              placeholder="按标签搜索"
              placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
              value={tagSearch}
              onChangeText={setTagSearch}
            />
            <TouchableOpacity
              onPress={handleTagSearch}
              className={`p-3 rounded-lg ${
                theme === "dark" ? "bg-blue-600" : "bg-blue-500"
              }`}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView className="mt-4 max-h-40">
            {tagResults.length > 0 ? (
              tagResults.map((record: any) => (
                <View
                  key={record.$id}
                  className={`p-4 mb-6 rounded-xl shadow-md ${
                    theme === "dark" ? "bg-tertiary" : "bg-white"
                  }`}
                  style={{
                    shadowColor: theme === "dark" ? "#000" : "#718096",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}>
                      ¥{record.moneyAmount}
                    </Text>
                    <Text
                      className={`px-3 py-1 rounded-full ${
                        record.type === "income"
                          ? theme === "dark"
                            ? "bg-green-700"
                            : "bg-green-100"
                          : theme === "dark"
                          ? "bg-red-700"
                          : "bg-red-100"
                      } ${
                        record.type === "income"
                          ? theme === "dark"
                            ? "text-green-100"
                            : "text-green-800"
                          : theme === "dark"
                          ? "text-red-100"
                          : "text-red-800"
                      }`}>
                      {record.type === "income" ? "收入" : "支出"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Text
                      className={`mr-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Category:
                    </Text>
                    <Text
                      className={
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }>
                      {record.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-1">
                    <Text
                      className={`mr-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Tags:
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {Array.isArray(record.tags) &&
                        record.tags.map((tag: string, index: number) => (
                          <Text
                            key={index}
                            className={`px-2 py-1 rounded-full text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                            {tag}
                          </Text>
                        ))}
                    </View>
                  </View>

                  {record.comment && (
                    <Text
                      className={`mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}>
                      {record.comment}
                    </Text>
                  )}
                </View>
              ))
            ) : tagSearch.trim() ? (
              <Text
                className={`text-center py-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                无搜索结果
              </Text>
            ) : null}
          </ScrollView>
        </View>

        <View>
          <View>
            <View className="flex-row items-center space-x-2">
              <TextInput
                className={`flex-1 p-3 rounded-lg border ${
                  theme === "dark"
                    ? "border-gray-600 text-white bg-tertiary"
                    : "border-gray-300 text-black bg-gray-50"
                }`}
                placeholder="按评论搜索"
                placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
                value={commentSearch}
                onChangeText={setCommentSearch}
              />
              <TouchableOpacity
                onPress={handleCommentSearch}
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-600" : "bg-blue-500"
                }`}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView className="mt-2 max-h-32">
              {commentResults.length > 0 ? (
                commentResults.map((record: any) => (
                  <View
                    key={record.$id}
                    className={`p-4 mb-3 rounded-xl shadow-md ${
                      theme === "dark" ? "bg-tertiary" : "bg-white"
                    }`}
                    style={{
                      shadowColor: theme === "dark" ? "#000" : "#718096",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                    <View className="flex-row justify-between items-center mb-2">
                      <Text
                        className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }`}>
                        ¥{record.moneyAmount}
                      </Text>
                      <Text
                        className={`px-3 py-1 rounded-full ${
                          record.type === "income"
                            ? theme === "dark"
                              ? "bg-green-700"
                              : "bg-green-100"
                            : theme === "dark"
                            ? "bg-red-700"
                            : "bg-red-100"
                        } ${
                          record.type === "income"
                            ? theme === "dark"
                              ? "text-green-100"
                              : "text-green-800"
                            : theme === "dark"
                            ? "text-red-100"
                            : "text-red-800"
                        }`}>
                        {record.type === "income" ? "收入" : "支出"}
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-1">
                      <Text
                        className={`mr-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Category:
                      </Text>

                      <Text
                        className={
                          theme === "dark" ? "text-white" : "text-gray-800"
                        }>
                        {record.category}
                      </Text>
                    </View>

                    {record.tags && record.tags.length > 0 && (
                      <View className="flex-row flex-wrap gap-2 mb-1">
                        {(typeof record.tags === "string"
                          ? record.tags.split(",")
                          : record.tags
                        ).map((tag: string, index: number) => (
                          <Text
                            key={index}
                            className={`px-2 py-1 rounded-full text-sm ${
                              theme === "dark"
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                            {tag.trim()}
                          </Text>
                        ))}
                      </View>
                    )}
                    {record.comment && (
                      <Text
                        className={`mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                        {record.comment}
                      </Text>
                    )}
                  </View>
                ))
              ) : commentSearch.trim() ? (
                <Text
                  className={`text-center py-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                  无搜索结果
                </Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Searchbar;

const styles = StyleSheet.create({});
