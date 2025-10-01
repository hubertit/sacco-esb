import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <div class="permissions-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <app-lucide-icon name="shield-check" size="24px" class="header-icon"></app-lucide-icon>
            <h1>Permissions Management</h1>
          </div>
          <p class="header-subtitle">Manage user permissions and access controls</p>
        </div>
      </div>

      <div class="permissions-content">
        <!-- Permissions Overview -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">System Permissions</h4>
          </div>
          <div class="card-body">
            <div class="permissions-grid">
              <div class="permission-category">
                <h5>Dashboard Access</h5>
                <div class="permission-list">
                  <div class="permission-item">
                    <span class="permission-name">View Dashboard</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Export Reports</span>
                    <span class="permission-status active">Active</span>
                  </div>
                </div>
              </div>

              <div class="permission-category">
                <h5>User Management</h5>
                <div class="permission-list">
                  <div class="permission-item">
                    <span class="permission-name">Create Users</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Edit Users</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Delete Users</span>
                    <span class="permission-status inactive">Inactive</span>
                  </div>
                </div>
              </div>

              <div class="permission-category">
                <h5>Transaction Management</h5>
                <div class="permission-list">
                  <div class="permission-item">
                    <span class="permission-name">View Transactions</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Process Transactions</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Cancel Transactions</span>
                    <span class="permission-status inactive">Inactive</span>
                  </div>
                </div>
              </div>

              <div class="permission-category">
                <h5>System Administration</h5>
                <div class="permission-list">
                  <div class="permission-item">
                    <span class="permission-name">System Settings</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Audit Logs</span>
                    <span class="permission-status active">Active</span>
                  </div>
                  <div class="permission-item">
                    <span class="permission-name">Backup System</span>
                    <span class="permission-status inactive">Inactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Role-Based Permissions -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Role-Based Permissions</h4>
          </div>
          <div class="card-body">
            <div class="roles-permissions">
              <div class="role-card">
                <div class="role-header">
                  <h5>Administrator</h5>
                  <span class="role-badge admin">Full Access</span>
                </div>
                <div class="role-permissions">
                  <span class="permission-tag">All Permissions</span>
                </div>
              </div>

              <div class="role-card">
                <div class="role-header">
                  <h5>Manager</h5>
                  <span class="role-badge manager">Limited Access</span>
                </div>
                <div class="role-permissions">
                  <span class="permission-tag">View Dashboard</span>
                  <span class="permission-tag">Manage Users</span>
                  <span class="permission-tag">View Reports</span>
                </div>
              </div>

              <div class="role-card">
                <div class="role-header">
                  <h5>Operator</h5>
                  <span class="role-badge operator">Basic Access</span>
                </div>
                <div class="role-permissions">
                  <span class="permission-tag">View Dashboard</span>
                  <span class="permission-tag">Process Transactions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permissions-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      .header-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;

        h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .header-icon {
          color: #1b2e4b;
        }
      }

      .header-subtitle {
        color: #6b7280;
        font-size: 1rem;
        margin: 0;
      }
    }

    .permissions-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .card-header {
        padding: 1.5rem 1.5rem 0;
        border-bottom: 1px solid #e5e7eb;

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
        }
      }

      .card-body {
        padding: 1.5rem;
      }
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .permission-category {
      h5 {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #1b2e4b;
      }
    }

    .permission-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #1b2e4b;

      .permission-name {
        font-weight: 500;
        color: #374151;
      }

      .permission-status {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;

        &.active {
          background: rgba(27, 46, 75, 0.1);
          color: #1b2e4b;
        }

        &.inactive {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }
      }
    }

    .roles-permissions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .role-card {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;

      .role-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;

          &.admin {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          &.manager {
            background: rgba(27, 46, 75, 0.1);
            color: #1b2e4b;
          }

          &.operator {
            background: rgba(107, 114, 128, 0.1);
            color: #6b7280;
          }
        }
      }

      .role-permissions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .permission-tag {
          background: white;
          border: 1px solid #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 768px) {
      .permissions-container {
        padding: 1rem;
      }

      .permissions-grid,
      .roles-permissions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PermissionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
