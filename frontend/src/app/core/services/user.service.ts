import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export type UserType = 'HUMAN' | 'APPLICATION';

export interface User {
  id: string;
  version: number;
  entityState: 'ACTIVE' | 'INACTIVE';
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string | null;
  username: string;
  userType: UserType;
  roleId: string | null;
  roleName: string | null;
  index?: number; // Optional index for table display
}

export interface UserApiResponse {
  result: User[];
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

export interface SingleUserApiResponse {
  result: User;
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all users from the API
   */
  getUsers(): Observable<User[]> {
    console.log('🎯 UserService: Fetching users from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.USERS.ALL);
    
    // Use getUserEndpoint method which bypasses /api prefix
    return this.apiService.getUserEndpoint<UserApiResponse>(API_ENDPOINTS.USERS.ALL)
      .pipe(
        map((response: UserApiResponse) => {
          console.log('📊 Raw API Response:', response);
          console.log('👥 Number of users received:', response?.result?.length || 0);
          console.log('🔍 Users data:', response?.result);
          return response.result || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching users:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`${API_ENDPOINTS.USERS.BY_ID}/${id}`);
  }

  /**
   * Get user by username
   */
  getUserByUsername(username: string): Observable<User> {
    return this.apiService.get<SingleUserApiResponse>(`${API_ENDPOINTS.USERS.BY_USERNAME}?username=${username}`)
      .pipe(
        map((response: SingleUserApiResponse) => {
          console.log('📊 Raw API Response for user by username:', response);
          return response.result;
        })
      );
  }

  /**
   * Create a new user
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.apiService.post<User>(API_ENDPOINTS.USERS.SAVE, user);
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`${API_ENDPOINTS.USERS.UPDATE}/${id}`, user);
  }

  /**
   * Get users by role
   */
  getUsersByRole(roleId: string): Observable<User[]> {
    return this.apiService.get<UserApiResponse>(`${API_ENDPOINTS.USERS.BY_ROLE}/${roleId}`)
      .pipe(
        map((response: UserApiResponse) => {
          console.log('📊 Raw API Response for role users:', response);
          return response.result || [];
        })
      );
  }

  /**
   * Get users by type
   */
  getUsersByType(userType: UserType): Observable<User[]> {
    return this.apiService.get<UserApiResponse>(`${API_ENDPOINTS.USERS.BY_TYPE}/${userType}`)
      .pipe(
        map((response: UserApiResponse) => {
          console.log('📊 Raw API Response for type users:', response);
          return response.result || [];
        })
      );
  }

}
