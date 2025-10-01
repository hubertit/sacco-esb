import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { LogData, IntegrationLogData } from '../models/log-data.models';
import { LogService } from './log.service';
import { PartnerService } from './partner.service';

export interface NotificationItem {
  id: string;
  type: 'transaction' | 'integration';
  status: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private logService: LogService,
    private partnerService: PartnerService
  ) { }

  getFailedNotifications(): Observable<{ notifications: NotificationItem[], count: number }> {
    console.log('🔔 Loading notifications from real APIs...');
    
    // Get failed transactions from all log types
    const failedTransactions$ = forkJoin({
      pullLogs: this.getFailedTransactions('PULL'),
      pushLogs: this.getFailedTransactions('PUSH'),
      internalLogs: this.getFailedTransactions('INTERNAL')
    }).pipe(
      map(({ pullLogs, pushLogs, internalLogs }) => [
        ...pullLogs,
        ...pushLogs,
        ...internalLogs
      ])
    );

    // Get failed integration logs from all partners
    const failedIntegrations$ = this.getFailedIntegrations();

    return forkJoin({
      failedTransactions: failedTransactions$,
      failedIntegrations: failedIntegrations$
    }).pipe(
      map(({ failedTransactions, failedIntegrations }) => {
        const notifications: NotificationItem[] = [];
        
        // Add failed transactions
        failedTransactions.forEach(log => {
          notifications.push({
            id: `txn-${log.id}`,
            type: 'transaction',
            status: log.logStatus,
            message: `Transaction ${log.logStatus}: ${log.channel} - ${log.referenceNumber}`,
            timestamp: log.dateTime,
            severity: this.getSeverity(log.logStatus)
          });
        });

        // Add failed integrations
        failedIntegrations.forEach(log => {
          notifications.push({
            id: `int-${log.id}`,
            type: 'integration',
            status: log.status,
            message: `Integration ${log.status}: ${log.partner.partnerName} - ${log.correlationId}`,
            timestamp: log.receivedAt,
            severity: this.getSeverity(log.status)
          });
        });

        // Sort by timestamp (newest first)
        notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return {
          notifications: notifications.slice(0, 10), // Limit to 10 most recent
          count: notifications.length
        };
      }),
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return of({ notifications: [], count: 0 });
      })
    );
  }

  private getFailedTransactions(logType: 'PULL' | 'PUSH' | 'INTERNAL'): Observable<LogData[]> {
    console.log(`🔔 Fetching failed ${logType} transactions from API...`);
    
    // Create filter for failed transactions from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const filters = {
      msisdn: '',
      targetWallet: '',
      sourceAccountNumber: '',
      startDate: '',
      endDate: '',
      table: 'transactions',
      pageNumber: '1',
      pageSize: '100',
      referenceNumber: ''
    };

    // Call the appropriate log service method based on type
    let logObservable: Observable<LogData[]>;
    
    switch (logType) {
      case 'PULL':
        logObservable = this.logService.getPullLogs(filters);
        break;
      case 'PUSH':
        logObservable = this.logService.getPushLogs(filters);
        break;
      case 'INTERNAL':
        logObservable = this.logService.getInternalLogs(filters);
        break;
      default:
        logObservable = of([]);
    }

    return logObservable.pipe(
      map((logs: LogData[]) => {
        // Filter for failed transactions only
        const failedLogs = logs.filter(log => 
          log.logStatus === 'FAILED' || 
          log.logStatus === 'FAILURE'
        );
        console.log(`🔔 Found ${failedLogs.length} failed ${logType} transactions out of ${logs.length} total`);
        return failedLogs;
      }),
      catchError((error) => {
        console.error(`❌ Error fetching failed ${logType} transactions:`, error);
        return of([]);
      })
    );
  }

  private getFailedTransactionsMock(): Observable<LogData[]> {
    // Fallback mock data if API fails
    const mockFailedTransactions: LogData[] = [
      {
        id: '1',
        year: 2024,
        districtCode: 'DC001',
        branchCode: 'BR001',
        branchName: 'Main Branch',
        provider: 'MTN',
        logStatus: 'FAILURE',
        dateTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        amount: 10000,
        referenceNumber: 'TXN-001',
        status: 'FAILURE',
        message: 'Transaction failed due to insufficient funds',
        externalRefNumber: 'EXT-001',
        channel: 'PUSH',
        sessionId: 'SESS-001',
        sourceWallet: 'WALLET001',
        walletNames: 'John Doe',
        targetAccountNumber: 'ACC001',
        targetAccountName: 'Jane Smith',
        branchAccount: 'BR-ACC-001'
      },
      {
        id: '2',
        year: 2024,
        districtCode: 'DC002',
        branchCode: 'BR002',
        branchName: 'Secondary Branch',
        provider: 'Airtel',
        logStatus: 'FAILED',
        dateTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        amount: 5000,
        referenceNumber: 'TXN-002',
        status: 'FAILED',
        message: 'Network timeout error',
        externalRefNumber: 'EXT-002',
        channel: 'PULL',
        sessionId: 'SESS-002',
        sourceWallet: 'WALLET002',
        walletNames: 'Alice Johnson',
        targetAccountNumber: 'ACC002',
        targetAccountName: 'Bob Wilson',
        branchAccount: 'BR-ACC-002'
      },
      {
        id: '3',
        year: 2024,
        districtCode: 'DC003',
        branchCode: 'BR003',
        branchName: 'Third Branch',
        provider: 'Equitel',
        logStatus: 'FAILURE',
        dateTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        amount: 25000,
        referenceNumber: 'TXN-003',
        status: 'FAILURE',
        message: 'Invalid account number',
        externalRefNumber: 'EXT-003',
        channel: 'INTERNAL',
        sessionId: 'SESS-003',
        sourceWallet: 'WALLET003',
        walletNames: 'Charlie Brown',
        targetAccountNumber: 'ACC003',
        targetAccountName: 'Diana Prince',
        branchAccount: 'BR-ACC-003'
      }
    ];

    return of(mockFailedTransactions);
  }

  private getFailedIntegrations(): Observable<IntegrationLogData[]> {
    console.log('🔔 Fetching failed integration logs from API...');
    
    // First get all partners, then fetch logs for each partner
    return this.partnerService.getPartners().pipe(
      switchMap(partners => {
        console.log(`🔔 Found ${partners.length} partners`);
        
        // Create observables for each partner's failed logs
        const partnerLogObservables = partners.map(partner => 
          this.getFailedIntegrationLogsForPartner(partner.id)
        );
        
        // If no partners, return empty array
        if (partnerLogObservables.length === 0) {
          return of([]);
        }
        
        // Combine all partner logs
        return forkJoin(partnerLogObservables).pipe(
          map(logsArrays => {
            // Flatten the array of arrays
            const allLogs = logsArrays.flat();
            console.log(`🔔 Found ${allLogs.length} total failed integration logs`);
            return allLogs;
          })
        );
      }),
      catchError((error) => {
        console.error('❌ Error fetching partners or integration logs:', error);
        return of([]);
      })
    );
  }

  private getFailedIntegrationLogsForPartner(partnerId: string): Observable<IntegrationLogData[]> {
    console.log(`🔔 Fetching integration logs for partner: ${partnerId}`);
    
    // Create filter for failed integration logs from the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const filters = {
      page: 0,
      size: 50,
      from: yesterday.toISOString(),
      to: new Date().toISOString()
    };

    return this.logService.getIntegrationLogs(partnerId, filters).pipe(
      map((response) => {
        // Filter for failed integration logs only
        const failedLogs = response.content.filter(log => 
          log.status === 'FAILED' || 
          log.status === 'FAILURE' || 
          log.status === 'TIMEOUT'
        );
        console.log(`🔔 Found ${failedLogs.length} failed integration logs for partner ${partnerId} out of ${response.content.length} total`);
        return failedLogs;
      }),
      catchError((error) => {
        console.error(`❌ Error fetching integration logs for partner ${partnerId}:`, error);
        return of([]);
      })
    );
  }

  private getFailedIntegrationsMock(): Observable<IntegrationLogData[]> {
    // Fallback mock data if API fails
    const mockFailedIntegrations: IntegrationLogData[] = [
      {
        id: '1',
        receivedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        partner: {
          id: '1',
          partnerCode: 'MTN',
          partnerName: 'MTN',
          contactInfo: 'contact@mtn.com',
          notes: 'Mobile network provider',
          createdAt: new Date().toISOString()
        },
        direction: 'OUT',
        correlationId: 'MSG-001',
        messageType: 'SEND_AND_RECEIVE',
        status: 'FAILED',
        responseCode: 500,
        processedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
        payloadFormat: 'JSON',
        payloadJson: '{"error": "Connection timeout"}',
        description: 'Failed to connect to MTN API',
        sensitive: false,
        payloadSize: 1024,
        extra: '{"retryCount": 3}'
      },
      {
        id: '2',
        receivedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
        partner: {
          id: '2',
          partnerCode: 'AIRTEL',
          partnerName: 'Airtel',
          contactInfo: 'contact@airtel.com',
          notes: 'Mobile network provider',
          createdAt: new Date().toISOString()
        },
        direction: 'OUT',
        correlationId: 'MSG-002',
        messageType: 'SEND_ONLY',
        status: 'TIMEOUT',
        responseCode: 408,
        processedAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
        payloadFormat: 'JSON',
        payloadJson: '{"error": "Request timeout"}',
        description: 'Request timeout to Airtel API',
        sensitive: false,
        payloadSize: 512,
        extra: '{"timeout": 30000}'
      },
      {
        id: '3',
        receivedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        partner: {
          id: '3',
          partnerCode: 'EQUITEL',
          partnerName: 'Equitel',
          contactInfo: 'contact@equitel.com',
          notes: 'Mobile network provider',
          createdAt: new Date().toISOString()
        },
        direction: 'IN',
        correlationId: 'MSG-003',
        messageType: 'SEND_AND_RECEIVE',
        status: 'FAILURE',
        responseCode: 401,
        processedAt: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
        payloadFormat: 'JSON',
        payloadJson: '{"error": "Invalid credentials"}',
        description: 'Authentication failed with Equitel',
        sensitive: true,
        payloadSize: 256,
        extra: '{"authError": true}'
      }
    ];

    return of(mockFailedIntegrations);
  }

  private getSeverity(status: string): 'high' | 'medium' | 'low' {
    switch (status) {
      case 'FAILURE':
      case 'TIMEOUT':
        return 'high';
      case 'FAILED':
        return 'medium';
      default:
        return 'low';
    }
  }
}
