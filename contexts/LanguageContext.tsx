import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, translations } from "../utils/language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // 从 AsyncStorage 加载保存的语言设置
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (
          savedLanguage &&
          (savedLanguage === "en" || savedLanguage === "zh")
        ) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language setting:", error);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Failed to save language setting:", error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations;

    for (const k of keys) {
      if (current[k]) {
        current = current[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof current === "object" && current[language]) {
      return current[language];
    }

    console.warn(
      `Translation not found for key: ${key} in language: ${language}`,
    );
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
