import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService, DashboardMetrics } from '../../core/services/dashboard.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
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
            <app-lucide-icon name="check-circle" size="28px"></app-lucide-icon>
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
                <span class="success">Operational</span>
                <span class="volume">{{ formatLastUpdated(metrics?.lastUpdated) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">Quick Actions</h4>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <a routerLink="/logs" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                <app-lucide-icon name="activity" size="16px" class="me-2"></app-lucide-icon>
                Transaction Logs
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="/logs/integration" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                <app-lucide-icon name="link" size="16px" class="me-2"></app-lucide-icon>
                Integration Logs
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="/partners" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                <app-lucide-icon name="users" size="16px" class="me-2"></app-lucide-icon>
                Partners
              </a>
            </div>
            <div class="col-md-3">
              <a routerLink="/audit" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center">
                <app-lucide-icon name="shield-check" size="16px" class="me-2"></app-lucide-icon>
                Audit Logs
              </a>
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

      &.value .stat-icon {
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
          .value & .main-stat { color: #2ecc71; }

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
    .health-healthy {
      border-left: 4px solid #22c55e;
    }

    .health-warning {
      border-left: 4px solid #f59e0b;
    }

    .health-error {
      border-left: 4px solid #ef4444;
    }

    .health-unknown {
      border-left: 4px solid #6b7280;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  metrics: DashboardMetrics | null = null;
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
    this.dashboardService.getDashboardMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard metrics:', error);
        this.loading = false;
      }
    });
  }

  getHealthStatusClass(status: string | undefined): string {
    switch (status) {
      case 'healthy': return 'health-healthy';
      case 'warning': return 'health-warning';
      case 'error': return 'health-error';
      default: return 'health-unknown';
    }
  }

  getHealthIcon(status: string | undefined): string {
    switch (status) {
      case 'healthy': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'x-circle';
      default: return 'help-circle';
    }
  }

  getHealthStatus(status: string | undefined): string {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'warning': return 'Warning';
      case 'error': return 'Error';
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
}