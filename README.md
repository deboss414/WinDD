# WinDD

A React Native mobile application built with Expo and TypeScript.

## Project Structure

```
WinDD/
├── assets/
│   └── images/
├── src/
│   ├── api/          # API integration and services
│   ├── components/   # Reusable components
│   │   └── common/   # Shared components
│   ├── contexts/     # React Context providers
│   ├── hooks/        # Custom React hooks
│   ├── navigation/   # Navigation configuration
│   ├── screens/      # Application screens
│   │   └── auth/     # Authentication screens
│   ├── utils/        # Utility functions
│   └── constants/    # Application constants
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the App

```bash
# Start the development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

You can run the app in:
- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Dependencies

### Core Dependencies
- React Navigation
- Axios
- AsyncStorage
- TypeScript
- Expo SDK

### Development Tools
- ESLint
- Prettier
- Jest for testing
- TypeScript

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Navigation documentation](https://reactnavigation.org/)
- [TypeScript documentation](https://www.typescriptlang.org/)

## Community and Support

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
- [React Native community](https://reactnative.dev/community/overview)
