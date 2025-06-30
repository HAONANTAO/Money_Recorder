import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 定义语言类型
type Language = "en" | "zh";

// 定义翻译内容的接口
interface Translations {
  notifications: {
    disableSuccess: string | undefined;
    openSettings: string | undefined;
    permissionRequired: string;
    enableSuccess: string | undefined;
    title: string;
    body: string;
  };
  back: string;
  budget: {
    title: string;
    date: string;
    amount: string;
    amountPlaceholder: string;
    category: string;
    comments: string;
    commentsPlaceholder: string;
    save: string;
  };
  guestmode: {
    record: string;
    depositgoal: string;
    budget: string;
  };
  author: {
    introduction: string;
    contactMe: string;
    motto: string;
  };
  profile: {
    deleteAccount: string;
    faqContent: any;
    username: string;
    rating: string;
    author: string;
    faq: string;
    more: string;
    logout: string;
  };
  goals: {
    comment: string;
    noCompletedData: string;
    noUnCompletedData: string;
    title: string;
    depositGoal: {
      title: string;
      name: string;
      amount: string;
      category: string;
      note: string;
      startDate: string;
      endDate: string;
      createButton: string;
      updateButton: string;
      namePlaceholder: string;
      amountPlaceholder: string;
      notePlaceholder: string;
      enterAmount: string;
      endDateError: string;
      updateSuccess: string;
      createSuccess: string;
      updateFailed: string;
      createFailed: string;
    };
    // noData: string;
  };
  BudgetUsage: string;
  record: {
    tagsPlaceholder: string | undefined;
    $createdAt: string;
    save: string;
    commentPlaceholder: string;
    amountPlaceholder: string;
    locationPlaceholder: string;
    update: string;
    chooseCategory: string;
    type: string;
    amount: string;
    title: string;
    income: string;
    expense: string;
    category: string;
    date: string;
    method: string;
    location: string;
    tags: string;
    comment: string;
    none: string;
    details: string;
  };
  stats: {
    title: string;
    records: string;
    income: string;
    expense: string;
    switchToIncome: string;
    switchToExpense: string;
    total: string;
    noData: string;
    setBudget: string;
  };
  tabs: {
    profileTab: string;
    home: string;
    stats: string;
    record: string;
    goal: string;
    profile: string;
  };
  home: {
    search: string;
    monthlyIncome: string;
    monthlyExpense: string;
    recentRecords: string;
    monthlyNetIncome: string;
    enterBudget: string;
  };
  categories: {
    cash: string;
    transfer: string;
    card: string;
    total: string;
    income: string;
    expense: string;
    category: string;
    date: string;
    method: string;
    location: string;
    tags: string;
    comment: string;
    none: string;
    // pie chart
    eating: string;
    shopping: string;
    traffic: string;
    entertainment: string;
    living: string;
    education: string;
    medication: string;
    others: string;
    salary: string;
    sideline: string;
    investment: string;
    bonus: string;
    other: string;
  };
  settings: {
    restore: string;
    privacyPolicy: string;
    termsofuse: string;
    backup: string;
    title: string;
    notifications: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    clearCache: string;
    language: string;
    version: string;
  };
  common: {
    delete: string;
    notice: string;
    search: string;
    settings: string;
    warning: string;
    confirm: string;
    edit: string;
    save: string;
    uncompleted: string;
    completed: string;
    cancel: string;
    clear: string;
    success: string;
    error: string;
    open: string;
    update: string;
  };
  alerts: {
    enableNotifications: string | undefined;
    deleteAccountError: string;
    deleteAccountConfirm: string;

    updateSuccess: string;
    createSuccess: string;
    fillAmountCategory: string;
    record: string;
    createError: string;
    updateError: string;
    deleteError: string;

    deleteTransaction: {
      title: string;
      message: string;
      success: string;
      error: string;
    };

    clearCache: {
      title: string;
      message: string;
      success: string;
      error: string;
    };
    notifications: {
      title: string;
      message: string;
      iosOnly: string;
    };
    budget: {
      deleteTitle: string;
      deleteMessage: string;
      updateTitle: string;
      updateMessage: string;
    };
  };
}

// 定义语言上下文的接口
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

// 英文翻译
const enTranslations: Translations = {
  BudgetUsage: " BudgetUsage",
  notifications: {
    title: "Money Recorder",
    body: "Just a gentle nudge to track your spending today",
    permissionRequired: "Permission required",
    enableSuccess: "Notifications enabled successfully",
    disableSuccess: "Notifications disabled successfully",
    openSettings: "Open settings",
  },
  back: "Back",
  budget: {
    title: "Set The Budget",
    date: " Budget Date",
    amount: " Budget Amount",
    amountPlaceholder: "Please enter amount",
    category: "Budget Category",
    comments: "Comments",
    commentsPlaceholder: "Please enter comments",
    save: " Save The Budget",
  },
  guestmode: {
    depositgoal:
      "Deposit target cannot be saved in guest mode, please log in and try again",
    record:
      " Unable to save records in guest mode, please log in and try again",
    budget: " Unable to save budget in guest mode, please log in and try again",
  },

  author: {
    introduction: `Hello! I am an IT developer who has studied at Monash and Melbourne
        University. As a passionate developer, I am constantly learning and
        growing, hoping to make achievements in the IT field.`,
    contactMe: "ContactMe",
    motto: `Building innovative solutions, one project at a time.`,
  },
  profile: {
    deleteAccount: "deleteAccount",
    username: "Username",
    rating: "Rating",
    author: "Author",
    faq: "FAQ",
    more: "More",
    logout: "Logout",
    faqContent: {
      howToRecord: {
        question: "How to record income and expenses?",
        answer:
          'Click the "+" button in the bottom navigation bar, select income or expense type, fill in the amount and notes, then click save to complete the record.',
      },
      howToViewStats: {
        question: "How to view statistics?",
        answer:
          'Click the "Stats" button in the bottom navigation bar to view pie charts and bar charts analysis of your income and expenses to understand your financial situation.',
      },
      howToSetBudget: {
        question: "How to set a budget?",
        answer:
          'Click the "Goal" button on the "Goals" page to set your monthly expense budget. The system will help you track your budget usage.',
      },
      howToSwitchTheme: {
        question: "How to switch dark mode?",
        answer:
          'Go to "My Profile" page then enter the setting site to switch between dark/light theme modes.',
      },
      howToEditProfile: {
        question: "How to modify personal information?",
        answer:
          'Click the edit button on "My Profile" page to modify your username, avatar and other personal information.',
      },
    },
  },
  goals: {
    comment: "comment",
    noCompletedData: "No completed data",
    noUnCompletedData: "No uncompleted data",
    title: "Goals",
    depositGoal: {
      title: "The Deposit Goal",
      name: "Name",
      amount: "Amount",
      category: "Category",
      note: "Note",
      startDate: "Start Date",
      endDate: "End Date",
      createButton: "Create Deposit Goal",
      updateButton: "Update Deposit Goal",
      namePlaceholder: "Please enter the deposit name...",
      amountPlaceholder: "Please enter the deposit amount...",
      notePlaceholder: "Please enter the deposit note...",
      enterAmount: "Please enter the deposit amount",
      endDateError: "End date cannot be earlier than start date",
      updateSuccess: "Deposit target updated successfully!",
      createSuccess: "Deposit target created successfully!",
      updateFailed: "Update deposit target failed",
      createFailed: "Failed to create deposit destination",
    },
    // noData: "No data",
  },
  record: {
    tagsPlaceholder: "Please enter tags",
    $createdAt: "Date",
    save: "Save", // 新增的翻译，用于保存按钮的文本
    commentPlaceholder: "Please enter comment",
    amountPlaceholder: "Please enter amount",
    locationPlaceholder: "Please enter location",
    update: "Update",
    chooseCategory: "Choose Category",
    type: "Type",
    amount: "Amount",
    title: "Add Record",
    income: "Income",
    expense: "Expense",
    category: "Category",
    date: "Date",
    method: "Method",
    location: "Location",
    tags: "Tags",
    comment: "Comment",
    none: "None",
    details: "Transaction Details",
  },
  stats: {
    title: "Data Stats",
    records: "Records",
    income: "Income",
    expense: "Expense",
    switchToIncome: "Switch to Income",
    switchToExpense: "Switch to Expense",
    total: "Total",
    noData: "No Created Data",
    setBudget: "Set Budget",
  },
  tabs: {
    home: "Home",
    stats: "Stats",
    record: "Record",
    goal: "Goal",
    profileTab: "My",
    profile: "My Profile",
  },
  home: {
    enterBudget: "enterBudget",
    search: "Search your records...",
    monthlyIncome: "Total Income",
    monthlyExpense: "Total Expense",
    recentRecords: "Recent Records",
    monthlyNetIncome: "Total Net Income",
  },
  categories: {
    cash: "Cash",
    transfer: "Transfer",
    card: "Card",
    total: "Total",
    income: "Income",
    expense: "Expense",
    category: "Category",
    date: "Date",
    method: "Method",
    location: "Location",
    tags: "Tags",
    comment: "Comment",
    none: "None",
    // pie chart
    eating: "Eating",
    shopping: "Shopping",
    traffic: "Traffic",
    entertainment: "Entertainment",
    living: "Living",
    education: "Education",
    medication: "Medication",
    others: "Others",
    salary: "Salary",
    sideline: "Sideline",
    investment: "Investment",
    bonus: "Bonus",
    other: "Other",
  },
  settings: {
    restore: "Restore",
    privacyPolicy: "Privacy Policy",
    termsofuse: "Terms of Use",
    backup: "Backup",
    title: "Settings",
    notifications: "Notifications",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    clearCache: "Clear Cache",
    language: "Language",
    version: "App Version",
  },
  common: {
    delete: "Delete",
    notice: "Notice",
    search: "Search",
    settings: "Settings",
    warning: "warning",
    confirm: "Confirm",
    edit: "Edit",
    save: "Save", // 新增的翻译，用于保存按钮的文本
    uncompleted: "Uncompleted",
    completed: "Completed",
    cancel: "Cancel",
    clear: "Clear",

    success: "Success",
    error: "Error",
    open: "Open Settings",
    update: "Update",
  },
  alerts: {
    deleteTransaction: {
      title: "Delete Transaction",
      message:
        "Are you sure you want to delete this transaction? This action cannot be undone.",
      success: "Transaction deleted successfully!",
      error: "Failed to delete transaction.",
    },
    enableNotifications: "enableNotifications",
    deleteAccountError: "deleteAccountError",
    deleteAccountConfirm:
      "Are you sure you want to delete your account? All account data will be lost",
    updateSuccess: "Update Record Success",
    createSuccess: "Create Record Success",
    fillAmountCategory: "Please fill in the amount and category.",
    record: "Record",
    createError: "Create Record Failed",
    updateError: "Update Record Failed",
    deleteError: "Delete Record Failed",
    clearCache: {
      title: "Clear Cache",
      message:
        "Are you sure you want to clear the cache? This action cannot be undone.",
      success: "Cache cleared successfully!",
      error: "Failed to clear cache.",
    },
    notifications: {
      title: "Notifications Settings",
      message: "Open the Notification settings?",
      iosOnly: "This functionality is only available on iOS.",
    },
    budget: {
      deleteTitle: "Delete Title",
      deleteMessage: "Delete Message",
      updateTitle: "Update Title",
      updateMessage: "update Message",
    },
  },
};

// 中文翻译
const zhTranslations: Translations = {
  BudgetUsage: "本月预算使用情况",
  notifications: {
    title: "小陶(✧∇✧)╯╰(✧∇✧)̣",
    body: "小陶提醒你注意记录今天开支",

    permissionRequired: "需要权限许可",
    enableSuccess: "通知启用成功",
    disableSuccess: "通知已禁用",
    openSettings: "打开设置",
  },
  back: "返回",
  budget: {
    title: "设定预算",
    date: " 预算日期",
    amount: " 预算金额",
    amountPlaceholder: "请输入金额",
    category: "预算类别",
    comments: "评论",
    commentsPlaceholder: "请输入评论...",
    save: " 保存预算",
  },
  guestmode: {
    depositgoal: "游客模式下无法保存存款目标，请登录后重试",
    record: "游客模式下无法保存记录，请登录后重试",
    budget: "访客模式下无法保存预算，请登录后重试",
  },
  author: {
    introduction:
      "你好！我是一名 IT 开发人员，曾就读于莫纳什大学和墨尔本大学。作为一名充满激情的开发人员，我不断学习和成长，希望在 IT 领域有所成就。",
    contactMe: "欢迎联系",
    motto: "登高望远",
  },
  profile: {
    deleteAccount: "删除账号",
    username: "用户名",
    rating: "评分",
    author: "作者",
    faq: "疑问",
    more: "更多",
    logout: "退出登录",
    faqContent: {
      howToRecord: {
        question: "如何记录收入和支出？",
        answer:
          '点击底部导航栏的"+"按钮，选择收入或支出类型，填写金额和备注，然后点击保存完成记录。',
      },
      howToViewStats: {
        question: "如何查看统计数据？",
        answer:
          '点击底部导航栏的"统计"按钮，可以查看饼图和柱状图分析您的收入和支出情况，了解您的财务状况。',
      },
      howToSetBudget: {
        question: "如何设置预算？",
        answer:
          '在"目标"页面点击"目标"按钮设置您的月度支出预算。系统将帮助您跟踪预算使用情况。',
      },
      howToSwitchTheme: {
        question: "如何切换深色模式？",
        answer: '进入"我的"页面，然后进入设置页面切换深色/浅色主题模式。',
      },
      howToEditProfile: {
        question: "如何修改个人信息？",
        answer:
          '在"我的"页面点击编辑按钮，可以修改您的用户名、头像和其他个人信息。',
      },
    },
  },
  goals: {
    comment: "备注",
    title: "存款目标",
    noCompletedData: "暂无完成后的数据，请先设置目标",
    noUnCompletedData: "暂无未完成后的数据，请先设置目标",
    depositGoal: {
      title: "存款目标",
      name: "名称",
      amount: "金额",
      category: "类别",
      note: "备注",
      startDate: "开始日期",
      endDate: "结束日期",
      createButton: "创建存款目标",
      updateButton: "更新存款目标",
      namePlaceholder: "请输入存款名称...",
      amountPlaceholder: "请输入存款金额...",
      notePlaceholder: "添加备注",
      enterAmount: "请输入存款金额",
      endDateError: "结束日期不能早于开始日期",
      updateSuccess: "存款目标更新成功！",
      createSuccess: "存款目标创建成功！",
      updateFailed: "更新存款目标失败",
      createFailed: "创建存款目标失败",
    },
  },
  record: {
    tagsPlaceholder: "请输入标签",
    $createdAt: "创建时间",
    save: "保存", // 新增的翻译，用于保存按钮的文本
    amountPlaceholder: "请输入金额",
    locationPlaceholder: "请输入地点",
    commentPlaceholder: "请输入备注",
    update: "更新",
    chooseCategory: "选择类别",
    type: "类型",
    amount: "金额",
    title: "添加记录",
    income: "收入",
    expense: "支出",
    category: "类别",
    date: "日期",
    method: "支付方式",
    location: "位置",
    tags: "标签",
    comment: "备注",
    none: "无",
    details: "交易详情",
  },
  stats: {
    title: "统计",
    records: "记录",
    income: "收入",
    expense: "支出",
    switchToIncome: "切换到收入",
    switchToExpense: "切换到支出",
    total: "总计",
    noData: "暂无数据",
    setBudget: "设置预算",
  },
  tabs: {
    profileTab: "我的",
    home: "主页",
    stats: "统计",
    record: "记录",
    goal: "目标",
    profile: "个人",
  },
  home: {
    enterBudget: "输入预算目标",
    search: "搜索记录...",
    monthlyIncome: "本月收入",
    monthlyExpense: "本月支出",
    recentRecords: "最近记录",
    monthlyNetIncome: "本月净收入",
  },
  categories: {
    cash: "现金",
    transfer: "转账",
    card: "卡",
    total: "总计",
    income: "收入",
    expense: "支出",
    category: "类别",
    date: "日期",
    method: "支付方式",
    location: "位置",
    tags: "标签",
    comment: "备注",
    none: "无",
    // pie chart
    eating: "吃饭",
    shopping: "购物",
    traffic: "交通",
    entertainment: "娱乐",
    living: "生活",
    education: "教育",
    medication: "医疗",
    others: "其他",
    salary: "工资",
    sideline: "副业",
    investment: "投资",
    bonus: "奖金",
    other: "其他",
  },
  settings: {
    restore: "恢复数据",
    privacyPolicy: "隐私政策",
    termsofuse: "使用条款",
    backup: "数据备份",
    title: "设置",
    notifications: "通知",
    theme: "主题",
    themeLight: "浅色",
    themeDark: "深色",
    clearCache: "清除缓存",
    language: "语言",
    version: "应用版本",
  },
  common: {
    delete: "删除",
    notice: "提示",
    search: "搜索",
    settings: "设置",
    warning: "警告",
    confirm: "确认",
    edit: "编辑",
    save: "保存", // 新增的翻译，用于保存按钮的文本
    uncompleted: "未完成",
    completed: "已完成",
    cancel: "取消",
    clear: "清除",
    success: "成功",
    error: "错误",
    open: "打开设置",
    update: "更新",
  },
  alerts: {
    deleteTransaction: {
      title: "删除交易",
      message: "确定要删除此交易吗？此操作无法撤销。",
      success: "交易删除成功！",
      error: "删除交易失败。",
    },
    enableNotifications: "启用通知",
    deleteAccountError: "删除账号异常",
    deleteAccountConfirm: "你确定要删除账号？所有账号的数据将会丢失",
    updateSuccess: "更新记录成功",
    createSuccess: "创建记录成功",
    fillAmountCategory: "请填写金额和类别。",
    record: "记录",
    createError: "创建记录失败",
    updateError: "更新记录失败",
    deleteError: "删除记录失败",
    clearCache: {
      title: "清除缓存",
      message: "确定要清除缓存吗？此操作无法撤销。",
      success: "缓存清除成功！",
      error: "清除缓存失败。",
    },
    notifications: {
      title: "通知设置",
      message: "是否打开通知设置？",
      iosOnly: "此功能仅在iOS设备上可用。",
    },
    budget: {
      deleteTitle: "删除标题",
      deleteMessage: "删除信息",
      updateTitle: "更新标题",
      updateMessage: "更新信息",
    },
  },
};

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// 语言Provider组件
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  // 从AsyncStorage加载语言设置
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage === "en" || savedLanguage === "zh") {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  // 设置语言并保存到AsyncStorage
  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // 根据当前语言获取翻译
  const translations = language === "en" ? enTranslations : zhTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 自定义Hook用于使用语言上下文
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
