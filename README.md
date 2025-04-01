# Money Recorder

A modern, feature-rich personal finance management mobile application built with React Native and Appwrite. Track your expenses, set budgets, monitor savings goals, and gain insights into your financial habits with a beautiful and intuitive interface.

## Features

### 💰 Expense & Income Tracking

- Record daily expenses and income with detailed categorization
- Support multiple expense categories (Eating, Traffic, Shopping, Entertainment, Living, etc.)
- Add custom tags, locations, and comments to transactions
- View transaction history with comprehensive filtering and search capabilities
- Multiple payment method support (Cash, Card, Transfer)

### 📊 Financial Analytics

- Interactive pie charts for expense and income category distribution
- Dynamic bar charts for monthly financial trends
- Detailed category-wise expense breakdown
- Income vs. Expense analysis with monthly comparisons
- Real-time financial statistics and insights

### 💹 Budget Management

- Set and manage monthly budgets for different expense categories
- Real-time budget tracking with visual progress indicators
- Category-specific budget monitoring
- Smart budget alerts and notifications
- Historical budget performance analysis

### 🎯 Savings Goals

- Create and track multiple savings goals
- Set target amounts and deadlines for financial objectives
- Monitor progress with visual indicators
- Categorize savings goals for better organization
- Track completion status and history

### 🌓 User Experience

- Intuitive and responsive user interface
- Dark mode support for comfortable viewing
- Multi-language support (English and Chinese)
- Offline data persistence
- Real-time data synchronization
- Smart search functionality

## Technology Stack

### Frontend Framework

- **React Native with Expo**: A powerful framework for building cross-platform mobile applications, providing a smooth and native user experience.

### UI/Styling

- **NativeWind (TailwindCSS for React Native)**: Utility-first CSS framework that enables rapid UI development with consistent styling.
- **@expo/vector-icons**: Comprehensive icon set for enhanced UI elements.

### Backend Service

- **Appwrite**: Secure and scalable backend platform providing:
  - User authentication and management
  - Real-time database operations
  - File storage and management
  - Cloud functions and automation

### State Management

- **React Context API**: Efficient global state management for:
  - Theme preferences (Light/Dark mode)
  - Language settings
  - User authentication state
  - App configuration

### Data Visualization

- **React Native Chart Kit**: Advanced charting library for:
  - Interactive pie charts
  - Dynamic bar charts
  - Financial trend analysis
  - Budget progress visualization

### Navigation

- **Expo Router**: File-based routing system providing:
  - Seamless screen navigation
  - Deep linking support
  - Type-safe routing
  - Nested navigation structures

### Storage & Persistence

- **@react-native-async-storage/async-storage**: Local data persistence for:
  - User preferences
  - Offline data access
  - Cache management
  - Session handling

### Animation & Interaction

- **React Native Reanimated**: Fluid animations and interactions
- **React Native Safe Area Context**: Adaptive layout management

## Project Structure

```
├── app/                  # Main application screens
│   ├── (func)/          # Core functionality components
│   │   ├── Budget.tsx   # Budget management
│   │   ├── depositGoal.tsx # Savings goals
│   │   └── searchbar.tsx   # Search functionality
│   ├── (profile)/       # User profile related screens
│   └── (tabs)/          # Main navigation tabs
├── components/          # Reusable UI components
├── constants/           # App constants and configurations
│   ├── categories.ts    # Transaction categories
│   └── languages.ts     # Internationalization
├── contexts/            # Global state management
│   ├── LanguageContext.tsx # Language settings
│   └── ThemeContext.tsx    # Theme management
├── services/            # API and backend services
└── utils/               # Utility functions
```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
