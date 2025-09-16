import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { LogService, Log, LogLevel } from '../../core/services/log.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FeatherIconComponent, DataTableComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">System Logs</h4>
              <div class="d-flex gap-2">
                <div class="dropdown">
                  <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" type="button" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <app-feather-icon name="filter" size="14px"></app-feather-icon>
                    Filter
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="filterDropdown">
                    <li><h6 class="dropdown-header">Log Level</h6></li>
                    <li *ngFor="let level of logLevels">
                      <a class="dropdown-item" (click)="filterByLevel(level)">
                        {{ level }}
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
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" (click)="exportLogs()">
                  <app-feather-icon name="download" size="14px"></app-feather-icon>
                  Export
                </button>
              </div>
            </div>
            <div class="card-body">
              <app-data-table
                [columns]="columns"
                [data]="logs"
                [striped]="true"
                (onSort)="handleSort($event)"
                (onSearch)="handleSearch($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
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

      app-feather-icon {
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

      app-feather-icon {
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

      .badge-info {
        color: #fff;
        background-color: #3498db;
      }

      .badge-warning {
        color: #fff;
        background-color: #f1c40f;
      }

      .badge-danger {
        color: #fff;
        background-color: #e74c3c;
      }

      .badge-secondary {
        color: #fff;
        background-color: #95a5a6;
      }
    }
  `]
})
export class LogsComponent implements OnInit {
  logLevelTemplate = (item: Log) => `
    <span class="badge ${this.getLogLevelClass(item.level)}">
      ${item.level}
    </span>
  `;

  columns: TableColumn[] = [
    { key: 'timestamp', title: 'Timestamp', type: 'date', sortable: true },
    { key: 'level', title: 'Level', type: 'custom', sortable: true, template: this.logLevelTemplate },
    { key: 'source', title: 'Source', type: 'text', sortable: true },
    { key: 'message', title: 'Message', type: 'text', sortable: true },
    { key: 'userId', title: 'User', type: 'text', sortable: true },
    { key: 'entityId', title: 'Entity', type: 'text', sortable: true },
    { key: 'transactionId', title: 'Transaction', type: 'text', sortable: true }
  ];

  logs: Log[] = [];
  logLevels: LogLevel[] = [];

  constructor(private logService: LogService) {
    this.logLevels = this.logService.getLogLevels();
  }

  ngOnInit() {
    this.logs = this.logService.getMockLogs();
  }

  getLogLevelClass(level: LogLevel): string {
    switch (level) {
      case 'INFO': return 'badge-info';
      case 'WARNING': return 'badge-warning';
      case 'ERROR': return 'badge-danger';
      case 'DEBUG': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  filterByLevel(level: LogLevel) {
    // TODO: Implement level filtering
    console.log('Filter by level:', level);
  }

  filterByDate(range: 'today' | 'week' | 'month') {
    // TODO: Implement date filtering
    console.log('Filter by date range:', range);
  }

  exportLogs() {
    // TODO: Implement log export
    console.log('Export logs');
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }

  handleSearch(term: string) {
    // TODO: Implement search
    console.log('Search term:', term);
  }

  handlePageChange(page: number) {
    // TODO: Implement pagination
    console.log('Page:', page);
  }

  handlePageSizeChange(size: number) {
    // TODO: Implement page size change
    console.log('Page size:', size);
  }
}
