/*
 * @Date: 2025-04-02
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-02 13:35:22
 * @FilePath: /Money_Recorder/constants/demoData.ts
 */

export const demoRecords = [
  {
    $id: "demo1",
    moneyAmount: 25.99,
    type: "expense",
    category: "eating",
    paymentMethod: "Cash",
    location: "Melbourne",
    tags: ["Food"],
    comment: "with friend",
    $createdAt: new Date(2025, 3, 1).toISOString(),
  },
  {
    $id: "demo2",
    moneyAmount: 1500,
    type: "income",
    category: "salary",
    paymentMethod: "Bank Transfer",
    location: "Company",
    tags: ["Salary"],
    comment: "Monthly salary",
    $createdAt: new Date(2025, 3, 1).toISOString(),
  },
  {
    $id: "demo3",
    moneyAmount: 45.5,
    type: "expense",
    category: "shopping",
    paymentMethod: "Credit Card",
    location: "Mall",
    tags: ["beauty"],
    comment: "New clothes",
    $createdAt: new Date(2025, 3, 2).toISOString(),
  },
];

export const demoGoals = [
  {
    goalName: "Emergency Fund",
    targetAmount: 5000,
    currentAmount: 2500,
    deadline: new Date(2025, 8, 1).toISOString(),
    description: "Building emergency savings",
  },
  {
    goalName: "Vacation",
    targetAmount: 2000,
    currentAmount: 800,
    deadline: new Date(2025, 11, 31).toISOString(),
    description: "Summer vacation fund",
  },
];

export const demoBudget = [
  { category: "total", budgetAmount: 0 },
  { category: "eating", budgetAmount: 500 },
  { category: "traffic", budgetAmount: 300 },
  { category: "shopping", budgetAmount: 400 },
  { category: "entertainment", budgetAmount: 300 },
  { category: "living", budgetAmount: 800 },
  { category: "medication", budgetAmount: 200 },
  { category: "education", budgetAmount: 500 },
];
