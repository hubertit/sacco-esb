import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardMetrics, TransactionTypeMetrics, IntegrationMetrics } from '../../core/services/dashboard.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexPlotOptions,
  ChartComponent
} from 'ng-apexcharts';

export interface ChartOptions {
  plotOptions?: ApexPlotOptions;
  markers?: any;
  grid?: any;
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  labels?: string[];
  legend?: ApexLegend;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  colors?: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Total Transactions -->
        <div class="stat-card mtn">
          <div class="stat-icon">
            <app-lucide-icon name="activity" size="28px"></app-lucide-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Total Transactions</div>
            <div class="stat-numbers">
              <div class="main-stat">{{ metrics?.totalTransactions | number }}</div>
              <div class="sub-stats">
                <span class="success">{{ metrics?.successfulTransactions | number }} Success</span>
                <span class="volume">{{ metrics?.failedTransactions | number }} Failed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Rate -->
        <div class="stat-card airtel">
          <div class="stat-icon">
            <app-lucide-icon name="trending-up" size="28px"></app-lucide-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Success Rate</div>
            <div class="stat-numbers">
              <div class="main-stat">{{ metrics?.successRate | number:'1.1-1' }}%</div>
              <div class="sub-stats">
                <span class="success">High Performance</span>
                <span class="volume">Real-time</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Partners -->
        <div class="stat-card internal">
          <div class="stat-icon">
            <app-lucide-icon name="users" size="28px"></app-lucide-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Active Partners</div>
            <div class="stat-numbers">
              <div class="main-stat">{{ metrics?.activeIntegrations | number }}</div>
              <div class="sub-stats">
                <span class="success">{{ metrics?.totalPartners | number }} Total</span>
                <span class="volume">Connected</span>
              </div>
            </div>
          </div>
        </div>

        <!-- System Health -->
        <div class="stat-card value" [class]="getHealthStatusClass(metrics?.systemHealth)">
          <div class="stat-icon">
            <app-lucide-icon [name]="getHealthIcon(metrics?.systemHealth)" size="28px"></app-lucide-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">System Health</div>
            <div class="stat-numbers">
              <div class="main-stat">{{ getHealthStatus(metrics?.systemHealth) }}</div>
              <div class="sub-stats">
                <span class="success">{{ getHealthSubtitle(metrics?.systemHealth) }}</span>
                <span class="volume">{{ formatLastUpdated(metrics?.lastUpdated) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Average Response Time -->
        <div class="stat-card response-time" [class]="getResponseTimeClass(metrics?.responseTimeMetrics?.performanceLevel)">
          <div class="stat-icon">
            <app-lucide-icon name="clock" size="28px"></app-lucide-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Avg Response Time</div>
            <div class="stat-numbers">
              <div class="main-stat">{{ formatResponseTime(metrics?.responseTimeMetrics?.averageResponseTime) }}</div>
              <div class="sub-stats">
                <span class="success">{{ metrics?.responseTimeMetrics?.totalRequests | number }} Requests</span>
                <span class="volume">{{ getPerformanceLevelText(metrics?.responseTimeMetrics?.performanceLevel) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Metrics -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Transaction Metrics by Type</h4>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <!-- PUSH Transactions -->
            <div class="col-md-4">
              <div class="metric-card push">
                <div class="metric-header">
                  <h5>PUSH Transactions</h5>
                  <app-lucide-icon name="arrow-up" size="20px"></app-lucide-icon>
                </div>
                <div class="metric-stats">
                  <div class="stat-number">{{ metrics?.transactionMetrics?.push?.total | number }}</div>
                  <div class="stat-details">
                    <span class="success">{{ metrics?.transactionMetrics?.push?.successful | number }} Success</span>
                    <span class="failed">{{ metrics?.transactionMetrics?.push?.failed | number }} Failed</span>
                  </div>
                  <div class="success-rate">{{ metrics?.transactionMetrics?.push?.successRate | number:'1.1-1' }}% Success Rate</div>
                </div>
              </div>
            </div>

            <!-- PULL Transactions -->
            <div class="col-md-4">
              <div class="metric-card pull">
                <div class="metric-header">
                  <h5>PULL Transactions</h5>
                  <app-lucide-icon name="arrow-down" size="20px"></app-lucide-icon>
                </div>
                <div class="metric-stats">
                  <div class="stat-number">{{ metrics?.transactionMetrics?.pull?.total | number }}</div>
                  <div class="stat-details">
                    <span class="success">{{ metrics?.transactionMetrics?.pull?.successful | number }} Success</span>
                    <span class="failed">{{ metrics?.transactionMetrics?.pull?.failed | number }} Failed</span>
                  </div>
                  <div class="success-rate">{{ metrics?.transactionMetrics?.pull?.successRate | number:'1.1-1' }}% Success Rate</div>
                </div>
              </div>
            </div>

            <!-- INTERNAL Transactions -->
            <div class="col-md-4">
              <div class="metric-card internal">
                <div class="metric-header">
                  <h5>INTERNAL Transactions</h5>
                  <app-lucide-icon name="refresh-cw" size="20px"></app-lucide-icon>
                </div>
                <div class="metric-stats">
                  <div class="stat-number">{{ metrics?.transactionMetrics?.internal?.total | number }}</div>
                  <div class="stat-details">
                    <span class="success">{{ metrics?.transactionMetrics?.internal?.successful | number }} Success</span>
                    <span class="failed">{{ metrics?.transactionMetrics?.internal?.failed | number }} Failed</span>
                  </div>
                  <div class="success-rate">{{ metrics?.transactionMetrics?.internal?.successRate | number:'1.1-1' }}% Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="row g-4">
        <!-- Transaction Type Distribution -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Transaction Types Distribution</h4>
            </div>
            <div class="card-body">
              <div class="chart-container transaction-chart">
                <div *ngIf="loading" class="text-center p-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading chart data...</p>
                </div>
                <apx-chart *ngIf="!loading"
                          [series]="transactionTypeChartOptions.series"
                          [chart]="transactionTypeChartOptions.chart"
                          [labels]="transactionTypeChartOptions.labels!"
                          [colors]="transactionTypeChartOptions.colors!"
                          [legend]="transactionTypeChartOptions.legend!"
                          [dataLabels]="transactionTypeChartOptions.dataLabels!">
                </apx-chart>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Status Distribution -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Transaction Status Distribution</h4>
            </div>
            <div class="card-body">
              <div class="chart-container transaction-chart">
                <div *ngIf="loading" class="text-center p-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading chart data...</p>
                </div>
                <apx-chart *ngIf="!loading"
                          [series]="transactionStatusChartOptions.series"
                          [chart]="transactionStatusChartOptions.chart"
                          [labels]="transactionStatusChartOptions.labels!"
                          [colors]="transactionStatusChartOptions.colors!"
                          [legend]="transactionStatusChartOptions.legend!"
                          [dataLabels]="transactionStatusChartOptions.dataLabels!">
                </apx-chart>
              </div>
            </div>
          </div>
        </div>

        <!-- Response Time per Partner -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">Average Response Time per App</h4>
            </div>
            <div class="card-body">
              <div class="chart-container transaction-chart">
                <div *ngIf="loading" class="text-center p-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading chart data...</p>
                </div>
                <apx-chart *ngIf="!loading"
                          [series]="responseTimeChartOptions.series"
                          [chart]="responseTimeChartOptions.chart"
                          [labels]="responseTimeChartOptions.labels!"
                          [colors]="responseTimeChartOptions.colors!"
                          [legend]="responseTimeChartOptions.legend!"
                          [dataLabels]="responseTimeChartOptions.dataLabels!">
                </apx-chart>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Integration Metrics -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Integration Logs Metrics</h4>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div class="col-md-8">
              <div class="integration-stats-grid">
                <div class="integration-stat-card total">
                  <div class="stat-icon">
                    <app-lucide-icon name="activity" size="24px"></app-lucide-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Total Integration Logs</div>
                    <div class="stat-value">{{ metrics?.integrationMetrics?.total | number }}</div>
                    <div class="stat-trend">
                      <app-lucide-icon name="trending-up" size="14px" class="me-1"></app-lucide-icon>
                      <span>All time</span>
                    </div>
                  </div>
                </div>

                <div class="integration-stat-card success">
                  <div class="stat-icon">
                    <app-lucide-icon name="check-circle" size="24px"></app-lucide-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Successful</div>
                    <div class="stat-value">{{ metrics?.integrationMetrics?.successful | number }}</div>
                    <div class="stat-trend">
                      <app-lucide-icon name="trending-up" size="14px" class="me-1"></app-lucide-icon>
                      <span>High performance</span>
                    </div>
                  </div>
                </div>

                <div class="integration-stat-card failed">
                  <div class="stat-icon">
                    <app-lucide-icon name="x-circle" size="24px"></app-lucide-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Failed</div>
                    <div class="stat-value">{{ metrics?.integrationMetrics?.failed | number }}</div>
                    <div class="stat-trend">
                      <app-lucide-icon name="alert-triangle" size="14px" class="me-1"></app-lucide-icon>
                      <span>Needs attention</span>
                    </div>
                  </div>
                </div>

                <div class="integration-stat-card rate">
                  <div class="stat-icon">
                    <app-lucide-icon name="percent" size="24px"></app-lucide-icon>
                  </div>
                  <div class="stat-content">
                    <div class="stat-label">Success Rate</div>
                    <div class="stat-value">{{ metrics?.integrationMetrics?.successRate | number:'1.1-1' }}%</div>
                    <div class="stat-trend">
                      <app-lucide-icon name="target" size="14px" class="me-1"></app-lucide-icon>
                      <span>Performance metric</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="chart-container">
                <div class="chart-header">
                  <h6 class="chart-title">Status Distribution</h6>
                  <p class="chart-subtitle">Integration log breakdown</p>
                </div>
                <div *ngIf="loading" class="text-center p-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading chart data...</p>
                </div>
                <apx-chart *ngIf="!loading && integrationStatusChartOptions.series && integrationStatusChartOptions.series.length > 0"
                          [series]="integrationStatusChartOptions.series"
                          [chart]="integrationStatusChartOptions.chart"
                          [labels]="integrationStatusChartOptions.labels!"
                          [colors]="integrationStatusChartOptions.colors!"
                          [legend]="integrationStatusChartOptions.legend!"
                          [dataLabels]="integrationStatusChartOptions.dataLabels!">
                </apx-chart>
                <div *ngIf="!loading && (!integrationStatusChartOptions.series || integrationStatusChartOptions.series.length === 0)" 
                     class="text-center p-4 text-muted">
                  <app-lucide-icon name="alert-circle" size="24px" class="mb-2"></app-lucide-icon>
                  <p>No integration data available</p>
                  <small>Chart will appear when data is loaded</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 100%;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
    }

    @media (max-width: 1400px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      background: white;
      border-radius: 4px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      min-height: 120px;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;

        ::ng-deep svg {
          stroke-width: 2;
        }
      }

      &.mtn .stat-icon {
        background: rgba(255, 199, 0, 0.1);
        color: #ffc700;
      }

      &.airtel .stat-icon {
        background: #f8f9fa;
        color: #1b2e4b;
        border: 1px solid #e5e7eb;
      }

      &.internal .stat-icon {
        background: rgba(52, 152, 219, 0.1);
        color: #3498db;
      }

      &.value .stat-icon {
        background: #f8f9fa;
        color: #1b2e4b;
        border: 1px solid #e5e7eb;
      }

      .stat-details {
        flex: 1;

        .stat-title {
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 6px;
        }

        .stat-numbers {
          .main-stat {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .mtn & .main-stat { color: #ffc700; }
          .airtel & .main-stat { color: #ff0000; }
          .internal & .main-stat { color: #3498db; }
          .value & .main-stat { color: #2ecc71; }

          .sub-stats {
            display: flex;
            gap: 8px;
            font-size: 0.7rem;

            span {
              padding: 2px 8px;
              border-radius: 12px;
              font-weight: 500;

              &.success {
                background: rgba(46, 204, 113, 0.1);
                color: #2ecc71;
              }

              &.volume {
                background: rgba(100, 116, 139, 0.1);
                color: #64748b;
              }
            }
          }
        }
      }
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .card-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background-color: #fff;
    }

    .card-title {
      color: #1e293b;
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .card-body {
      padding: 1rem;
    }

    /* Health Status Colors */
    .health-operational {
      border-left: 4px solid #1b2e4b;
      background: #f8f9fa;
    }

    .health-degraded {
      border-left: 4px solid #515365;
      background: #f8f9fa;
    }

    .health-critical {
      border-left: 4px solid #e74c3c;
      background: #f8f9fa;
    }

    .health-offline {
      border-left: 4px solid #6b7280;
      background: #f8f9fa;
    }

    .health-unknown {
      border-left: 4px solid #6b7280;
      background: #f8f9fa;
    }

    /* Dynamic Health Status Icon Styling */
    .health-operational .stat-icon {
      background: #1b2e4b !important;
      color: white !important;
    }

    .health-degraded .stat-icon {
      background: #515365 !important;
      color: white !important;
    }

    .health-critical .stat-icon {
      background: #e74c3c !important;
      color: white !important;
    }

    .health-offline .stat-icon {
      background: #6b7280 !important;
      color: white !important;
    }

    /* Pulse Animations */
    @keyframes pulse-green {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes pulse-orange {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }

    @keyframes pulse-red {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }

    /* Metric Cards */
    .metric-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h5 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }
      }

      .metric-stats {
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-details {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;

          span {
            font-size: 0.875rem;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 500;

            &.success {
              background: rgba(46, 204, 113, 0.1);
              color: #2ecc71;
            }

            &.failed {
              background: rgba(231, 76, 60, 0.1);
              color: #e74c3c;
            }
          }
        }

        .success-rate {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }
      }

      &.push {
        .stat-number { color: #1b2e4b; }
      }

      &.pull {
        .stat-number { color: #515365; }
      }

      &.internal {
        .stat-number { color: #6c757d; }
      }
    }


    /* Integration Stats Grid */
    .integration-stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;

      .integration-stat-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #1b2e4b;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
          min-width: 0;

          .stat-label {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
            font-weight: 500;
          }

          .stat-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
            line-height: 1;
          }

          .stat-trend {
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 500;
          }
        }

        &.total {
          .stat-icon {
            background: #1b2e4b;
            color: white;
          }
        }

        &.success {
          .stat-icon {
            background: #515365;
            color: white;
          }
        }

        &.failed {
          .stat-icon {
            background: #e74c3c;
            color: white;
          }
        }

        &.rate {
          .stat-icon {
            background: #6c757d;
            color: white;
          }
        }
      }
    }

    /* Chart Container */
    .chart-container {
      .chart-header {
        margin-bottom: 1rem;
        text-align: center;

        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .chart-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }
      }
    }

    /* Chart Container - Auto height based on content */
    .chart-container {
      min-height: 300px;
      position: relative;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }
    
    .chart-container apx-chart {
      width: 100% !important;
      min-height: 300px;
      flex: 1;
    }
    
    /* Specific chart containers for better fit */
    .card .chart-container {
      min-height: 350px;
    }
    
    /* Fixed height for Transaction Types and Status Distribution charts */
    .transaction-chart {
      min-height: 280px !important;
      height: 280px !important; /* Reduced height */
      max-height: 280px !important; /* Prevent growing */
      overflow: hidden; /* Hide any overflow */
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .transaction-chart apx-chart {
      min-height: 280px !important;
      height: 280px !important; /* Reduced height */
      max-height: 280px !important; /* Prevent growing */
      width: 100% !important;
      max-width: 100% !important;
    }
    
    /* Ensure donut charts fit properly within containers */
    .transaction-chart ::ng-deep .apexcharts-canvas {
      max-width: 100% !important;
      max-height: 100% !important;
    }
    
    .transaction-chart ::ng-deep .apexcharts-svg {
      max-width: 100% !important;
      max-height: 100% !important;
    }
    
    /* Integration metrics chart container */
    .integration-stats-grid + .chart-container {
      min-height: 400px;
    }
    
    
    /* Ensure proper spacing for chart headers */
    .chart-header {
      margin-bottom: 1.5rem;
      text-align: center;
      flex-shrink: 0;
    }
    
    /* Better spacing for chart content */
    .card-body {
      padding: 1.5rem;
    }
    
    /* Auto-sizing for chart widgets */
    .card {
      display: flex;
      flex-direction: column;
    }
    
    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    /* Ensure charts grow with content */
    .chart-container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    /* Auto-resize charts based on container */
    .chart-container apx-chart {
      flex: 1;
      min-height: 250px;
    }
    
    /* Fixed height for Transaction charts */
    .transaction-chart apx-chart {
      min-height: 300px !important;
      height: 300px !important; /* Fixed height */
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .integration-stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;

        .integration-stat-card {
          padding: 1rem;
          
          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .stat-content {
            .stat-value {
              font-size: 1.5rem;
            }
          }
        }
      }
      
      /* Responsive chart heights for mobile - auto with minimums */
      .chart-container {
        min-height: 250px;
      }
      
      .card .chart-container {
        min-height: 280px;
      }
      
      /* Fixed height for Transaction charts on mobile */
      .transaction-chart {
        min-height: 280px !important;
        height: 280px !important; /* Reduced height */
        max-height: 280px !important; /* Prevent growing */
        overflow: hidden; /* Hide any overflow */
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .transaction-chart apx-chart {
        min-height: 280px !important;
        height: 280px !important; /* Reduced height */
        max-height: 280px !important; /* Prevent growing */
        width: 100% !important;
        max-width: 100% !important;
      }
      
      /* Ensure donut charts fit properly on mobile */
      .transaction-chart ::ng-deep .apexcharts-canvas {
        max-width: 100% !important;
        max-height: 100% !important;
      }
      
      .transaction-chart ::ng-deep .apexcharts-svg {
        max-width: 100% !important;
        max-height: 100% !important;
      }
      
      .integration-stats-grid + .chart-container {
        min-height: 320px;
      }
    }

    /* Response Time Widget Styles */
    .stat-card.response-time {
      .stat-icon {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      &.response-excellent {
        border-left: 4px solid #10b981;
        .stat-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
      }

      &.response-good {
        border-left: 4px solid #3b82f6;
        .stat-icon {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }
      }

      &.response-warning {
        border-left: 4px solid #f59e0b;
        .stat-icon {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
      }

      &.response-critical {
        border-left: 4px solid #ef4444;
        .stat-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      }

      &.response-unknown {
        border-left: 4px solid #6b7280;
        .stat-icon {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  metrics: DashboardMetrics | null = null;

  // Chart properties
  transactionTypeChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: {
      type: 'donut',
      height: 280,
      width: '100%',
      toolbar: {
        show: false
      }
    },
    labels: ['PUSH', 'PULL', 'INTERNAL'],
    colors: ['#1b2e4b', '#515365', '#6c757d'],
    legend: {
      position: 'right'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return parseFloat(val).toFixed(2) + "%";
      }
    }
  };

  transactionStatusChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: {
      type: 'donut',
      height: 280,
      width: '100%',
      toolbar: {
        show: false
      }
    },
    labels: ['Successful', 'Failed', 'Pending'],
    colors: ['#1b2e4b', '#e74c3c', '#515365'],
    legend: {
      position: 'right'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return parseFloat(val).toFixed(2) + "%";
      }
    }
  };

  integrationStatusChartOptions: ChartOptions = {
    series: [0, 0, 0],
    chart: {
      type: 'donut',
      height: 'auto',
      toolbar: {
        show: false
      }
    },
    labels: ['Successful', 'Failed', 'Pending'],
    colors: ['#1b2e4b', '#e74c3c', '#515365'],
    legend: {
      position: 'right'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return parseFloat(val).toFixed(2) + "%";
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%'
        }
      }
    }
  };

  responseTimeChartOptions: ChartOptions = {
    series: [{
      name: 'Response Time (ms)',
      data: [0]
    }],
    chart: {
      type: 'bar',
      height: 280,
      width: '100%',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Loading...']
    },
    colors: ['#ffe8ec'],
    dataLabels: {
      enabled: true,
      formatter: function (val: string) {
        return Math.round(parseFloat(val)) + 'ms';
      },
      style: {
        colors: ['#333333'],
        fontSize: '12px',
        fontWeight: '600'
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'center'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return Math.round(val) + 'ms';
        }
      }
    }
  };
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    // Get user information
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username || 'User';
      this.userRole = user.role || 'User';
    }

    // Load dashboard metrics
    this.loadDashboardMetrics();
  }

  private loadDashboardMetrics() {
    this.loading = true;
    console.log('🔄 Loading dashboard metrics...');
    
    this.dashboardService.getDashboardMetrics().subscribe({
      next: (metrics) => {
        console.log('✅ Dashboard metrics received:', metrics);
        console.log('📊 Integration metrics:', metrics.integrationMetrics);
        this.metrics = metrics;
        this.updateCharts(metrics);
        this.loadResponseTimePerPartner();
        this.loading = false;
        console.log('📊 Charts updated, loading set to false');
      },
      error: (error) => {
        console.error('❌ Error loading dashboard metrics:', error);
        this.loading = false;
        // Set default metrics on error
        this.metrics = {
          totalTransactions: 0,
          successfulTransactions: 0,
          failedTransactions: 0,
          successRate: 0,
          totalPartners: 0,
          activeIntegrations: 0,
          systemHealth: 'offline',
          lastUpdated: new Date().toISOString(),
          transactionMetrics: {
            push: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
            pull: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
            internal: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 },
            total: { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 }
          },
          integrationMetrics: {
            total: 0,
            successful: 0,
            failed: 0,
            pending: 0,
            successRate: 0
          },
          responseTimeMetrics: {
            averageResponseTime: 0,
            totalRequests: 0,
            fastRequests: 0,
            slowRequests: 0,
            performanceLevel: 'critical' as const
          }
        };
        if (this.metrics) {
          this.updateCharts(this.metrics);
        }
      }
    });
  }

  private loadResponseTimePerPartner() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    this.dashboardService.getResponseTimePerPartner(startOfDay, endOfDay).subscribe({
      next: (responseTimeData) => {
        console.log('📊 Response time per partner data:', responseTimeData);
        this.updateResponseTimeChart(responseTimeData);
      },
      error: (error) => {
        console.error('❌ Error loading response time per partner:', error);
        // Set default data on error
        this.updateResponseTimeChart({
          partners: [
            { name: 'No Data', responseTime: 0, color: '#ffe8ec' }
          ]
        });
      }
    });
  }

  private updateResponseTimeChart(responseTimeData: { partners: { name: string; responseTime: number; color: string }[] }) {
    const partners = responseTimeData.partners;
    
    if (partners.length === 0) {
      // If no partners, show default
      this.responseTimeChartOptions = {
        ...this.responseTimeChartOptions,
        series: [{
          name: 'Response Time (ms)',
          data: [0]
        }],
        xaxis: {
          categories: ['No Data']
        },
        colors: ['#ffe8ec']
      };
      return;
    }
    
    // Sort partners by response time (fastest to slowest)
    const sortedPartners = [...partners].sort((a, b) => a.responseTime - b.responseTime);
    
    this.responseTimeChartOptions = {
      ...this.responseTimeChartOptions,
      series: [{
        name: 'Response Time (ms)',
        data: sortedPartners.map(p => ({
          x: p.name,
          y: p.responseTime,
          fillColor: p.color
        }))
      }],
      xaxis: {
        categories: sortedPartners.map(p => p.name)
      },
      colors: sortedPartners.map(p => p.color)
    };

    console.log('📊 Response time chart updated:', this.responseTimeChartOptions);
  }

  private updateCharts(metrics: DashboardMetrics) {
    console.log('📊 Updating charts with metrics:', metrics);
    
    // Get data with fallback to sample data if all zeros
    const pushTotal = metrics.transactionMetrics?.push?.total || 0;
    const pullTotal = metrics.transactionMetrics?.pull?.total || 0;
    const internalTotal = metrics.transactionMetrics?.internal?.total || 0;
    const successfulTotal = metrics.transactionMetrics?.total?.successful || 0;
    const failedTotal = metrics.transactionMetrics?.total?.failed || 0;
    const pendingTotal = metrics.transactionMetrics?.total?.pending || 0;
    
    // Use sample data if all values are zero
    const useSampleData = (pushTotal + pullTotal + internalTotal) === 0;
    
    // Update transaction type chart
    this.transactionTypeChartOptions = {
      ...this.transactionTypeChartOptions,
      series: useSampleData ? [150, 120, 80] : [pushTotal, pullTotal, internalTotal]
    };

    // Update transaction status chart
    this.transactionStatusChartOptions = {
      ...this.transactionStatusChartOptions,
      series: useSampleData ? [280, 45, 25] : [successfulTotal, failedTotal, pendingTotal]
    };

    // Update integration status chart
    const integrationSuccessful = metrics.integrationMetrics?.successful || 0;
    const integrationFailed = metrics.integrationMetrics?.failed || 0;
    const integrationPending = metrics.integrationMetrics?.pending || 0;
    
    // Use sample data if all integration values are zero
    const useIntegrationSampleData = (integrationSuccessful + integrationFailed + integrationPending) === 0;
    
    this.integrationStatusChartOptions = {
      ...this.integrationStatusChartOptions,
      series: useIntegrationSampleData ? [180, 25, 15] : [integrationSuccessful, integrationFailed, integrationPending]
    };

    console.log('📊 Chart data updated:', {
      useSampleData,
      useIntegrationSampleData,
      transactionType: this.transactionTypeChartOptions,
      transactionStatus: this.transactionStatusChartOptions,
      integrationStatus: this.integrationStatusChartOptions,
      integrationMetrics: metrics.integrationMetrics,
      integrationSeries: this.integrationStatusChartOptions.series
    });
    
    // Additional debugging for integration chart
    console.log('🔍 Integration chart debugging:', {
      hasSeries: !!this.integrationStatusChartOptions.series,
      seriesLength: this.integrationStatusChartOptions.series?.length,
      seriesValues: this.integrationStatusChartOptions.series,
      chartType: this.integrationStatusChartOptions.chart?.type,
      hasLabels: !!this.integrationStatusChartOptions.labels,
      labels: this.integrationStatusChartOptions.labels
    });
  }

  getHealthStatusClass(status: string | undefined): string {
    switch (status) {
      case 'operational': return 'health-operational';
      case 'degraded': return 'health-degraded';
      case 'critical': return 'health-critical';
      case 'offline': return 'health-offline';
      default: return 'health-unknown';
    }
  }

  getHealthIcon(status: string | undefined): string {
    switch (status) {
      case 'operational': return 'shield-check';
      case 'degraded': return 'alert-triangle';
      case 'critical': return 'alert-octagon';
      case 'offline': return 'wifi-off';
      default: return 'help-circle';
    }
  }

  getHealthSubtitle(status: string | undefined): string {
    switch (status) {
      case 'operational': return 'All Systems Go';
      case 'degraded': return 'Minor Issues';
      case 'critical': return 'Needs Attention';
      case 'offline': return 'System Down';
      default: return 'Unknown Status';
    }
  }

  getHealthStatus(status: string | undefined): string {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'critical': return 'Critical';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  }

  formatLastUpdated(lastUpdated: string | undefined): string {
    if (!lastUpdated) return 'Never';
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  formatResponseTime(responseTime: number | undefined): string {
    if (!responseTime) return '0ms';
    
    if (responseTime < 1000) {
      return `${Math.round(responseTime)}ms`;
    } else if (responseTime < 60000) {
      return `${(responseTime / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(responseTime / 60000);
      const seconds = Math.floor((responseTime % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }

  getResponseTimeClass(performanceLevel: string | undefined): string {
    switch (performanceLevel) {
      case 'excellent': return 'response-excellent';
      case 'good': return 'response-good';
      case 'warning': return 'response-warning';
      case 'critical': return 'response-critical';
      default: return 'response-unknown';
    }
  }

  getPerformanceLevelText(performanceLevel: string | undefined): string {
    switch (performanceLevel) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  }

  /**
   * Dynamically adjust chart height based on content
   */
  private adjustChartHeight(chartElement: any, minHeight: number = 300): void {
    if (chartElement && chartElement.nativeElement) {
      const container = chartElement.nativeElement.closest('.chart-container');
      if (container) {
        // Check if this is a transaction chart by class
        const isTransactionChart = container.classList.contains('transaction-chart');
        
        // Use fixed height for transaction charts
        const effectiveMinHeight = isTransactionChart ? 300 : minHeight;
        
        const contentHeight = container.scrollHeight;
        const newHeight = Math.max(contentHeight, effectiveMinHeight);
        container.style.height = `${newHeight}px`;
      }
    }
  }
}