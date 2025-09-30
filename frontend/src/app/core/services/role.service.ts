import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Role, RoleApiResponse, SingleRoleApiResponse, RoleType } from '../models/role.models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all roles from the API
   */
  getRoles(): Observable<Role[]> {
    console.log('🎯 RoleService: Fetching roles from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.ROLES.ALL);
    
    // Use getRoleEndpoint method which bypasses /api prefix and uses proxy
    return this.apiService.getRoleEndpoint<RoleApiResponse>(API_ENDPOINTS.ROLES.ALL)
      .pipe(
        map((response: RoleApiResponse) => {
          console.log('📊 Raw API Response:', response);
          console.log('👥 Number of roles received:', response?.result?.length || 0);
          console.log('🔍 Roles data:', response?.result);
          return response.result || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching roles:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Get role by ID
   */
  getRoleById(id: string): Observable<Role> {
    return this.apiService.getRoleEndpoint<SingleRoleApiResponse>(`${API_ENDPOINTS.ROLES.BY_ID}/${id}`)
      .pipe(
        map((response: SingleRoleApiResponse) => {
          console.log('📊 Raw API Response for role by ID:', response);
          return response.result;
        })
      );
  }

  /**
   * Create a new role
   */
  createRole(role: Partial<Role>): Observable<Role> {
    return this.apiService.postRoleEndpoint<Role>(API_ENDPOINTS.ROLES.SAVE, role);
  }

  /**
   * Update an existing role
   */
  updateRole(id: string, role: Partial<Role>): Observable<Role> {
    return this.apiService.putRoleEndpoint<Role>(`${API_ENDPOINTS.ROLES.UPDATE}/${id}`, role);
  }

  /**
   * Get roles by type
   */
  getRolesByType(roleType: RoleType): Observable<Role[]> {
    return this.apiService.getRoleEndpoint<RoleApiResponse>(`${API_ENDPOINTS.ROLES.BY_TYPE}/${roleType}`)
      .pipe(
        map((response: RoleApiResponse) => {
          console.log('📊 Raw API Response for type roles:', response);
          return response.result || [];
        })
      );
  }
}
