import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadHomeImage, fetchHomeImage } from "../services/homeImageStorageService";

const HomeImageShow = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadHomeImage = async () => {
      try {
        // 先从appwrite拿到background url
        const url = await fetchHomeImage();
        if (url) {
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Error loading home image:", error);
      }
    };

    loadHomeImage();
  }, []);

  // 处理图片选择和上传的异步函数
  const pickImage = async () => {
    try {
      // 设置加载状态为true，显示加载指示器
      setIsLoading(true);
      
      // 启动系统图片选择器，配置选项包括：
      // - 只允许选择图片
      // - 允许编辑（裁剪等）
      // - 强制1:1宽高比
      // - 最高质量
      // - 返回base64格式
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      // 如果用户选择了图片（没有取消）且成功获取到base64数据
      if (!result.canceled && result.assets[0].base64) {
        // 构建完整的base64图片字符串（添加MIME类型前缀）
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        // 上传图片到服务器，如果已有旧图片则传入其URL以便删除
        const url = await uploadHomeImage(base64Image, imageUrl || undefined);
        // 更新状态，显示新上传的图片
        setImageUrl(url);
      }
    } catch (error) {
      // 记录选择或上传过程中的任何错误
      console.error("Error picking or uploading image:", error);
    } finally {
      // 无论成功与否，最后都要关闭加载指示器
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../assets/images/HomeImage.jpg")
            }
            style={styles.image}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default HomeImageShow;
