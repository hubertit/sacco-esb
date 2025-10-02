import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface Entity {
  id: string;
  version: number;
  entityState: 'ACTIVE' | 'INACTIVE';
  code: string;
  legalCode: string;
  entityId: string;
  entityName: string;
  district: string;
  index?: number; // Optional index for table display
}

export interface EntityApiResponse {
  result: Entity[];
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

export interface SingleEntityApiResponse {
  result: Entity;
  message: string | null;
  messageNumber: number;
  duration: number;
  elements: number;
  warning: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all entities from the API using POST method
   */
  getEntities(): Observable<Entity[]> {
    return this.apiService.post<EntityApiResponse>(API_ENDPOINTS.ENTITIES.ALL, {}).pipe(
      map(response => {
        if (response && response.result) {
          // Add index for table display
          return response.result.map((entity, index) => ({
            ...entity,
            index: index + 1
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching entities:', error);
        throw error;
      })
    );
  }

  /**
   * Get entity by ID using POST method
   */
  getEntityById(id: string): Observable<Entity> {
    return this.apiService.post<SingleEntityApiResponse>(`${API_ENDPOINTS.ENTITIES.BY_ID}/${id}`, {}).pipe(
      map(response => {
        if (response && response.result) {
          return response.result;
        }
        throw new Error('Entity not found');
      }),
      catchError(error => {
        console.error('Error fetching entity:', error);
        throw error;
      })
    );
  }

  /**
   * Add new entity
   */
  addEntity(entityData: Partial<Entity>): Observable<Entity> {
    return this.apiService.post<SingleEntityApiResponse>(API_ENDPOINTS.ENTITIES.ADD, entityData).pipe(
      map(response => {
        if (response && response.result) {
          return response.result;
        }
        throw new Error('Failed to create entity');
      }),
      catchError(error => {
        console.error('Error creating entity:', error);
        throw error;
      })
    );
  }

  /**
   * Create new entity (alias for addEntity)
   */
  createEntity(entityData: Partial<Entity>): Observable<Entity> {
    return this.addEntity(entityData);
  }

  /**
   * Update entity
   */
  updateEntity(id: string, entityData: Partial<Entity>): Observable<Entity> {
    return this.apiService.put<SingleEntityApiResponse>(`${API_ENDPOINTS.ENTITIES.BASE}/${id}`, entityData).pipe(
      map(response => {
        if (response && response.result) {
          return response.result;
        }
        throw new Error('Failed to update entity');
      }),
      catchError(error => {
        console.error('Error updating entity:', error);
        throw error;
      })
    );
  }

  /**
   * Delete entity using POST method
   */
  deleteEntity(id: string): Observable<boolean> {
    return this.apiService.post(`${API_ENDPOINTS.ENTITIES.BASE}/${id}/delete`, {}).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting entity:', error);
        throw error;
      })
    );
  }
}
