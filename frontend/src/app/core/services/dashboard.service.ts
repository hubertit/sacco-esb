import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LogService } from './log.service';
import { PartnerService } from './partner.service';

export interface DashboardMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  totalPartners: number;
  activeIntegrations: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastUpdated: string;
}

export interface TransactionSummary {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
}

export interface PartnerSummary {
  total: number;
  active: number;
  inactive: number;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: number;
  lastIncident?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private apiService: ApiService,
    private logService: LogService,
    private partnerService: PartnerService
  ) {}

  /**
   * Get comprehensive dashboard metrics
   */
  getDashboardMetrics(): Observable<DashboardMetrics> {
    return forkJoin({
      transactionSummary: this.getTransactionSummary(),
      partnerSummary: this.getPartnerSummary(),
      systemHealth: this.getSystemHealth()
    }).pipe(
      map(({ transactionSummary, partnerSummary, systemHealth }) => ({
        totalTransactions: transactionSummary.total,
        successfulTransactions: transactionSummary.successful,
        failedTransactions: transactionSummary.failed,
        successRate: transactionSummary.successRate,
        totalPartners: partnerSummary.total,
        activeIntegrations: partnerSummary.active,
        systemHealth: systemHealth.status,
        lastUpdated: new Date().toISOString()
      })),
      catchError((error) => {
        console.error('Error fetching dashboard metrics:', error);
        // Return default metrics on error
        return of({
          totalTransactions: 0,
          successfulTransactions: 0,
          failedTransactions: 0,
          successRate: 0,
          totalPartners: 0,
          activeIntegrations: 0,
          systemHealth: 'error' as const,
          lastUpdated: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Get transaction summary statistics
   */
  getTransactionSummary(): Observable<TransactionSummary> {
    // This would typically call a real API endpoint
    // For now, we'll simulate with mock data that could be replaced with real API calls
    return of({
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      successRate: 0
    });
  }

  /**
   * Get partner summary statistics
   */
  getPartnerSummary(): Observable<PartnerSummary> {
    return this.partnerService.getPartners().pipe(
      map(partners => ({
        total: partners.length,
        active: partners.length, // All partners are considered active for now
        inactive: 0
      })),
      catchError(() => of({
        total: 0,
        active: 0,
        inactive: 0
      }))
    );
  }

  /**
   * Get system health status
   */
  getSystemHealth(): Observable<SystemHealth> {
    // This would typically check various system endpoints
    return of({
      status: 'healthy',
      uptime: '99.9%',
      responseTime: 120
    });
  }

  /**
   * Get recent transaction logs for dashboard
   */
  getRecentTransactions(limit: number = 10): Observable<any[]> {
    // This would call the logs API with pagination
    return of([]);
  }

  /**
   * Get recent integration logs for dashboard
   */
  getRecentIntegrations(limit: number = 10): Observable<any[]> {
    // This would call the integration logs API with pagination
    return of([]);
  }

  /**
   * Get error trends for the last 24 hours
   */
  getErrorTrends(): Observable<any[]> {
    // This would analyze error logs and return trends
    return of([]);
  }

  /**
   * Get transaction volume trends
   */
  getTransactionVolumeTrends(): Observable<any[]> {
    // This would analyze transaction logs and return volume trends
    return of([]);
  }
}
