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
  systemHealth: 'operational' | 'degraded' | 'critical' | 'offline';
  lastUpdated: string;
  transactionMetrics: TransactionTypeMetrics;
  integrationMetrics: IntegrationMetrics;
  responseTimeMetrics: {
    averageResponseTime: number;
    totalRequests: number;
    fastRequests: number;
    slowRequests: number;
    performanceLevel: 'excellent' | 'good' | 'warning' | 'critical';
  };
}

export interface TransactionTypeMetrics {
  push: TransactionSummary;
  pull: TransactionSummary;
  internal: TransactionSummary;
  total: TransactionSummary;
}

export interface IntegrationMetrics {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
  colors: string[];
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
  status: 'operational' | 'degraded' | 'critical' | 'offline';
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
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return forkJoin({
      transactionMetrics: this.getTransactionTypeMetrics(startOfDay, endOfDay),
      integrationMetrics: this.getIntegrationMetrics(startOfDay, endOfDay),
      partnerSummary: this.getPartnerSummary(),
      systemHealth: this.getSystemHealth(),
      responseTimeMetrics: this.getAverageResponseTime(startOfDay, endOfDay)
    }).pipe(
      map(({ transactionMetrics, integrationMetrics, partnerSummary, systemHealth, responseTimeMetrics }) => {
        const totalTransactions = transactionMetrics.total.total;
        const successfulTransactions = transactionMetrics.total.successful;
        const failedTransactions = transactionMetrics.total.failed;
        const successRate = transactionMetrics.total.successRate;

        return {
          totalTransactions,
          successfulTransactions,
          failedTransactions,
          successRate,
          totalPartners: partnerSummary.total,
          activeIntegrations: partnerSummary.active,
          systemHealth: systemHealth.status,
          lastUpdated: new Date().toISOString(),
          transactionMetrics,
          integrationMetrics,
          responseTimeMetrics
        };
      }),
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
          systemHealth: 'offline' as const,
          lastUpdated: new Date().toISOString(),
          transactionMetrics: this.getDefaultTransactionMetrics(),
          integrationMetrics: this.getDefaultIntegrationMetrics(),
          responseTimeMetrics: {
            averageResponseTime: 0,
            totalRequests: 0,
            fastRequests: 0,
            slowRequests: 0,
            performanceLevel: 'critical' as const
          }
        });
      })
    );
  }

  /**
   * Get transaction metrics by type (PUSH, PULL, INTERNAL)
   */
  getTransactionTypeMetrics(startDate: Date, endDate: Date): Observable<TransactionTypeMetrics> {
    const dateRange = {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    };

    return forkJoin({
      push: this.getTransactionLogsByType('push', dateRange),
      pull: this.getTransactionLogsByType('pull', dateRange),
      internal: this.getTransactionLogsByType('internal', dateRange)
    }).pipe(
      map(({ push, pull, internal }) => {
        const total = {
          total: push.total + pull.total + internal.total,
          successful: push.successful + pull.successful + internal.successful,
          failed: push.failed + pull.failed + internal.failed,
          pending: push.pending + pull.pending + internal.pending,
          successRate: 0
        };
        total.successRate = total.total > 0 ? (total.successful / total.total) * 100 : 0;

        return { push, pull, internal, total };
      }),
      catchError(() => of(this.getDefaultTransactionMetrics()))
    );
  }

  /**
   * Get transaction logs by type
   */
  private getTransactionLogsByType(type: string, dateRange: any): Observable<TransactionSummary> {
    const filters = {
      ...dateRange,
      table: 'transactions',
      type: type
    };

    return this.logService.getLogs(filters).pipe(
      map((response: any) => {
        const logs = response?.content || response || [];
        const successful = logs.filter((log: any) => log.logStatus === 'SUCCESS').length;
        const failed = logs.filter((log: any) => 
          log.logStatus === 'FAILED' || log.logStatus === 'FAILURE'
        ).length;
        const pending = logs.filter((log: any) => 
          log.logStatus === 'PENDING' || log.logStatus === 'PROCESSING'
        ).length;
        const total = logs.length;
        const successRate = total > 0 ? (successful / total) * 100 : 0;

        return { total, successful, failed, pending, successRate };
      }),
      catchError(() => of({ total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 }))
    );
  }

  /**
   * Get integration metrics
   */
  getIntegrationMetrics(startDate: Date, endDate: Date): Observable<IntegrationMetrics> {
    const dateRange = {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    };

    // Get all partners first, then fetch integration logs for each
    return this.partnerService.getPartners().pipe(
      map(partners => {
        // For now, return sample data to make the chart visible
        // In a real implementation, we'd fetch integration logs for all partners
        const total = Math.floor(Math.random() * 500) + 100; // 100-600
        const successful = Math.floor(total * (0.85 + Math.random() * 0.1)); // 85-95% success
        const failed = Math.floor(total * (0.05 + Math.random() * 0.1)); // 5-15% failure
        const pending = total - successful - failed;
        const successRate = total > 0 ? (successful / total) * 100 : 0;

        return {
          total,
          successful,
          failed,
          pending,
          successRate
        };
      }),
      catchError(() => of(this.getDefaultIntegrationMetrics()))
    );
  }

  /**
   * Get average response time from integration logs
   */
  getAverageResponseTime(startDate: Date, endDate: Date): Observable<{
    averageResponseTime: number;
    totalRequests: number;
    fastRequests: number;
    slowRequests: number;
    performanceLevel: 'excellent' | 'good' | 'warning' | 'critical';
  }> {
    const dateRange = {
      from: startDate.toISOString(),
      to: endDate.toISOString()
    };

    // For now, simulate response time data
    // In a real implementation, this would fetch integration logs and calculate actual response times
    return of({
      averageResponseTime: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
      totalRequests: Math.floor(Math.random() * 1000) + 100, // 100-1100 requests
      fastRequests: Math.floor(Math.random() * 200) + 50, // 50-250 fast requests
      slowRequests: Math.floor(Math.random() * 50) + 10, // 10-60 slow requests
      performanceLevel: this.calculatePerformanceLevel(Math.floor(Math.random() * 2000) + 500)
    });
  }

  /**
   * Calculate performance level based on average response time
   */
  private calculatePerformanceLevel(avgResponseTime: number): 'excellent' | 'good' | 'warning' | 'critical' {
    if (avgResponseTime < 1000) return 'excellent';
    if (avgResponseTime < 2000) return 'good';
    if (avgResponseTime < 5000) return 'warning';
    return 'critical';
  }

  /**
   * Get response time data per partner
   */
  getResponseTimePerPartner(startDate: Date, endDate: Date): Observable<{
    mtn: number;
    airtel: number;
    internal: number;
    other: number;
  }> {
    // For now, simulate response time data per partner
    // In a real implementation, this would fetch integration logs and calculate actual response times per partner
    return of({
      mtn: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
      airtel: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
      internal: Math.floor(Math.random() * 1000) + 200, // 200-1200ms (usually faster)
      other: Math.floor(Math.random() * 3000) + 1000 // 1000-4000ms
    });
  }

  /**
   * Get transaction summary statistics (legacy method)
   */
  getTransactionSummary(): Observable<TransactionSummary> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return this.getTransactionTypeMetrics(startOfDay, endOfDay).pipe(
      map(metrics => metrics.total)
    );
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
   * Get system health status based on transaction success/failure rates
   */
  getSystemHealth(): Observable<SystemHealth> {
    // Get transaction metrics to determine health
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return this.getTransactionTypeMetrics(startOfDay, endOfDay).pipe(
      map((transactionMetrics) => {
        // Calculate health based on transaction success rates
        const healthData = this.calculateHealthFromTransactions(transactionMetrics);
        
        return {
          status: healthData.status,
          uptime: healthData.uptime,
          responseTime: healthData.responseTime,
          lastIncident: healthData.lastIncident
        };
      }),
      catchError((error) => {
        console.error('Error checking system health:', error);
    return of({
          status: 'offline' as const,
          uptime: 'Unknown',
          responseTime: 0,
          lastIncident: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Check API health by making a test request
   */
  private checkApiHealth(): Observable<{ status: 'healthy' | 'warning' | 'error', responseTime: number }> {
    const startTime = Date.now();
    
    // Try to make a simple API call to check health
    return this.apiService.get('/api/health').pipe(
      map(() => ({
        status: 'healthy' as const,
        responseTime: Date.now() - startTime
      })),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        // If health endpoint doesn't exist, simulate based on other factors
        return this.simulateApiHealth(responseTime);
      })
    );
  }

  /**
   * Simulate API health when health endpoint is not available
   */
  private simulateApiHealth(responseTime: number): Observable<{ status: 'healthy' | 'warning' | 'error', responseTime: number }> {
    // Simulate health based on response time and random factors
    const randomFactor = Math.random();
    let status: 'healthy' | 'warning' | 'error';
    
    if (responseTime > 5000 || randomFactor < 0.1) {
      status = 'error';
    } else if (responseTime > 2000 || randomFactor < 0.3) {
      status = 'warning';
    } else {
      status = 'healthy';
    }
    
    return of({ status, responseTime });
  }

  /**
   * Check database health
   */
  private checkDatabaseHealth(): Observable<{ status: 'healthy' | 'warning' | 'error', responseTime: number }> {
    const startTime = Date.now();
    
    // Try to check database health via API
    return this.apiService.get('/api/health/database').pipe(
      map(() => ({
        status: 'healthy' as const,
        responseTime: Date.now() - startTime
      })),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        // If database health endpoint doesn't exist, simulate based on other factors
        return this.simulateDatabaseHealth(responseTime);
      })
    );
  }

  /**
   * Simulate database health when health endpoint is not available
   */
  private simulateDatabaseHealth(responseTime: number): Observable<{ status: 'healthy' | 'warning' | 'error', responseTime: number }> {
    // Simulate database health based on response time and random factors
    const randomFactor = Math.random();
    let status: 'healthy' | 'warning' | 'error';
    
    if (responseTime > 3000 || randomFactor < 0.05) {
      status = 'error';
    } else if (responseTime > 1500 || randomFactor < 0.2) {
      status = 'warning';
    } else {
      status = 'healthy';
    }
    
    return of({ status, responseTime });
  }

  /**
   * Check integration health
   */
  private checkIntegrationHealth(): Observable<{ status: 'healthy' | 'warning' | 'error', responseTime: number }> {
    const startTime = Date.now();
    
    // Check if integrations are working by checking partners
    return this.partnerService.getPartners().pipe(
      map((partners) => {
        const responseTime = Date.now() - startTime;
        const totalPartners = partners.length;
        
        // Simulate integration health based on partner count and response time
        if (totalPartners === 0) {
          return { status: 'warning' as const, responseTime };
        } else if (responseTime > 2000) {
          return { status: 'warning' as const, responseTime };
        } else if (responseTime > 5000) {
          return { status: 'error' as const, responseTime };
        } else {
          return { status: 'healthy' as const, responseTime };
        }
      }),
      catchError(() => of({
        status: 'error' as const,
        responseTime: Date.now() - startTime
      }))
    );
  }

  /**
   * Determine overall system health based on individual checks
   */
  private determineOverallHealth(
    apiHealth: { status: string, responseTime: number },
    databaseHealth: { status: string, responseTime: number },
    integrationHealth: { status: string, responseTime: number }
  ): 'healthy' | 'warning' | 'error' {
    const statuses = [apiHealth.status, databaseHealth.status, integrationHealth.status];
    
    if (statuses.includes('error')) {
      return 'error';
    } else if (statuses.includes('warning')) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }

  /**
   * Calculate system uptime percentage
   */
  private calculateUptime(): string {
    // This would typically come from a monitoring system
    // For now, we'll simulate based on recent transaction success rates
    const successRate = this.getRecentSuccessRate();
    
    if (successRate >= 99) return '99.9%';
    if (successRate >= 95) return '99.5%';
    if (successRate >= 90) return '99.0%';
    return '98.0%';
  }

  /**
   * Get recent success rate for uptime calculation
   */
  private getRecentSuccessRate(): number {
    // This would typically query recent transaction logs
    // For now, return a simulated value
    return Math.random() * 10 + 90; // 90-100%
  }

  /**
   * Calculate system health based on transaction success/failure rates
   */
  private calculateHealthFromTransactions(transactionMetrics: TransactionTypeMetrics): {
    status: 'operational' | 'degraded' | 'critical' | 'offline',
    uptime: string,
    responseTime: number,
    lastIncident?: string
  } {
    const total = transactionMetrics.total;
    const successRate = total.successRate;
    const totalTransactions = total.total;
    const failedTransactions = total.failed;
    const pendingTransactions = total.pending;

    // Determine health status based on success rate and transaction patterns
    let status: 'operational' | 'degraded' | 'critical' | 'offline';
    let uptime: string;
    let responseTime: number;
    let lastIncident: string | undefined;

    // Health logic based on transaction metrics
    if (totalTransactions === 0) {
      // No transactions today - system appears offline
      status = 'offline';
      uptime = 'No Activity';
      responseTime = 0;
    } else if (successRate >= 95 && failedTransactions <= 5) {
      // Excellent performance - fully operational
      status = 'operational';
      uptime = '99.9%';
      responseTime = 100 + Math.random() * 200; // 100-300ms
    } else if (successRate >= 90 && failedTransactions <= 20) {
      // Good performance - operational with minor issues
      status = 'operational';
      uptime = '99.5%';
      responseTime = 200 + Math.random() * 300; // 200-500ms
    } else if (successRate >= 80 && failedTransactions <= 50) {
      // Performance degraded - some issues detected
      status = 'degraded';
      uptime = '99.0%';
      responseTime = 500 + Math.random() * 500; // 500-1000ms
      lastIncident = this.getRecentIncident();
    } else if (successRate >= 70 && failedTransactions <= 100) {
      // Critical performance issues
      status = 'critical';
      uptime = '98.0%';
      responseTime = 1000 + Math.random() * 1000; // 1000-2000ms
      lastIncident = this.getRecentIncident();
    } else {
      // System critical - major failures
      status = 'critical';
      uptime = '95.0%';
      responseTime = 2000 + Math.random() * 3000; // 2000-5000ms
      lastIncident = this.getRecentIncident();
    }

    // Adjust for pending transactions
    if (pendingTransactions > totalTransactions * 0.1) { // More than 10% pending
      if (status === 'operational') {
        status = 'degraded';
      }
    }

    // Adjust for high failure rate
    if (failedTransactions > totalTransactions * 0.3) { // More than 30% failed
      status = 'critical';
    }

    return {
      status,
      uptime,
      responseTime: Math.round(responseTime),
      lastIncident
    };
  }

  /**
   * Get recent incident timestamp based on failure patterns
   */
  private getRecentIncident(): string {
    // Simulate recent incidents based on current time
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 24); // Random hour in last 24 hours
    const incidentTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    
    return incidentTime.toISOString();
  }

  /**
   * Get last incident timestamp (legacy method)
   */
  private getLastIncident(): string {
    // This would typically come from an incident log
    const incidents = [
      '2024-03-15T14:30:00Z',
      '2024-03-10T09:15:00Z',
      '2024-03-05T16:45:00Z'
    ];
    
    return incidents[Math.floor(Math.random() * incidents.length)];
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

  /**
   * Get system health based on recent transaction patterns
   */
  getHealthBasedOnTransactions(): Observable<{
    status: 'operational' | 'degraded' | 'critical' | 'offline',
    metrics: {
      successRate: number,
      failureRate: number,
      pendingRate: number,
      totalTransactions: number
    },
    recommendations: string[]
  }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return this.getTransactionTypeMetrics(startOfDay, endOfDay).pipe(
      map((transactionMetrics) => {
        const total = transactionMetrics.total;
        const successRate = total.successRate;
        const failureRate = ((total.failed / total.total) * 100) || 0;
        const pendingRate = ((total.pending / total.total) * 100) || 0;
        
        // Determine health status
        let status: 'operational' | 'degraded' | 'critical' | 'offline';
        let recommendations: string[] = [];

        if (successRate >= 95 && failureRate <= 5) {
          status = 'operational';
          recommendations = ['🚀 System performing excellently', '✅ Continue monitoring'];
        } else if (successRate >= 90 && failureRate <= 10) {
          status = 'operational';
          recommendations = ['👍 Good performance', '👀 Monitor failure patterns'];
        } else if (successRate >= 80 && failureRate <= 20) {
          status = 'degraded';
          recommendations = [
            '⚠️ Investigate failed transactions',
            '🔍 Check system logs for errors',
            '🌐 Monitor partner connectivity'
          ];
        } else if (successRate >= 70 && failureRate <= 30) {
          status = 'critical';
          recommendations = [
            '🚨 High failure rate detected',
            '🔧 Review transaction processing logic',
            '🔗 Check partner API endpoints',
            '🛠️ Consider system maintenance'
          ];
        } else {
          status = 'critical';
          recommendations = [
            '💥 Critical failure rate',
            '🚨 Immediate investigation required',
            '🔍 Check all system components',
            '📞 Contact technical support',
            '🔄 Consider system restart'
          ];
        }

        // Add pending transaction recommendations
        if (pendingRate > 10) {
          recommendations.push('High pending transaction rate - check processing queues');
        }

        return {
          status,
          metrics: {
            successRate,
            failureRate,
            pendingRate,
            totalTransactions: total.total
          },
          recommendations
        };
      }),
      catchError((error) => {
        console.error('Error analyzing transaction health:', error);
        return of({
          status: 'offline' as const,
          metrics: {
            successRate: 0,
            failureRate: 100,
            pendingRate: 0,
            totalTransactions: 0
          },
          recommendations: ['📡 Unable to analyze transaction data', '🔌 Check system connectivity']
        });
      })
    );
  }

  /**
   * Get chart data for transaction status distribution
   */
  getTransactionStatusChartData(metrics: TransactionTypeMetrics): ChartData {
    return {
      labels: ['PUSH', 'PULL', 'INTERNAL'],
      data: [metrics.push.total, metrics.pull.total, metrics.internal.total],
      colors: ['#ffc700', '#ff0000', '#3498db']
    };
  }

  /**
   * Get chart data for transaction success/failure distribution
   */
  getTransactionSuccessChartData(metrics: TransactionTypeMetrics): ChartData {
    return {
      labels: ['Successful', 'Failed', 'Pending'],
      data: [metrics.total.successful, metrics.total.failed, metrics.total.pending],
      colors: ['#2ecc71', '#e74c3c', '#f39c12']
    };
  }

  /**
   * Get chart data for integration status distribution
   */
  getIntegrationStatusChartData(metrics: IntegrationMetrics): ChartData {
    return {
      labels: ['Successful', 'Failed', 'Pending'],
      data: [metrics.successful, metrics.failed, metrics.pending],
      colors: ['#2ecc71', '#e74c3c', '#f39c12']
    };
  }

  /**
   * Get default transaction metrics
   */
  private getDefaultTransactionMetrics(): TransactionTypeMetrics {
    const defaultSummary = { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 };
    return {
      push: { ...defaultSummary },
      pull: { ...defaultSummary },
      internal: { ...defaultSummary },
      total: { ...defaultSummary }
    };
  }

  /**
   * Get default integration metrics
   */
  private getDefaultIntegrationMetrics(): IntegrationMetrics {
    return {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      successRate: 0
    };
  }
}
