import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 定义 ThemeType 类型，它包含 'light' 和 'dark' 两个可选值
type ThemeType = "light" | "dark";

// 定义 ThemeContextType 接口，表示上下文中包含的主题信息和切换主题的方法
interface ThemeContextType {
  theme: ThemeType; // 当前主题
  toggleTheme: () => Promise<void>; // 切换主题的方法
}

// 创建 ThemeContext 上下文，初始值为 undefined，表示没有提供主题上下文时会抛出错误
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 定义 ThemeProviderProps 类型，用于指定 ThemeProvider 组件的子组件类型
type ThemeProviderProps = {
  children:
    | React.ReactNode
    | ((props: { theme: ThemeType }) => React.ReactNode); // 支持传递 ReactNode 或是一个接受 theme 参数的函数
};

// ThemeProvider 组件用于提供主题上下文
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 初始化主题状态，默认值为 'light'
  const [theme, setTheme] = useState<ThemeType>("light");

  // 使用 useEffect 钩子在组件挂载时从 AsyncStorage 获取保存的主题
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // 从 AsyncStorage 获取保存的主题值
        const savedTheme = await AsyncStorage.getItem("theme");

        // 如果存储的主题是有效的，则设置为当前主题
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from storage:", error); // 加载主题失败时的错误日志
      }
    };

    loadTheme(); // 调用加载主题的函数
  }, []); // 只在组件首次挂载时执行

  // 切换主题函数
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light"; // 切换主题：如果当前是 'light'，则切换为 'dark'，反之亦然
    try {
      await AsyncStorage.setItem("theme", newTheme); // 保存新主题到 AsyncStorage
      setTheme(newTheme); // 更新主题状态
    } catch (error) {
      console.error("Failed to save theme:", error); // 保存主题失败时的错误日志
    }
  };

  // 返回 ThemeContext.Provider，提供当前的 theme 和 toggleTheme 方法给子组件
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {typeof children === "function" ? children({ theme }) : children}
    </ThemeContext.Provider>
  );
};

// 自定义 hook 用于访问主题上下文
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext); // 获取 ThemeContext 上下文
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider"); // 如果 useTheme 被错误使用（没有在 ThemeProvider 中使用），则抛出错误
  }
  return context; // 返回主题数据和切换主题的方法
};
