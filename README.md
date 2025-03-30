# Money Recorder

A modern, feature-rich personal finance management mobile application built with React Native and Appwrite. Track your expenses, set budgets, monitor savings goals, and gain insights into your financial habits.

## Features

### 💰 Expense & Income Tracking

- Record daily expenses and income with detailed categorization
- Support multiple expense categories (Eating, Traffic, Shopping, etc.)
- Add custom tags and comments to transactions
- View transaction history with detailed information

### 📊 Financial Analytics

- Visual representation of expenses through pie and bar charts
- Category-wise expense breakdown
- Income vs. Expense analysis
- Monthly financial overview

### 💹 Budget Management

- Set monthly budgets for different categories
- Real-time budget tracking and monitoring
- Visual budget progress indicators
- Budget alerts and notifications

### 🎯 Savings Goals

- Set and track deposit goals

- Monitor progress towards financial targets

- Visual progress tracking

  

## Technology Stack

### Frontend Framework
- **React Native with Expo**: A framework for building cross-platform mobile applications using React Native. Expo simplifies the development process and streamlines deployment.

### UI/Styling
- **NativeWind (TailwindCSS for React Native)**: Utility-first CSS for React Native that brings the power of TailwindCSS to mobile app development, providing rapid styling and customization.

### Backend Service
- **Appwrite**: A self-hosted backend platform that provides services like authentication, database management, file storage, and more, making it easy to build secure and scalable web and mobile applications.

### State Management
- **React Context API**: A simple and effective way to manage global state across the app without relying on external state management libraries like Redux.

### Data Visualization
- **React Native Chart Kit**: A library to create interactive and customizable charts and graphs for visualizing data in the app, perfect for displaying budget reports, financial charts, and more.

### Navigation
- **Expo Router**: A file-based routing solution for Expo apps, providing a simple and flexible way to manage navigation and screens in your React Native app.

---

### Additional Dependencies:
- **@expo/vector-icons**: A collection of customizable icons to use in the app.
- **@react-navigation/native**: A popular navigation library for React Native, enabling screen transitions and stack management.
- **@react-native-async-storage/async-storage**: For persisting key-value pairs locally on the device.
- **React Native Reanimated**: A library for building complex animations in React Native with a smooth performance.
- **Victory Native**: A library for data visualization with support for charts and graphs.
- **React Native Safe Area Context**: Helps manage safe areas and ensure UI elements don't overlap with system UI.

---

### Dev Tools:
- **TypeScript**: A statically typed language that enhances JavaScript with type safety, improving code quality and developer experience.
- **Jest**: A testing framework used to write and run tests for your React Native app.
- **Expo CLI**: Command-line tools provided by Expo to develop, build, and deploy React Native apps.

---

This tech stack offers a modern, scalable, and developer-friendly environment to build a mobile application with clean code and beautiful design. The combination of React Native with Expo, Appwrite backend services, and NativeWind for styling ensures fast development and smooth deployment across platforms.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI
- Appwrite Server

### Installation

1. Clone the repository

```bash
git clone https://github.com/HAONANTAO/Money_Recorder.git
cd Money_Recorder
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   Create a `.env` file in the root directory and add your Appwrite configuration:

```env
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
```

4. Start the development server

```bash
npx expo start
```

5. Run on your device

- Scan the QR code with Expo Go (iOS/Android)
- Press 'i' for iOS simulator
- Press 'a' for Android emulator

## Project Structure

```
├── app/                  # Main application screens
│   ├── (func)/          # Functional components
│   ├── (profile)/       # Profile related screens
│   └── (tabs)/          # Tab navigation screens
├── assets/              # Static assets
├── components/          # Reusable components
├── constants/           # Constants and configurations
├── contexts/            # React Context providers
├── services/            # API and service integrations
└── utils/               # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
