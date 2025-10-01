import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LogData, LogFilterRequest, IntegrationLogData, IntegrationLogFilterRequest, IntegrationLogApiResponse } from '../models/log-data.models';

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
export type LogSource = 'API' | 'SYSTEM' | 'AUTH' | 'DATABASE' | 'INTEGRATION';

export interface Log {
  id: number;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  details: string;
  userId?: string;
  entityId?: string;
  transactionId?: string;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private mockLogs: Log[] = [
    {
      id: 1,
      timestamp: '2024-03-16T12:30:00',
      level: 'INFO',
      source: 'API',
      message: 'API request successful',
      details: 'GET /api/v1/entities - 200 OK',
      userId: 'john.doe',
      entityId: 'ENT001',
      transactionId: 'TRX123',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-03-16T12:29:45',
      level: 'ERROR',
      source: 'DATABASE',
      message: 'Database connection failed',
      details: 'Connection timeout after 30s',
      transactionId: 'TRX122'
    },
    {
      id: 3,
      timestamp: '2024-03-16T12:28:30',
      level: 'WARNING',
      source: 'AUTH',
      message: 'Failed login attempt',
      details: 'Multiple failed attempts from same IP',
      userId: 'unknown',
      ipAddress: '192.168.1.101'
    },
    {
      id: 4,
      timestamp: '2024-03-16T12:27:15',
      level: 'INFO',
      source: 'SYSTEM',
      message: 'System backup completed',
      details: 'Backup size: 2.5GB'
    },
    {
      id: 5,
      timestamp: '2024-03-16T12:26:00',
      level: 'ERROR',
      source: 'INTEGRATION',
      message: 'Integration webhook failed',
      details: 'Endpoint not responding: https://api.external.com/webhook',
      entityId: 'ENT002',
      transactionId: 'TRX121'
    },
    {
      id: 6,
      timestamp: '2024-03-16T12:25:30',
      level: 'DEBUG',
      source: 'API',
      message: 'Request validation',
      details: 'Payload validation passed for POST /api/v1/transactions',
      userId: 'jane.smith',
      transactionId: 'TRX120'
    },
    {
      id: 7,
      timestamp: '2024-03-16T12:24:15',
      level: 'INFO',
      source: 'AUTH',
      message: 'User session expired',
      details: 'Session timeout after 30 minutes',
      userId: 'michael.chen',
      ipAddress: '192.168.1.102'
    },
    {
      id: 8,
      timestamp: '2024-03-16T12:23:00',
      level: 'WARNING',
      source: 'SYSTEM',
      message: 'High CPU usage detected',
      details: 'CPU usage at 85% for 5 minutes'
    },
    {
      id: 9,
      timestamp: '2024-03-16T12:22:45',
      level: 'ERROR',
      source: 'DATABASE',
      message: 'Query execution failed',
      details: 'Deadlock detected on table: transactions',
      transactionId: 'TRX119'
    },
    {
      id: 10,
      timestamp: '2024-03-16T12:21:30',
      level: 'INFO',
      source: 'INTEGRATION',
      message: 'New entity registered',
      details: 'Entity type: Financial Institution',
      entityId: 'ENT003',
      userId: 'admin'
    }
  ];

  constructor(private http: HttpClient, private apiService: ApiService) {}

  getMockLogs(): Log[] {
    return this.mockLogs;
  }

  getLogLevels(): LogLevel[] {
    return ['INFO', 'WARNING', 'ERROR', 'DEBUG'];
  }

  getLogSources(): LogSource[] {
    return ['API', 'SYSTEM', 'AUTH', 'DATABASE', 'INTEGRATION'];
  }

  /**
   * Fetch push transaction logs from API
   */
  getPushLogs(filters: LogFilterRequest): Observable<LogData[]> {
    console.log('🎯 LogService: Fetching push logs from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.LOGS.FILTER_PUSH);
    console.log('📋 Filters:', filters);

    return this.apiService.postLogsEndpoint<LogData[]>(API_ENDPOINTS.LOGS.FILTER_PUSH, filters)
      .pipe(
        map((response: LogData[]) => {
          console.log('📊 Raw API Response:', response);
          console.log('📈 Number of logs received:', response?.length || 0);
          return response || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching push logs:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Fetch pull transaction logs from API
   */
  getPullLogs(filters: LogFilterRequest): Observable<LogData[]> {
    console.log('🎯 LogService: Fetching pull logs from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.LOGS.FILTER_PULL);
    console.log('📋 Filters:', filters);

    return this.apiService.postLogsEndpoint<LogData[]>(API_ENDPOINTS.LOGS.FILTER_PULL, filters)
      .pipe(
        map((response: LogData[]) => {
          console.log('📊 Raw API Response:', response);
          console.log('📈 Number of logs received:', response?.length || 0);
          return response || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching pull logs:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Fetch internal transaction logs from API
   */
  getInternalLogs(filters: LogFilterRequest): Observable<LogData[]> {
    console.log('🎯 LogService: Fetching internal logs from API');
    console.log('🔗 API Endpoint:', API_ENDPOINTS.LOGS.FILTER_INTERNAL);
    console.log('📋 Filters:', filters);

    return this.apiService.postLogsEndpoint<LogData[]>(API_ENDPOINTS.LOGS.FILTER_INTERNAL, filters)
      .pipe(
        map((response: LogData[]) => {
          console.log('📊 Raw API Response:', response);
          console.log('📈 Number of logs received:', response?.length || 0);
          return response || [];
        }),
        catchError((error) => {
          console.error('❌ Error fetching internal logs:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Fetch integration logs for a specific partner
   */
  getIntegrationLogs(partnerId: string, filters: IntegrationLogFilterRequest = {}): Observable<IntegrationLogApiResponse> {
    console.log('🎯 LogService: Fetching integration logs for partner:', partnerId);
    console.log('🔗 API Endpoint:', `${API_ENDPOINTS.INTEGRATION_LOGS.PARTNER_LOGS}/${partnerId}`);
    console.log('📋 Filters:', filters);

    const params = new URLSearchParams();
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const endpoint = `${API_ENDPOINTS.INTEGRATION_LOGS.PARTNER_LOGS}/${partnerId}`;

    return this.apiService.get<IntegrationLogApiResponse>(endpoint, new HttpParams({ fromString: params.toString() }))
      .pipe(
        map((response: IntegrationLogApiResponse) => {
          console.log('📊 Raw Integration Logs API Response:', response);
          console.log('📈 Number of integration logs received:', response?.content?.length || 0);
          return response;
        }),
        catchError((error) => {
          console.error('❌ Error fetching integration logs:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          console.error('❌ Error URL:', error.url);
          throw error;
        })
      );
  }

  /**
   * Get integration log status options
   */
  getIntegrationLogStatuses(): string[] {
    return ['COMPLETED', 'TIMEOUT', 'FAILED', 'FAILURE', 'PENDING', 'PROCESSING'];
  }

  /**
   * Get integration log direction options
   */
  getIntegrationLogDirections(): string[] {
    return ['IN', 'OUT', 'INTERNAL'];
  }

  /**
   * Get integration log message types
   */
  getIntegrationLogMessageTypes(): string[] {
    return ['SEND_ONLY', 'SEND_AND_RECEIVE'];
  }

  /**
   * Generic method to get logs with filters (used by dashboard service)
   */
  getLogs(filters: any): Observable<any> {
    console.log('🎯 LogService: Generic getLogs called with filters:', filters);
    
    // Determine which type of logs to fetch based on filters
    if (filters.type === 'push') {
      return this.getPushLogs(filters);
    } else if (filters.type === 'pull') {
      return this.getPullLogs(filters);
    } else if (filters.type === 'internal') {
      return this.getInternalLogs(filters);
    } else {
      // Default to push logs if no type specified
      return this.getPushLogs(filters);
    }
  }
}
