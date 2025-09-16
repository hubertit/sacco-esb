import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChartService } from '../../core/services/chart.service';
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
        <!-- MTN MOMO Transactions -->
        <div class="stat-card mtn">
          <div class="stat-icon">
            <app-feather-icon name="smartphone" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">MTN MOMO</div>
            <div class="stat-numbers">
              <div class="main-stat">2.5M</div>
              <div class="sub-stats">
                <span class="success">99.8% Success</span>
                <span class="volume">150/min</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Airtel Money -->
        <div class="stat-card airtel">
          <div class="stat-icon">
            <app-feather-icon name="credit-card" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Airtel Money</div>
            <div class="stat-numbers">
              <div class="main-stat">1.8M</div>
              <div class="sub-stats">
                <span class="success">99.5% Success</span>
                <span class="volume">120/min</span>
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
            <div class="stat-title">Internal Transfers</div>
            <div class="stat-numbers">
              <div class="main-stat">5.2M</div>
              <div class="sub-stats">
                <span class="success">99.9% Success</span>
                <span class="volume">280/min</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Value -->
        <div class="stat-card value">
          <div class="stat-icon">
            <app-feather-icon name="dollar-sign" size="28px"></app-feather-icon>
          </div>
          <div class="stat-details">
            <div class="stat-title">Total Value (24h)</div>
            <div class="stat-numbers">
              <div class="main-stat">298.5M</div>
              <div class="sub-stats">
                <span class="deposits">185.2M In</span>
                <span class="withdrawals">113.3M Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Transaction Volume Trends -->
        <div class="chart-card volume-chart">
          <div class="card-header">
            <h3>Transaction Volume Trends</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="volumeTrendsChart">
              <apx-chart
                [series]="volumeChartOptions.series"
                [chart]="volumeChartOptions.chart"
                [xaxis]="volumeChartOptions.xaxis"
                [yaxis]="volumeChartOptions.yaxis"
                [legend]="volumeChartOptions.legend"
                [colors]="volumeChartOptions.colors"
                [dataLabels]="volumeChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Success Rate Trends -->
        <div class="chart-card success-rate-chart">
          <div class="card-header">
            <h3>Success Rate by Provider</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="successRateChart">
              <apx-chart
                [series]="successRateChartOptions.series"
                [chart]="successRateChartOptions.chart"
                [xaxis]="successRateChartOptions.xaxis"
                [yaxis]="successRateChartOptions.yaxis"
                [legend]="successRateChartOptions.legend"
                [colors]="successRateChartOptions.colors"
                [dataLabels]="successRateChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Transaction Amount Analysis -->
        <div class="chart-card amount-chart">
          <div class="card-header">
            <h3>Transaction Amount Analysis</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="amountAnalysisChart">
              <apx-chart
                [series]="amountChartOptions.series"
                [chart]="amountChartOptions.chart"
                [xaxis]="amountChartOptions.xaxis"
                [yaxis]="amountChartOptions.yaxis"
                [legend]="amountChartOptions.legend"
                [colors]="amountChartOptions.colors"
                [dataLabels]="amountChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Error Analysis -->
        <div class="chart-card error-chart">
          <div class="card-header">
            <h3>Error Analysis</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="errorAnalysisChart">
              <apx-chart
                [series]="errorChartOptions.series"
                [chart]="errorChartOptions.chart"
                [xaxis]="errorChartOptions.xaxis"
                [yaxis]="errorChartOptions.yaxis"
                [legend]="errorChartOptions.legend"
                [colors]="errorChartOptions.colors"
                [dataLabels]="errorChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Transaction Types -->
        <div class="chart-card transaction-types-chart">
          <div class="card-header">
            <h3>Transaction Types by Provider</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="transactionTypesChart">
              <apx-chart
                [series]="transactionTypesChartOptions.series"
                [chart]="transactionTypesChartOptions.chart"
                [xaxis]="transactionTypesChartOptions.xaxis"
                [yaxis]="transactionTypesChartOptions.yaxis"
                [legend]="transactionTypesChartOptions.legend"
                [colors]="transactionTypesChartOptions.colors"
                [dataLabels]="transactionTypesChartOptions.dataLabels"
              ></apx-chart>
            </div>
          </div>
        </div>

        <!-- Transaction Value Trends -->
        <div class="chart-card value-trends-chart">
          <div class="card-header">
            <h3>Transaction Value Trends</h3>
            <div class="card-actions">
              <button class="btn-refresh" (click)="refreshCharts()">
                <app-feather-icon name="refresh-cw" size="16px"></app-feather-icon>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div id="valueTrendsChart">
              <apx-chart
                [series]="valueTrendsChartOptions.series"
                [chart]="valueTrendsChartOptions.chart"
                [xaxis]="valueTrendsChartOptions.xaxis"
                [yaxis]="valueTrendsChartOptions.yaxis"
                [legend]="valueTrendsChartOptions.legend"
                [colors]="valueTrendsChartOptions.colors"
                [dataLabels]="valueTrendsChartOptions.dataLabels"
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

      &.mtn .stat-icon {
        background: rgba(255, 199, 0, 0.1);
        color: #ffc700;
      }

      &.airtel .stat-icon {
        background: rgba(255, 0, 0, 0.1);
        color: #ff0000;
      }

      &.internal .stat-icon {
        background: rgba(52, 152, 219, 0.1);
        color: #3498db;
      }

      &.health .stat-icon {
        background: rgba(46, 204, 113, 0.1);
        color: #2ecc71;
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

          .mtn & .main-stat { color: #ffc700; }
          .airtel & .main-stat { color: #ff0000; }
          .internal & .main-stat { color: #3498db; }
          .health & .main-stat { color: #2ecc71; }

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
  
  
  public volumeChartOptions: any = {
    series: [],
    chart: {
      type: 'area',
      height: 280,
      stacked: true,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#64748b' }
      }
    },
    yaxis: {
      title: { text: 'Transactions per Hour' },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => Math.round(val).toString()
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'spline', width: 1 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: ['#ffc700', '#ff0000', '#3498db'],
    tooltip: { x: { format: 'dd MMM HH:mm' } }
  };

  public successRateChartOptions: any = {
    series: [],
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      title: { text: 'Success Rate (%)' },
      labels: { 
        style: { colors: '#64748b' },
        formatter: (val) => Math.round(val) + '%'
      },
      min: 90,
      max: 100
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'spline', width: 1 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: ['#ffc700', '#ff0000', '#3498db'],
    tooltip: { x: { format: 'dd MMM HH:mm' } }
  };

  public amountChartOptions: any = {
    series: [],
    chart: {
      type: 'donut',
      height: 280,
      toolbar: { show: false }
    },
    labels: ['MTN MOMO', 'Airtel Money', 'Internal Transfers'],
    colors: ['#ffc700', '#ff0000', '#3498db'],
    dataLabels: { 
      enabled: true,
      formatter: (val) => val + '%'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return 'RWF ' + (total / 1000000).toFixed(1) + 'M';
              }
            }
          }
        }
      }
    },
    legend: { position: 'top', horizontalAlign: 'right' }
  };

  public errorChartOptions: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'category',
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      title: { text: 'Error Count' },
      labels: { style: { colors: '#64748b' } }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toString(),
      style: { colors: ['#fff'] }
    },
    legend: { show: false },
    colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e']
  };

  public transactionTypesChartOptions: any = {
    series: [],
    chart: {
      type: 'bar',
      height: 280,
      stacked: true,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'category',
      categories: ['MTN MOMO', 'Airtel Money', 'Internal'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      title: { text: 'Transaction Count' },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => {
          if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
          return val.toString();
        }
      }
    },
    dataLabels: { enabled: false },
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: ['#2ecc71', '#e74c3c', '#3498db'],
    tooltip: {
      y: {
        formatter: (val) => val.toString()
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };

  public valueTrendsChartOptions: any = {
    series: [],
    chart: {
      type: 'area',
      height: 280,
      toolbar: { show: false }
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      title: { text: 'Transaction Value (RWF)' },
      labels: {
        style: { colors: '#64748b' },
        formatter: (val) => {
          if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
          if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
          return val.toString();
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'spline', width: 1 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.1 } },
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: ['#ffc700', '#ff0000', '#3498db'],
    tooltip: {
      x: { format: 'dd MMM HH:mm' },
      y: {
        formatter: (val) => {
          if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M RWF';
          if (val >= 1000) return (val / 1000).toFixed(1) + 'K RWF';
          return val.toString() + ' RWF';
        }
      }
    }
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
    this.initializeCharts();
    this.loadChartData();
  }

  private initializeCharts() {
    // Initialize chart options with default values
    this.volumeChartOptions = this.getDefaultChartOptions();
    this.successRateChartOptions = this.getDefaultChartOptions();
    // Don't override amountChartOptions as it's already configured as donut chart
    this.errorChartOptions = this.getDefaultChartOptions();
    this.transactionTypesChartOptions = this.getDefaultChartOptions();
    this.valueTrendsChartOptions = this.getDefaultChartOptions();
  }

  private getDefaultChartOptions(): any {
    return {
      series: [],
      chart: {
        type: 'area',
        height: 280,
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      legend: { position: 'top', horizontalAlign: 'right' },
      colors: ['#ffc700', '#ff0000', '#3498db'],
      xaxis: {
        type: 'category',
        categories: []
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      stroke: {
        width: 1,
        curve: 'spline'
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1
        }
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
    // Load transaction volume data
    this.chartService.getTransactionVolume().subscribe(data => {
      this.volumeChartOptions = {
        ...this.volumeChartOptions,
        series: data.series,
        colors: data.colors || []
      };
    });

    // Load success rate data
    this.chartService.getSuccessRate().subscribe(data => {
      this.successRateChartOptions = {
        ...this.successRateChartOptions,
        series: data.series,
        colors: data.colors || []
      };
    });

    // Load amount analysis data
    this.chartService.getAmountAnalysis().subscribe(data => {
      this.amountChartOptions = {
        ...this.amountChartOptions,
        series: data.series,
        labels: data.labels || [],
        colors: data.colors || []
      };
    });

    // Load error analysis data
    this.chartService.getErrorAnalysis().subscribe(data => {
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

    // Load transaction types data
    this.chartService.getTransactionTypes().subscribe(data => {
      this.transactionTypesChartOptions = {
        ...this.transactionTypesChartOptions,
        series: data.series,
        colors: data.colors || []
      };
    });

    // Load value trends data
    this.chartService.getValueTrends().subscribe(data => {
      this.valueTrendsChartOptions = {
        ...this.valueTrendsChartOptions,
        series: data.series,
        colors: data.colors || []
      };
    });
  }


  refreshCharts() {
    this.loadChartData();
  }
}