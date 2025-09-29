# Core Module Documentation

This directory contains the core functionality of the SACCO ESB frontend application, including services, utilities, models, and configuration.

## 📁 Directory Structure

```
core/
├── config/           # Configuration services
├── constants/        # Application constants
├── interceptors/     # HTTP interceptors
├── models/          # TypeScript interfaces
├── services/        # Business logic services
├── utils/           # Utility functions
└── guards/          # Route guards
```

## 🔧 Configuration

### API Configuration
The base URL for all API requests is centrally managed through:

- **`config/app.config.ts`** - Main application configuration
- **`config/api.config.ts`** - API-specific configuration
- **`environments/environment.ts`** - Environment-specific settings

### Changing API Base URL

To change the API base URL, update the `apiUrl` in the environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://10.20.1.12:8083/api'
};
```

## 🚀 Services

### AuthService
Handles authentication, token management, and user session.

**Key Methods:**
- `login(credentials)` - Authenticate user
- `logout()` - Clear session and redirect to login
- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user information
- `refreshToken()` - Refresh access token

### ApiService
Centralized HTTP client with automatic token handling.

**Key Methods:**
- `get<T>(endpoint, params?)` - GET request
- `post<T>(endpoint, data, params?)` - POST request
- `put<T>(endpoint, data, params?)` - PUT request
- `delete<T>(endpoint, params?)` - DELETE request
- `patch<T>(endpoint, data, params?)` - PATCH request

## 🔒 Security

### JWT Token Management
- Automatic token refresh when expired
- Secure token storage in localStorage
- Token validation and expiration checking

### HTTP Interceptors
- **AuthInterceptor** - Automatically adds Bearer tokens to requests
- **ErrorInterceptor** - Centralized error handling and user feedback

## 📊 Models

### Authentication Models
- `AuthenticationRequest` - Login credentials
- `AuthenticationResponse` - Token response
- `User` - User information
- `Role` - User roles and permissions

### Dashboard Models
- `TransactionDashboardResponse` - Dashboard analytics
- `TransactionLogsView` - Transaction logs display
- `TransactionLogsRequest` - Log filtering parameters

### Entity Models
- `Entity` - SACCO entity information
- `EntityContract` - Entity service contracts
- `AccountHolder` - Account holder details

## 🛠️ Utilities

### JwtUtil
JWT token manipulation and validation.

### StorageUtil
Safe localStorage operations with error handling.

### DateUtil
Date formatting and manipulation utilities.

## 📝 Constants

### API Endpoints
All API endpoints are defined in `constants/api.constants.ts` for easy maintenance.

### Application Constants
App-wide constants like user roles, transaction types, and statuses.

## 🔄 Usage Examples

### Making API Calls
```typescript
// Using ApiService
constructor(private apiService: ApiService) {}

getUsers() {
  return this.apiService.get<User[]>('/user/all');
}

createUser(userData: UserDto) {
  return this.apiService.post<MessageDto>('/user/save', userData);
}
```

### Authentication
```typescript
// Using AuthService
constructor(private authService: AuthService) {}

login(username: string, password: string) {
  this.authService.login({ username, password })
    .subscribe({
      next: (response) => console.log('Login successful'),
      error: (error) => console.error('Login failed', error)
    });
}
```

## 🎯 Best Practices

1. **Always use the ApiService** for HTTP requests instead of HttpClient directly
2. **Use constants** for API endpoints instead of hardcoded strings
3. **Handle errors** appropriately in components
4. **Use TypeScript interfaces** for type safety
5. **Follow the single responsibility principle** in services

## 🔧 Development

### Adding New API Endpoints
1. Add endpoint to `constants/api.constants.ts`
2. Create corresponding service method
3. Add TypeScript interfaces for request/response models
4. Update documentation

### Adding New Services
1. Create service in `services/` directory
2. Follow naming convention: `*.service.ts`
3. Use dependency injection for other services
4. Add proper error handling
5. Write unit tests

## 📚 Dependencies

- Angular HttpClient
- RxJS for reactive programming
- TypeScript for type safety
- Angular Router for navigation
