/*
 * @Date: 2025-03-30 12:28:24
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-09 15:50:28
 * @FilePath: /Money_Recorder/app/(profile)/searchbar.tsx
 */
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  searchRecordsByTags,
  searchRecordsByComments,
} from "@/services/recordService";

import { getUserByEmail } from "@/services/userManagement";
import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import BackButton from "@/components/BackButton";

const Searchbar = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

  // search by tags
  const handleTagSearch = async () => {
    if (!userId || !tagSearch.trim()) {
      setTagResults([]);
      return;
    }
    try {
      const results = await searchRecordsByTags(userId, tagSearch);

      setTagResults(results);
    } catch (error) {
      setTagResults([]);
    }
  };
  // search by comments
  const handleCommentSearch = async () => {
    if (!userId || !commentSearch.trim()) {
      setCommentResults([]);
      return;
    }
    try {
      const results = await searchRecordsByComments(userId, commentSearch);

      setCommentResults(results);
    } catch (error) {
      console.error("error:", error);
      setCommentResults([]);
    }
  };

  return (
    <View
      className={`flex-1 p-6 pt-24 mb-12 ${
        isDark ? "bg-quaternary" : "bg-white"
      }`}>
      <BackButton />

      <View className="mt-12 space-y-12">
        {/* 1 */}
        <View>
          <View className="flex-row items-center mb-8 space-x-2">
            <TextInput
              className={`flex-1 p-4 rounded-xl border ${
                isDark
                  ? "border-gray-600 text-white bg-gray-900"
                  : "border-gray-300 text-black bg-gray-50"
              } shadow-sm`}
              placeholder="Search by tags"
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              value={tagSearch}
              onChangeText={setTagSearch}
            />
            <TouchableOpacity
              onPress={handleTagSearch}
              className={`ml-2 p-4 rounded-3xl ${
                isDark ? "bg-blue-600" : "bg-blue-500"
              } shadow-sm`}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView className="mt-2 max-h-56">
            {tagResults.length > 0 ? (
              tagResults.map((record: any) => (
                <View
                  key={record.$id}
                  className={`p-6 mb-6 rounded-3xl shadow-lg ${
                    isDark ? "bg-gray-900" : "bg-white"
                  }`}
                  style={{
                    shadowColor: isDark ? "#000" : "#718096",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 8,
                    elevation: 10,
                  }}>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className={`text-2xl font-bold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>
                      ${record.moneyAmount.toLocaleString()}
                    </Text>
                    <Text
                      className={`px-3 py-1 rounded-full ${
                        record.type === "income"
                          ? isDark
                            ? "bg-green-700"
                            : "bg-green-100"
                          : isDark
                          ? "bg-red-700"
                          : "bg-red-100"
                      } ${
                        record.type === "income"
                          ? isDark
                            ? "text-green-100"
                            : "text-green-800"
                          : isDark
                          ? "text-red-100"
                          : "text-red-800"
                      }`}>
                      {record.type === "income" ? "Income" : "Expense"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2 mb-3">
                    <Text
                      className={`mr-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Category:
                    </Text>
                    <Text className={isDark ? "text-white" : "text-gray-800"}>
                      {record.category}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2 mb-3">
                    <Text
                      className={`mr-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Tags:
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {Array.isArray(record.tags) &&
                        record.tags.map((tag: string, index: number) => (
                          <Text
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                              isDark
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                            {tag}
                          </Text>
                        ))}
                    </View>
                  </View>
                  <View className="flex-row items-center mt-2 mb-3">
                    <Text
                      className={`mr-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Location:
                    </Text>
                    <Text className={isDark ? "text-white" : "text-gray-800"}>
                      {record.location || "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2 mb-3">
                    <Text
                      className={`mr-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Method:
                    </Text>
                    <Text className={isDark ? "text-white" : "text-gray-800"}>
                      {record.paymentMethod}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2 mb-3">
                    <Text
                      className={`mr-3 text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}>
                      Date:
                    </Text>
                    <Text className={isDark ? "text-white" : "text-gray-800"}>
                      {new Date(record.createAt).toLocaleDateString()}
                    </Text>
                  </View>
                  {record.comment && (
                    <View className="mt-1">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Comment:
                      </Text>
                      <Text
                        className={`${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}>
                        {record.comment}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            ) : tagSearch.trim() ? (
              <Text
                className={`text-center py-4 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                No results found for tags.
              </Text>
            ) : null}
          </ScrollView>
        </View>

        {/* 2 */}
        <View className="mt-40">
          <View>
            <View className="flex-row items-center mb-8 space-x-2">
              <TextInput
                className={`flex-1 p-4 rounded-xl border ${
                  isDark
                    ? "border-gray-600 text-white bg-gray-900"
                    : "border-gray-300 text-black bg-gray-50"
                } shadow-sm`}
                placeholder="Search by comments"
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                value={commentSearch}
                onChangeText={setCommentSearch}
              />
              <TouchableOpacity
                onPress={handleCommentSearch}
                className={`ml-2 p-4 rounded-3xl ${
                  isDark ? "bg-blue-600" : "bg-blue-500"
                } shadow-sm`}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView className="mt-4 max-h-56">
              {commentResults.length > 0 ? (
                commentResults.map((record: any) => (
                  <View
                    key={record.$id}
                    className={`p-6 mb-6 rounded-3xl shadow-lg ${
                      isDark ? "bg-tertiary" : "bg-white"
                    }`}
                    style={{
                      shadowColor: isDark ? "#000" : "#718096",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.35,
                      shadowRadius: 8,
                      elevation: 10,
                    }}>
                    <View className="flex-row justify-between items-center mb-4">
                      <Text
                        className={`text-2xl font-bold ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}>
                        ${record.moneyAmount.toLocaleString()}
                      </Text>
                      <Text
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          record.type === "income"
                            ? isDark
                              ? "bg-green-700"
                              : "bg-green-100"
                            : isDark
                            ? "bg-red-700"
                            : "bg-red-100"
                        } ${
                          record.type === "income"
                            ? isDark
                              ? "text-green-100"
                              : "text-green-800"
                            : isDark
                            ? "text-red-100"
                            : "text-red-800"
                        }`}>
                        {record.type === "income" ? "Income" : "Expense"}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2 mb-3">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Category:
                      </Text>
                      <Text className={isDark ? "text-white" : "text-gray-800"}>
                        {record.category}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2 mb-3">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Tags:
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {Array.isArray(record.tags) &&
                          record.tags.map((tag: string, index: number) => (
                            <Text
                              key={index}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                                isDark
                                  ? "bg-gray-800 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}>
                              {tag}
                            </Text>
                          ))}
                      </View>
                    </View>
                    <View className="flex-row items-center mt-2 mb-3">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Location:
                      </Text>
                      <Text className={isDark ? "text-white" : "text-gray-800"}>
                        {record.location || "N/A"}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2 mb-3">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Method:
                      </Text>
                      <Text className={isDark ? "text-white" : "text-gray-800"}>
                        {record.paymentMethod}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2 mb-3">
                      <Text
                        className={`mr-3 text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}>
                        Date:
                      </Text>
                      <Text className={isDark ? "text-white" : "text-gray-800"}>
                        {new Date(record.createAt).toLocaleDateString()}
                      </Text>
                    </View>
                    {record.comment && (
                      <View className="mt-1">
                        <Text
                          className={`mr-3 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}>
                          Comment:
                        </Text>
                        <Text
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}>
                          {record.comment}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              ) : commentSearch.trim() ? (
                <Text
                  className={`text-center py-4 ${
                    isDark ? "text-gray-400" : "text-gray-600"
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
