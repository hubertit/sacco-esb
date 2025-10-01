import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { AuditService, AuditTrail, AuditAction } from '../../core/services/audit.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Audit Trail</h4>
              <div class="d-flex gap-2">
                <div class="dropdown">
                  <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <app-lucide-icon name="filter" size="14px"></app-lucide-icon>
                    Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                    <li><h6 class="dropdown-header">Action Type</h6></li>
                    <li *ngFor="let action of auditActions">
                      <a class="dropdown-item" (click)="filterByAction(action)">
                        {{ action }}
                      </a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><h6 class="dropdown-header">Date Range</h6></li>
                    <li>
                      <a class="dropdown-item" (click)="filterByDate('today')">Today</a>
                    </li>
                    <li>
                      <a class="dropdown-item" (click)="filterByDate('week')">Last 7 days</a>
                    </li>
                    <li>
                      <a class="dropdown-item" (click)="filterByDate('month')">Last 30 days</a>
                    </li>
                  </ul>
                </div>
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" (click)="exportAudit()">
                  <app-lucide-icon name="download" size="14px"></app-lucide-icon>
                  Export
                </button>
              </div>
            </div>
            <div class="card-body">
              <app-data-table
                [columns]="columns"
                [data]="auditTrails"
                [striped]="true"
                [showSearch]="false"
                [showPagination]="true"
                [currentPage]="currentPage"
                [pageSize]="pageSize"
                [totalPages]="totalPages"
                [totalItems]="totalItems"
                (onSort)="handleSort($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
                (onRowClick)="viewAuditTrail($event)"
              ></app-data-table>
            </div>
          </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 12px;
    }

    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
    }

    .card-body {
      padding: 1rem;
    }

    .btn-primary {
      background-color: #1b2e4b;
      border-color: #1b2e4b;

      &:hover {
        background-color: #3498db;
        border-color: #3498db;
      }

      app-lucide-icon {
        color: white;
      }
    }

    .btn-outline-secondary {
      color: #1b2e4b;
      border-color: #e5e7eb;

      &:hover {
        background-color: #f8fafc;
        border-color: #1b2e4b;
      }

      app-lucide-icon {
        color: #1b2e4b;
      }
    }

    :host ::ng-deep {
      .badge {
        padding: 0.35em 0.65em;
        font-size: 0.75em;
        font-weight: 500;
        border-radius: 0.25rem;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
      }

      .badge-success {
        color: #fff;
        background-color: #2ecc71;
      }

      .badge-danger {
        color: #fff;
        background-color: #e74c3c;
      }

      .badge-primary {
        color: #fff;
        background-color: #1b2e4b;
      }

      .badge-warning {
        color: #fff;
        background-color: #f1c40f;
      }

      .badge-info {
        color: #fff;
        background-color: #3498db;
      }
    }
  `]
})
export class AuditComponent implements OnInit {
  actionTemplate = (item: AuditTrail) => `
    <span class="badge ${this.getActionClass(item.action)}">
      ${item.action}
    </span>
  `;

  statusTemplate = (item: AuditTrail) => `
    <span class="badge ${item.status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}">
      ${item.status}
    </span>
  `;

  columns: TableColumn[] = [
    { key: 'timestamp', title: 'Timestamp', type: 'date', sortable: true },
    { key: 'action', title: 'Action', type: 'custom', sortable: true, template: this.actionTemplate },
    { key: 'resource', title: 'Resource', type: 'text', sortable: true },
    { key: 'resourceId', title: 'Resource ID', type: 'text', sortable: true },
    { key: 'userId', title: 'User', type: 'text', sortable: true },
    { key: 'userType', title: 'User Type', type: 'text', sortable: true },
    { key: 'status', title: 'Status', type: 'custom', sortable: true, template: this.statusTemplate }
  ];

  auditTrails: AuditTrail[] = [];
  allAuditTrails: AuditTrail[] = []; // Store all audit trails for client-side operations
  auditActions: AuditAction[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private auditService: AuditService) {
    this.auditActions = this.auditService.getAuditActions();
  }

  ngOnInit() {
    const mockTrails = this.auditService.getMockAuditTrails();
    this.allAuditTrails = mockTrails;
    this.totalItems = this.allAuditTrails.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedAuditTrails();
  }

  getActionClass(action: AuditAction): string {
    switch (action) {
      case 'CREATE': return 'bg-success';
      case 'UPDATE': return 'bg-info';
      case 'DELETE': return 'bg-danger';
      case 'LOGIN':
      case 'LOGOUT': return 'bg-primary';
      case 'APPROVE': return 'bg-success';
      case 'REJECT': return 'bg-danger';
      default: return 'bg-primary';
    }
  }

  filterByAction(action: AuditAction) {
    // TODO: Implement action filtering
    console.log('Filter by action:', action);
  }

  filterByDate(range: 'today' | 'week' | 'month') {
    // TODO: Implement date filtering
    console.log('Filter by date range:', range);
  }

  exportAudit() {
    // TODO: Implement audit export
    console.log('Export audit trail');
  }

  viewAuditTrail(auditTrail: AuditTrail) {
    // TODO: Implement view audit trail modal
    console.log('Viewing audit trail:', auditTrail);
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1; // Reset to first page when sorting
    this.updateDisplayedAuditTrails();
  }

  handlePageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedAuditTrails();
    }
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page when changing page size
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedAuditTrails();
  }

  private updateDisplayedAuditTrails(): void {
    let sortedTrails = [...this.allAuditTrails];
    
    // Apply sorting if specified
    if (this.sortColumn) {
      sortedTrails.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof AuditTrail];
        const bValue = b[this.sortColumn as keyof AuditTrail];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.auditTrails = sortedTrails.slice(startIndex, endIndex);
  }
}
