export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export interface ApiResponse<T> {
  result: T;
  message: string;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

export interface ApiError {
  message: string;
  dateTime: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  userType: string;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  permissions: string[];
}

export interface UserDto {
  userId?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  role: Role;
  userType: string;
  isActive: boolean;
}
