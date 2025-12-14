# API Service Documentation

## Overview

This directory contains the API service layer for Hubbble. It provides a centralized way to handle all API calls using axios with interceptors for authentication, error handling, and request/response transformation.

## Structure

```
lib/api/
├── client.ts              # Axios instance with interceptors
├── types.ts               # Common API types
├── services/
│   ├── auth.service.ts   # Authentication API endpoints
│   └── index.ts          # Service exports
└── index.ts              # Main API exports
```

## Usage

### Basic Example

```typescript
import { login } from '@/lib/api';

// In your component
const handleLogin = async () => {
  try {
    const response = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (response.success) {
      // Token is automatically stored in localStorage
      router.push('/home');
    }
  } catch (error) {
    // Error is already transformed by interceptor
    console.error(error.message);
  }
};
```

### Adding New Services

1. Create a new service file in `services/`:
```typescript
// lib/api/services/users.service.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types';

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await apiClient.get<ApiResponse<User[]>>('/users');
  return response.data;
};
```

2. Export it from `services/index.ts`:
```typescript
export * from './users.service';
```

3. Use it in your components:
```typescript
import { getUsers } from '@/lib/api';
```

## Environment Variables

Set the API base URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.Hubbble.com
```

If not set, defaults to `http://localhost:3000/api`

## Features

### Request Interceptor
- Automatically adds auth token from localStorage
- Adds common headers
- Adds request ID for tracking

### Response Interceptor
- Handles 401 errors (auto-logout and redirect)
- Handles 403 errors
- Transforms errors to consistent format
- Network error handling

### Token Management
- Tokens are automatically stored in localStorage on successful login/signup
- Tokens are automatically added to requests via Authorization header
- Tokens are cleared on 401 errors

## Error Handling

All API errors are transformed to a consistent format:

```typescript
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
```

Field-specific errors are available in `errors` object, which can be mapped to form fields.

