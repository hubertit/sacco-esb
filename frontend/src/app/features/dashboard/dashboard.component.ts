import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChartService, ServiceMetrics } from '../../core/services/chart.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
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
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels?: string[];
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <!-- Pull Transactions -->
        <div class="stat-card pull">
          <div class="stat-icon">
            <app-feather-icon name="download" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Pull Transactions</div>
            <div class="stat-numbers">
              <div class="main-stat">1</div>
              <div class="sub-stats">
                <span class="success">1 Success</span>
                <span class="failed">0 Failed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Push Transactions -->
        <div class="stat-card push">
          <div class="stat-icon">
            <app-feather-icon name="upload" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Push Transactions</div>
            <div class="stat-numbers">
              <div class="main-stat">11</div>
              <div class="sub-stats">
                <span class="success">11 Success</span>
                <span class="failed">0 Failed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Internal Transactions -->
        <div class="stat-card internal">
          <div class="stat-icon">
            <app-feather-icon name="refresh-cw" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Internal Transactions</div>
            <div class="stat-numbers">
              <div class="main-stat">12</div>
              <div class="sub-stats">
                <span class="success">2 Success</span>
                <span class="failed">10 Failed</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customers -->
        <div class="stat-card customers">
          <div class="stat-icon">
            <app-feather-icon name="users" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Customers</div>
            <div class="stat-numbers">
              <div class="main-stat">9</div>
              <div class="sub-stats">
                <span class="active">9 Active</span>
                <span class="inactive">0 Inactive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Health Section -->
      <div class="service-health-section">
        <h2 class="section-title">Service Health</h2>
        <div class="service-cards">
          <div *ngFor="let service of services" 
               class="service-card" 
               [class.selected]="selectedService === service.id"
               [class.status-healthy]="service.status === 'healthy'"
               [class.status-warning]="service.status === 'warning'"
               [class.status-error]="service.status === 'error'"
               (click)="selectService(service.id)">
            <div class="service-header">
              <h3>{{ service.name }}</h3>
              <span class="status-badge">{{ service.status }}</span>
            </div>
            <div class="service-metrics">
              <div class="metric">
                <span class="label">Uptime</span>
                <span class="value">{{ service.uptime }}</span>
              </div>
              <div class="metric">
                <span class="label">Response Time</span>
                <span class="value">{{ service.responseTime }}ms</span>
              </div>
              <div class="metric">
                <span class="label">Success Rate</span>
                <span class="value">{{ service.successRate }}%</span>
              </div>
              <div class="metric">
                <span class="label">Requests/min</span>
                <span class="value">{{ service.requestsPerMinute }}</span>
              </div>
            </div>
            <div class="service-footer" *ngIf="service.lastIncident">
              <app-feather-icon name="alert-triangle" size="14px"></app-feather-icon>
              <span>Last incident: {{ service.lastIncident }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Transaction Distribution -->
        <div class="chart-card transactions-chart">
          <div class="card-header">
            <h3>Transactions Distribution</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="transactionDistributionChart">
              <apx-chart
                [series]="distributionChartOptions.series"
                [chart]="distributionChartOptions.chart"
                [labels]="distributionChartOptions.labels || []"
                [legend]="distributionChartOptions.legend"
                [colors]="distributionChartOptions.colors"
                [dataLabels]="distributionChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Transaction Performance -->
        <div class="chart-card performance-chart">
          <div class="card-header">
            <h3>Transaction Performance</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="transactionPerformanceChart">
              <apx-chart
                [series]="performanceChartOptions.series"
                [chart]="performanceChartOptions.chart"
                [xaxis]="performanceChartOptions.xaxis"
                [yaxis]="performanceChartOptions.yaxis"
                [legend]="performanceChartOptions.legend"
                [colors]="performanceChartOptions.colors"
                [dataLabels]="performanceChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Error Distribution -->
        <div class="chart-card error-chart">
          <div class="card-header">
            <h3>Error Distribution</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="errorDistributionChart">
              <apx-chart
                [series]="errorChartOptions.series"
                [chart]="errorChartOptions.chart"
                [xaxis]="errorChartOptions.xaxis"
                [colors]="errorChartOptions.colors"
                [dataLabels]="errorChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Latency Trends -->
        <div class="chart-card latency-chart">
          <div class="card-header">
            <h3>Latency Trends</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="latencyTrendsChart">
              <apx-chart
                [series]="latencyChartOptions.series"
                [chart]="latencyChartOptions.chart"
                [xaxis]="latencyChartOptions.xaxis"
                [colors]="latencyChartOptions.colors"
                [dataLabels]="latencyChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Service Metrics (shows when service is selected) -->
        <div class="chart-card service-metrics-chart" *ngIf="selectedService">
          <div class="card-header">
            <h3>Service Metrics</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="serviceMetricsChart">
              <apx-chart
                [series]="serviceMetricsChartOptions.series"
                [chart]="serviceMetricsChartOptions.chart"
                [xaxis]="serviceMetricsChartOptions.xaxis"
                [colors]="serviceMetricsChartOptions.colors"
                [dataLabels]="serviceMetricsChartOptions.dataLabels"
              ></apx-chart>
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

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 16px 0;
    }

    .service-health-section {
      margin-bottom: 16px;
      width: 100%;
    }

    .service-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .service-card {
      background: white;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      }

      &.selected {
        border-color: #3498db;
        box-shadow: 0 0 0 1px #3498db;
      }

      &.status-healthy { border-left: 4px solid #1b2e4b; }
      &.status-warning { border-left: 4px solid #5c7299; }
      &.status-error { border-left: 4px solid #94a3b8; }

      .service-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;

          .status-healthy & {
            background: rgba(27, 46, 75, 0.1);
            color: #1b2e4b;
          }

          .status-warning & {
            background: rgba(92, 114, 153, 0.1);
            color: #5c7299;
          }

          .status-error & {
            background: rgba(148, 163, 184, 0.1);
            color: #94a3b8;
          }
        }
      }

      .service-metrics {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .metric {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .label {
            font-size: 0.75rem;
            color: #64748b;
          }

          .value {
            font-size: 1rem;
            font-weight: 600;
            color: #1e293b;
          }
        }
      }

      .service-footer {
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #f1c40f;
        font-size: 0.75rem;

        app-feather-icon {
          color: inherit;
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border-radius: 4px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-1px);

        &.pull { box-shadow: 0 4px 12px rgba(52, 152, 219, 0.08); }
        &.push { box-shadow: 0 4px 12px rgba(46, 204, 113, 0.08); }
        &.internal { box-shadow: 0 4px 12px rgba(155, 89, 182, 0.08); }
        &.customers { box-shadow: 0 4px 12px rgba(231, 76, 60, 0.08); }
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        ::ng-deep svg {
          stroke-width: 2;
        }
      }

      &.pull .stat-icon {
        background: rgba(52, 152, 219, 0.1);
        color: #3498db;
      }

      &.push .stat-icon {
        background: rgba(46, 204, 113, 0.1);
        color: #2ecc71;
      }

      &.internal .stat-icon {
        background: rgba(155, 89, 182, 0.1);
        color: #9b59b6;
      }

      &.customers .stat-icon {
        background: rgba(231, 76, 60, 0.1);
        color: #e74c3c;
      }

      .stat-details {
        flex: 1;

        .stat-title {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .stat-numbers {
            .main-stat {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .pull & .main-stat { color: #3498db; }
          .push & .main-stat { color: #2ecc71; }
          .internal & .main-stat { color: #9b59b6; }
          .customers & .main-stat { color: #e74c3c; }

          .sub-stats {
            display: flex;
            gap: 12px;
            font-size: 0.75rem;

            span {
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

              &.active {
                background: rgba(46, 204, 113, 0.1);
                color: #2ecc71;
              }

              &.inactive {
                background: rgba(149, 165, 166, 0.1);
                color: #95a5a6;
              }
            }
          }
        }
      }
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 16px;
      width: 100%;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }

    .chart-card {
      height: auto;
      }
    }

    .chart-card {
      background: white;
      border-radius: 4px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .card-actions {
          .btn-refresh {
            background: none;
            border: none;
            color: #64748b;
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            transition: all 0.2s ease;

            &:hover {
              background: rgba(100, 116, 139, 0.1);
              color: #1e293b;
            }
          }
        }
      }

      .card-body {
        padding: 1rem;
        min-height: 350px;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  @ViewChild("distributionChart") distributionChart!: ChartComponent;
  @ViewChild("performanceChart") performanceChart!: ChartComponent;
  
  userName: string;
  userRole: string;
  
  services: ServiceMetrics[] = [];
  selectedService: string = '';
  
  public distributionChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'donut', height: 300 },
    xaxis: { type: 'category', categories: [] },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    yaxis: { labels: { style: { colors: [] } } },
    title: { text: '' },
    labels: [],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    fill: { opacity: 1 },
    tooltip: { enabled: true },
    colors: []
  };

  public performanceChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'bar', height: 300 },
    xaxis: { type: 'category', categories: [] },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    yaxis: { labels: { style: { colors: [] } } },
    title: { text: '' },
    labels: [],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    fill: { opacity: 1 },
    tooltip: { enabled: true },
    colors: []
  };

  public latencyChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'line', height: 300 },
    xaxis: { type: 'category', categories: [] },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    yaxis: { labels: { style: { colors: [] } } },
    title: { text: '' },
    labels: [],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    fill: { opacity: 1 },
    tooltip: { enabled: true },
    colors: []
  };

  public errorChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'bar', height: 300 },
    xaxis: { type: 'category', categories: [] },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    yaxis: { labels: { style: { colors: [] } } },
    title: { text: '' },
    labels: [],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    fill: { opacity: 1 },
    tooltip: { enabled: true },
    colors: []
  };

  public serviceMetricsChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'line', height: 300 },
    xaxis: { type: 'category', categories: [] },
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    yaxis: { labels: { style: { colors: [] } } },
    title: { text: '' },
    labels: [],
    legend: { position: 'bottom', horizontalAlign: 'center' },
    fill: { opacity: 1 },
    tooltip: { enabled: true },
    colors: []
  };

  constructor(
    private authService: AuthService,
    private chartService: ChartService
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
    this.userRole = user?.role || 'Guest';

    this.initializeCharts();
  }

  ngOnInit() {
    this.loadChartData();
  }

  private initializeCharts() {
    // Initialize Distribution Chart
    this.distributionChartOptions = {
      chart: {
        type: 'donut',
        height: 350
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: false
      },
      series: [],
      labels: [],
      colors: [],
      xaxis: {
        type: 'category',
        categories: []
      },
      stroke: {
        width: 1
      },
      yaxis: {
        labels: {
          style: {
            colors: []
          }
        }
      },
      title: {
        text: ''
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        enabled: true
      }
    };

    // Initialize Performance Chart
    this.performanceChartOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'category',
        categories: ['Internal', 'Push', 'Pull'],
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: false
      },
      colors: [],
      series: [],
      stroke: {
        width: 1
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        enabled: true
      },
      title: {
        text: ''
      },
      labels: []
    };

    // Initialize Error Distribution Chart
    this.errorChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toString();
        },
        offsetX: 30
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      colors: ['#e74c3c'],
      stroke: {
        width: 1
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        enabled: true
      },
      title: {
        text: ''
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      },
      labels: []
    };

    // Initialize Latency Chart
    this.latencyChartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          },
          formatter: function(val) {
            return val.toFixed(0) + 'ms';
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      colors: ['#e67e22', '#3498db'],
      fill: {
        opacity: 1
      },
      tooltip: {
        enabled: true
      },
      title: {
        text: ''
      },
      labels: []
    };

    // Initialize Service Metrics Chart
    this.serviceMetricsChartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: [3, 3]
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        type: 'category',
        categories: [],
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Response Time (ms)'
        },
        labels: {
          style: {
            colors: '#3498db'
          },
          formatter: function(val) {
            return val.toFixed(0) + 'ms';
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      colors: ['#3498db', '#2ecc71'],
      fill: {
        opacity: 1
      },
      tooltip: {
        enabled: true
      },
      title: {
        text: ''
      },
      labels: []
    };
  }

  private loadChartData() {
    // Load services
    this.chartService.getServices().subscribe(services => {
      this.services = services;
    });

    // Load chart data
    this.chartService.getTransactionDistribution().subscribe(data => {
      this.distributionChartOptions = {
        ...this.distributionChartOptions,
        series: data.series,
        labels: data.labels || [],
        colors: data.colors || []
      };
    });

    this.chartService.getTransactionPerformance().subscribe(data => {
      this.performanceChartOptions = {
        ...this.performanceChartOptions,
        series: data.series,
        colors: data.colors || []
      };
    });

    this.chartService.getErrorDistribution().subscribe(data => {
      this.errorChartOptions = {
        ...this.errorChartOptions,
        series: data.series,
        xaxis: {
          ...this.errorChartOptions.xaxis,
          categories: data.categories || []
        },
        colors: data.colors || []
      };
    });

    this.chartService.getLatencyTrends().subscribe(data => {
      this.latencyChartOptions = {
        ...this.latencyChartOptions,
        series: data.series,
        xaxis: {
          ...this.latencyChartOptions.xaxis,
          categories: data.categories || []
        },
        colors: data.colors || []
      };
    });

    if (this.selectedService) {
      this.loadServiceMetrics();
    }
  }

  selectService(serviceId: string) {
    this.selectedService = serviceId;
    this.loadServiceMetrics();
  }

  private loadServiceMetrics() {
    this.chartService.getServiceMetrics(this.selectedService).subscribe(data => {
      this.serviceMetricsChartOptions = {
        ...this.serviceMetricsChartOptions,
        series: data.series,
        xaxis: {
          ...this.serviceMetricsChartOptions.xaxis,
          categories: data.categories || []
        },
        colors: data.colors || []
      };
    });
  }

  refreshCharts() {
    this.loadChartData();
  }
}