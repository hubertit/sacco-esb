export interface AuthenticationRequest {
  username: string;
  password: string;
}

export interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
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
