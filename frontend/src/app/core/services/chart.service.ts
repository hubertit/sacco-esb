import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChartData {
  series: any[];
  labels?: string[];
  colors?: string[];
  categories?: string[];
}

export interface ServiceMetrics {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  responseTime: number;
  successRate: number;
  requestsPerMinute: number;
  lastIncident?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  private mockServices: ServiceMetrics[] = [
    {
      id: 'sacco-core',
      name: 'SACCO Core Service',
      status: 'healthy',
      uptime: '99.99%',
      responseTime: 120,
      successRate: 99.8,
      requestsPerMinute: 350
    },
    {
      id: 'payment-gateway',
      name: 'Payment Gateway',
      status: 'warning',
      uptime: '99.5%',
      responseTime: 250,
      successRate: 98.5,
      requestsPerMinute: 180,
      lastIncident: '2 hours ago'
    },
    {
      id: 'notification',
      name: 'Notification Service',
      status: 'healthy',
      uptime: '99.95%',
      responseTime: 80,
      successRate: 99.9,
      requestsPerMinute: 420
    }
  ];

  constructor() {}

  getServices(): Observable<ServiceMetrics[]> {
    return of(this.mockServices);
  }

  getServiceMetrics(serviceId: string): Observable<ChartData> {
    // Mock time series data for the last 24 hours
    const hours = Array.from({length: 24}, (_, i) => `${23-i}h ago`).reverse();
    return of({
      series: [
        {
          name: 'Response Time (ms)',
          data: Array.from({length: 24}, () => Math.floor(Math.random() * 100 + 150))
        },
        {
          name: 'Requests/min',
          data: Array.from({length: 24}, () => Math.floor(Math.random() * 200 + 300))
        }
      ],
      categories: hours,
      colors: ['#3498db', '#2ecc71']
    });
  }

  getTransactionDistribution(): Observable<ChartData> {
    return of({
      series: [12, 11, 1],
      labels: ['Internal Transactions', 'Push Transactions', 'Pull Transactions'],
      colors: ['#1b2e4b', '#3498db', '#5c7299']
    });
  }

  getTransactionPerformance(): Observable<ChartData> {
    return of({
      series: [
        {
          name: 'Success',
          data: [2, 11, 1]
        },
        {
          name: 'Failed',
          data: [10, 0, 0]
        }
      ],
      colors: ['#1b2e4b', '#94a3b8']
    });
  }

  getErrorDistribution(): Observable<ChartData> {
    return of({
      series: [{
        name: 'Errors',
        data: [30, 25, 15, 12, 8]
      }],
      categories: ['Timeout', 'API Error', 'Validation', 'Network', 'Other'],
      colors: ['#94a3b8']
    });
  }

  getLatencyTrends(): Observable<ChartData> {
    const days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6-i));
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return of({
      series: [
        {
          name: 'P95 Latency',
          data: Array.from({length: 7}, () => Math.floor(Math.random() * 100 + 200))
        },
        {
          name: 'P50 Latency',
          data: Array.from({length: 7}, () => Math.floor(Math.random() * 50 + 100))
        }
      ],
      categories: days,
      colors: ['#1b2e4b', '#3498db']
    });
  }

  getSystemHealth(): Observable<ChartData> {
    const hours = Array.from({length: 12}, (_, i) => `${11-i}h ago`).reverse();
    
    return of({
      series: [
        {
          name: 'CPU Usage',
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 30 + 40))
        },
        {
          name: 'Memory Usage',
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 20 + 60))
        },
        {
          name: 'Disk I/O',
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 40 + 30))
        }
      ],
      categories: hours,
      colors: ['#1b2e4b', '#3498db', '#5c7299']
    });
  }
}