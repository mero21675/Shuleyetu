# Shuleyetu Mobile App Setup Guide

This guide provides instructions for creating a React Native or Flutter mobile app that uses the Shuleyetu API.

## Option 1: React Native Setup

### Prerequisites
- Node.js 16+ and npm
- Xcode (for iOS) or Android Studio (for Android)
- React Native CLI

### Initial Setup

```bash
# Create new React Native project
npx react-native init ShuleyetuMobile

cd ShuleyetuMobile

# Install required dependencies
npm install axios react-navigation react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install zustand react-query
npm install react-native-toast-notifications
```

### Project Structure

```
ShuleyetuMobile/
├── src/
│   ├── api/
│   │   ├── client.ts          # Axios instance
│   │   ├── orders.ts          # Order endpoints
│   │   ├── vendors.ts         # Vendor endpoints
│   │   └── auth.ts            # Authentication
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── VendorsScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── TrackOrderScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── VendorCard.tsx
│   │   ├── OrderCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── store/
│   │   ├── authStore.ts       # Zustand auth store
│   │   └── orderStore.ts      # Zustand order store
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useOrders.ts
│   └── App.tsx
├── app.json
└── package.json
```

### API Client Configuration

**src/api/client.ts**
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://shuleyetu.com/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      AsyncStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export default client;
```

### State Management with Zustand

**src/store/authStore.ts**
```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('auth_token', token);
      set({ token, user });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({ user: null, token: null });
  },

  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        set({ token });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Development
npm start
```

---

## Option 2: Flutter Setup

### Prerequisites
- Flutter SDK 3.0+
- Dart SDK
- Android Studio or Xcode

### Initial Setup

```bash
# Create new Flutter project
flutter create shuleyetu_mobile

cd shuleyetu_mobile

# Add dependencies to pubspec.yaml
flutter pub add http dio provider get_storage
flutter pub add flutter_toast
flutter pub add intl
```

### Project Structure

```
shuleyetu_mobile/
├── lib/
│   ├── api/
│   │   ├── api_client.dart
│   │   ├── orders_api.dart
│   │   └── vendors_api.dart
│   ├── models/
│   │   ├── vendor.dart
│   │   ├── order.dart
│   │   └── user.dart
│   ├── providers/
│   │   ├── auth_provider.dart
│   │   ├── order_provider.dart
│   │   └── vendor_provider.dart
│   ├── screens/
│   │   ├── home_screen.dart
│   │   ├── vendors_screen.dart
│   │   ├── orders_screen.dart
│   │   └── track_order_screen.dart
│   ├── widgets/
│   │   ├── vendor_card.dart
│   │   ├── order_card.dart
│   │   └── loading_spinner.dart
│   └── main.dart
├── pubspec.yaml
└── README.md
```

### API Client Configuration

**lib/api/api_client.dart**
```dart
import 'package:dio/dio.dart';
import 'package:get_storage/get_storage.dart';

class ApiClient {
  static const String baseUrl = 'https://shuleyetu.com/api';
  late Dio _dio;
  final _storage = GetStorage();

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = _storage.read('auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          _storage.remove('auth_token');
        }
        return handler.next(error);
      },
    ));
  }

  Future<Response> get(String path) => _dio.get(path);
  Future<Response> post(String path, dynamic data) => _dio.post(path, data: data);
  Future<Response> put(String path, dynamic data) => _dio.put(path, data: data);
  Future<Response> delete(String path) => _dio.delete(path);
}
```

### State Management with Provider

**lib/providers/auth_provider.dart**
```dart
import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';
import '../api/api_client.dart';

class AuthProvider with ChangeNotifier {
  final _apiClient = ApiClient();
  final _storage = GetStorage();
  
  String? _token;
  Map<String, dynamic>? _user;

  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _token != null;

  Future<void> login(String email, String password) async {
    try {
      final response = await _apiClient.post('/auth/login', {
        'email': email,
        'password': password,
      });
      
      _token = response.data['token'];
      _user = response.data['user'];
      
      await _storage.write('auth_token', _token);
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    await _storage.remove('auth_token');
    notifyListeners();
  }

  Future<void> restoreToken() async {
    _token = _storage.read('auth_token');
    notifyListeners();
  }
}
```

### Running the App

```bash
# iOS
flutter run -d ios

# Android
flutter run -d android

# Development
flutter run
```

---

## API Endpoints Used

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Vendors
- `GET /vendors` - List all vendors
- `GET /vendors/[vendorId]` - Get vendor details
- `GET /vendors/[vendorId]/inventory` - Get vendor inventory

### Orders
- `POST /orders` - Create new order
- `GET /orders/[orderId]` - Get order details
- `GET /orders/track` - Track order (public)
- `PUT /orders/[orderId]/status` - Update order status

### Payments
- `POST /payments/initiate` - Initiate payment
- `GET /payments/status` - Check payment status

---

## Environment Configuration

### React Native (.env)
```
REACT_APP_API_URL=https://shuleyetu.com/api
REACT_APP_ENV=production
```

### Flutter (lib/config/constants.dart)
```dart
class Constants {
  static const String apiUrl = 'https://shuleyetu.com/api';
  static const String appName = 'Shuleyetu';
  static const String appVersion = '1.0.0';
}
```

---

## Features to Implement

### Phase 1: Core Features
- [x] User authentication (login/signup)
- [x] Browse vendors
- [x] View vendor products
- [x] Create orders
- [x] Track orders

### Phase 2: Enhanced Features
- [ ] Push notifications
- [ ] Order history
- [ ] Saved favorites
- [ ] Payment integration (M-Pesa)
- [ ] User profile management

### Phase 3: Advanced Features
- [ ] Offline support
- [ ] Real-time order updates
- [ ] Advanced search and filters
- [ ] Reviews and ratings
- [ ] In-app chat support

---

## Testing

### React Native
```bash
npm test
npm run test:coverage
```

### Flutter
```bash
flutter test
flutter test --coverage
```

---

## Deployment

### React Native
- **iOS**: Use Xcode and App Store Connect
- **Android**: Use Android Studio and Google Play Console

### Flutter
- **iOS**: Use Xcode and App Store Connect
- **Android**: Use Android Studio and Google Play Console

---

## Performance Optimization

1. **Image Optimization**: Use lazy loading and caching
2. **API Caching**: Implement request caching with react-query/Provider
3. **Code Splitting**: Lazy load screens and components
4. **Bundle Size**: Monitor and optimize bundle size
5. **Network**: Implement request debouncing and throttling

---

## Security Best Practices

1. **Token Storage**: Use secure storage (Keychain/Keystore)
2. **SSL Pinning**: Implement certificate pinning
3. **Input Validation**: Validate all user inputs
4. **Error Handling**: Don't expose sensitive errors
5. **Data Encryption**: Encrypt sensitive data at rest

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/kadioko/Shuleyetu/issues
- Email: support@shuleyetu.com
- Documentation: https://docs.shuleyetu.com
