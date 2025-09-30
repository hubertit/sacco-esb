import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { Partner, PartnerApiResponse, SinglePartnerApiResponse } from '../models/partner.models';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all partners from the API
   */
  getPartners(): Observable<Partner[]> {
    console.log('🎯 PartnerService: Fetching partners from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.PARTNERS.ALL);
    
    // Use getPartnerEndpoint method which bypasses /api prefix and uses proxy
    // Note: This API returns a direct array, not wrapped in a result object
    return this.apiService.getPartnerEndpoint<Partner[]>(API_ENDPOINTS.PARTNERS.ALL)
      .pipe(
        map((response: Partner[]) => {
          console.log('📊 Raw API Response:', response);
          console.log('👥 Number of partners received:', response?.length || 0);
          console.log('🔍 Partners data:', response);
          return response || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching partners:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Get partner by ID
   */
  getPartnerById(id: string): Observable<Partner> {
    return this.apiService.getPartnerEndpoint<SinglePartnerApiResponse>(`${API_ENDPOINTS.PARTNERS.BY_ID}/${id}`)
      .pipe(
        map((response: SinglePartnerApiResponse) => {
          console.log('📊 Raw API Response for partner by ID:', response);
          return response.result;
        })
      );
  }
}
