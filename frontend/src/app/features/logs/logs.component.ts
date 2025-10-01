import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { LogService, Log, LogLevel } from '../../core/services/log.service';
import { PartnerService } from '../../core/services/partner.service';
import { Partner } from '../../core/models/partner.models';
import { LogData, LogFilterRequest, IntegrationLogData, IntegrationLogFilterRequest, IntegrationLogApiResponse } from '../../core/models/log-data.models';
import { LogViewModalComponent } from '../../shared/components/log-view-modal/log-view-modal.component';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, LucideIconComponent, DataTableComponent, LogViewModalComponent],
  template: `
    <div class="dashboard-container">
      <!-- Filter Card -->
      <div class="card filter-card mb-4">
        <div class="card-header">
          <h5 class="card-title mb-0 d-flex align-items-center">
            <app-lucide-icon name="filter" size="18px" class="me-2"></app-lucide-icon>
            Filters
          </h5>
        </div>
        <div class="card-body">
          <!-- Transaction Logs Filter Form -->
          <form *ngIf="!currentLogType.includes('Integration')" (ngSubmit)="applyFilters()" class="row g-3">
            <!-- First Row: 4 inputs -->
            <!-- MSISDN Filter -->
            <div class="col-md-3">
              <label for="msisdn" class="form-label">MSISDN</label>
              <input type="text" id="msisdn" class="form-control" [(ngModel)]="filters.msisdn" name="msisdn" placeholder="Enter phone number">
            </div>

            <!-- Target Wallet Filter -->
            <div class="col-md-3">
              <label for="targetWallet" class="form-label">Target Wallet</label>
              <input type="text" id="targetWallet" class="form-control" [(ngModel)]="filters.targetWallet" name="targetWallet" placeholder="Enter wallet ID">
            </div>

            <!-- Source Account Number Filter -->
            <div class="col-md-3">
              <label for="sourceAccountNumber" class="form-label">Source Account</label>
              <input type="text" id="sourceAccountNumber" class="form-control" [(ngModel)]="filters.sourceAccountNumber" name="sourceAccountNumber" placeholder="Enter account number">
            </div>

            <!-- Reference Number Filter -->
            <div class="col-md-3">
              <label for="referenceNumber" class="form-label">Reference Number</label>
              <input type="text" id="referenceNumber" class="form-control" [(ngModel)]="filters.referenceNumber" name="referenceNumber" placeholder="Enter reference number">
            </div>

            <!-- Second Row: 4 inputs -->
            <!-- Start Date Filter -->
            <div class="col-md-3">
              <label for="startDate" class="form-label">Start Date</label>
              <input type="date" id="startDate" class="form-control" [(ngModel)]="filters.startDate" name="startDate">
            </div>

            <!-- End Date Filter -->
            <div class="col-md-3">
              <label for="endDate" class="form-label">End Date</label>
              <input type="date" id="endDate" class="form-control" [(ngModel)]="filters.endDate" name="endDate">
            </div>

            <!-- Table Filter -->
            <div class="col-md-3">
              <label for="table" class="form-label">Table</label>
              <select id="table" class="form-select" [(ngModel)]="filters.table" name="table">
                <option value="">All Tables</option>
                <option value="transactions">Transactions</option>
                <option value="logs">Logs</option>
                <option value="audit">Audit</option>
              </select>
            </div>

            <!-- Page Size Filter -->
            <div class="col-md-3">
              <label for="pageSize" class="form-label">Page Size</label>
              <select id="pageSize" class="form-select" [(ngModel)]="filters.pageSize" name="pageSize">
                <option value="10" selected>10 records</option>
                <option value="25">25 records</option>
                <option value="50">50 records</option>
                <option value="100">100 records</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="col-12">
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" (click)="clearFilters()">
                  <app-lucide-icon name="x" size="14px" class="me-1"></app-lucide-icon>
                  Clear
                </button>
                <button type="submit" class="btn btn-primary">
                  <app-lucide-icon name="search" size="14px" class="me-1"></app-lucide-icon>
                  Filter
                </button>
              </div>
            </div>
          </form>

          <!-- Integration Logs Filter Form -->
          <form *ngIf="currentLogType.includes('Integration')" (ngSubmit)="applyIntegrationFilters()" class="row g-3">
            <!-- Date Range Filters -->
            <div class="col-md-3">
              <label for="integrationFromDate" class="form-label">From Date</label>
              <input type="datetime-local" id="integrationFromDate" class="form-control" [(ngModel)]="integrationFilters.from" name="integrationFromDate">
            </div>

            <div class="col-md-3">
              <label for="integrationToDate" class="form-label">To Date</label>
              <input type="datetime-local" id="integrationToDate" class="form-control" [(ngModel)]="integrationFilters.to" name="integrationToDate">
            </div>

            <!-- Page Size Filter -->
            <div class="col-md-3">
              <label for="integrationPageSize" class="form-label">Page Size</label>
              <select id="integrationPageSize" class="form-select" [(ngModel)]="integrationFilters.size" name="integrationPageSize">
                <option value="10" selected>10 records</option>
                <option value="25">25 records</option>
                <option value="50">50 records</option>
                <option value="100">100 records</option>
              </select>
            </div>

            <!-- Action Buttons -->
            <div class="col-md-3">
              <label class="form-label">&nbsp;</label>
              <div class="d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-outline-secondary" (click)="clearIntegrationFilters()">
                  <app-lucide-icon name="x" size="14px" class="me-1"></app-lucide-icon>
                  Clear
                </button>
                <button type="submit" class="btn btn-primary">
                  <app-lucide-icon name="search" size="14px" class="me-1"></app-lucide-icon>
                  Filter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Logs Table Card -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4 class="card-title mb-0">{{ currentLogType }}</h4>
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small" *ngIf="!currentLogType.includes('Integration')">
              Showing {{ filteredLogs.length }} of {{ logs.length }} logs
            </span>
            <span class="text-muted small" *ngIf="currentLogType.includes('Integration')">
              Showing {{ filteredIntegrationLogs.length }} of {{ integrationLogs.length }} logs
            </span>
          </div>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading logs...</p>
          </div>
          
          <!-- Error State -->
          <div *ngIf="!loading && currentLogType.includes('Error')" class="text-center py-5">
            <div class="alert alert-danger d-inline-block">
              <app-lucide-icon name="alert-circle" size="24px" class="me-2"></app-lucide-icon>
              <strong>Invalid Log Type</strong>
              <p class="mb-0 mt-2">Please navigate to a valid log type from the menu.</p>
            </div>
          </div>
          
          <!-- Transaction Logs Table -->
          <app-data-table
            *ngIf="!loading && !currentLogType.includes('Error') && !currentLogType.includes('Integration')"
            [columns]="columns"
            [data]="filteredLogs"
            [striped]="true"
            [showSearch]="false"
            [showActions]="true"
            [showPagination]="true"
            [currentPage]="currentPage"
            [pageSize]="pageSize"
            [totalPages]="totalPages"
            [totalItems]="totalItems"
            (onSort)="handleSort($event)"
            (onPageChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)">
            
            <ng-template #rowActions let-log>
              <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-outline-primary view-btn-icon" 
                        type="button" 
                        title="View Log Details"
                        (click)="viewLog(log)">
                  <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                </button>
              </div>
            </ng-template>
          </app-data-table>

          <!-- Integration Logs Table -->
          <app-data-table
            *ngIf="!loading && !currentLogType.includes('Error') && currentLogType.includes('Integration')"
            [columns]="integrationColumns"
            [data]="filteredIntegrationLogs"
            [striped]="true"
            [showSearch]="false"
            [showActions]="true"
            [showPagination]="true"
            [currentPage]="integrationCurrentPage"
            [pageSize]="integrationPageSize"
            [totalPages]="integrationTotalPages"
            [totalItems]="integrationTotalItems"
            (onSort)="handleSort($event)"
            (onPageChange)="handlePageChange($event)"
            (onPageSizeChange)="handlePageSizeChange($event)">
            
            <ng-template #rowActions let-log>
              <div class="d-flex justify-content-end">
                <button class="btn btn-sm btn-outline-primary view-btn-icon" 
                        type="button" 
                        title="View Integration Log Details"
                        (click)="viewIntegrationLog(log)">
                  <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                </button>
              </div>
            </ng-template>
          </app-data-table>
        </div>
      </div>

      <!-- Log View Modal -->
      <app-log-view-modal
        [isVisible]="showLogModal"
        [log]="selectedLog"
        [integrationLog]="selectedIntegrationLog"
        [isLoading]="false"
        [hasError]="false"
        (close)="closeLogModal()">
      </app-log-view-modal>
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

    .filter-card {
      background: white;
      border: 1px solid #e5e7eb;
    }

    .filter-card .card-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
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
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: none;
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

      .badge-success {
        color: #fff;
        background-color: #27ae60;
      }

      .view-btn-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px !important;
        height: 32px !important;
        min-width: 32px;
        min-height: 32px;
        max-width: 32px;
        max-height: 32px;
        padding: 0 !important;
        margin: 0;
        border-radius: 50% !important;
        border: 1px solid #3b82f6;
        background-color: transparent;
        color: #3b82f6;
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;
        
        &:hover {
          background-color: #1b2e4b;
          border-color: #1b2e4b;
          color: white;
          transform: scale(1.05);
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }

      .datetime-cell {
        display: flex;
        flex-direction: column;
      }

      .datetime-single {
        font-weight: 500;
        color: #1e293b;
        font-size: 0.875rem;
        line-height: 1.4;
      }

      .amount-cell {
        font-weight: 600;
        color: #059669;
        font-size: 0.875rem;
      }
    }
  `]
})
export class LogsComponent implements OnInit {
  statusTemplate = (item: LogData) => `
    <span class="badge ${this.getLogStatusClass(item.logStatus)}">
      ${item.logStatus}
    </span>
  `;

  dateTimeTemplate = (item: LogData) => `
    <div class="datetime-cell">
      <div class="datetime-single">${this.formatDateTimeSingle(item.dateTime)}</div>
    </div>
  `;

  amountTemplate = (item: LogData) => `
    <span class="amount-cell">${this.formatAmount(item.amount)}</span>
  `;

  // Integration log templates
  integrationDateTimeTemplate = (item: IntegrationLogData) => `
    <div class="datetime-cell">
      <div class="datetime-single">${this.formatDateTimeSingle(item.receivedAt)}</div>
    </div>
  `;

  directionTemplate = (item: IntegrationLogData) => `
    <span class="badge ${this.getDirectionClass(item.direction)}">
      ${item.direction}
    </span>
  `;

  integrationStatusTemplate = (item: IntegrationLogData) => `
    <span class="badge ${this.getIntegrationStatusClass(item.status)}">
      ${item.status}
    </span>
  `;

  integrationIndexTemplate = (item: IntegrationLogData, index: number) => `
    <span class="index-number">${index + 1}</span>
  `;

  columns: TableColumn[] = [
    { key: 'index', title: 'No.', type: 'text', sortable: false },
    { key: 'dateTime', title: 'Date/Time', type: 'custom', sortable: true, template: this.dateTimeTemplate },
    { key: 'sourceWallet', title: 'Source Wallet', type: 'text', sortable: true },
    { key: 'targetAccountNumber', title: 'Target Account', type: 'text', sortable: true },
    { key: 'amount', title: 'Amount', type: 'custom', sortable: true, template: this.amountTemplate },
    { key: 'targetAccountName', title: 'Target Name', type: 'text', sortable: true },
    { key: 'channel', title: 'Channel', type: 'text', sortable: true },
    { key: 'provider', title: 'Provider', type: 'text', sortable: true },
    { key: 'logStatus', title: 'Status', type: 'custom', sortable: true, template: this.statusTemplate }
  ];

  integrationColumns: TableColumn[] = [
    { key: 'index', title: 'No.', type: 'custom', sortable: false, template: this.integrationIndexTemplate },
    { key: 'receivedAt', title: 'Received At', type: 'custom', sortable: true, template: this.integrationDateTimeTemplate },
    { key: 'direction', title: 'Direction', type: 'custom', sortable: true, template: this.directionTemplate },
    { key: 'correlationId', title: 'Correlation ID', type: 'text', sortable: true },
    { key: 'messageType', title: 'Message Type', type: 'text', sortable: true },
    { key: 'status', title: 'Status', type: 'custom', sortable: true, template: this.integrationStatusTemplate },
    { key: 'description', title: 'Description', type: 'text', sortable: true },
    { key: 'payloadSize', title: 'Size (bytes)', type: 'text', sortable: true }
  ];

  logs: LogData[] = [];
  filteredLogs: LogData[] = [];
  allLogs: LogData[] = []; // Store all logs for client-side operations
  integrationLogs: IntegrationLogData[] = [];
  filteredIntegrationLogs: IntegrationLogData[] = [];
  allIntegrationLogs: IntegrationLogData[] = []; // Store all integration logs for client-side operations
  logLevels: LogLevel[] = [];
  partners: Partner[] = [];
  loading = false;
  currentLogType = 'System Logs';
  showLogModal = false;
  selectedLog: LogData | null = null;
  selectedIntegrationLog: IntegrationLogData | null = null;
  currentPartnerId: string | null = null;
  
  // Pagination properties for regular logs
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination properties for integration logs
  integrationCurrentPage = 1;
  integrationPageSize = 10;
  integrationTotalItems = 0;
  integrationTotalPages = 1;
  integrationSortColumn = '';
  integrationSortDirection: 'asc' | 'desc' = 'asc';

  filters = {
    msisdn: '',
    targetWallet: '',
    sourceAccountNumber: '',
    startDate: '',
    endDate: '',
    table: '',
    pageNumber: '1',
    pageSize: '10',
    referenceNumber: ''
  };

  integrationFilters: IntegrationLogFilterRequest = {
    page: 0,
    size: 10,
    from: undefined,
    to: undefined
  };

  constructor(
    private logService: LogService,
    private partnerService: PartnerService,
    private route: ActivatedRoute
  ) {
    this.logLevels = this.logService.getLogLevels();
  }

  ngOnInit() {
    this.loadPartners();
    this.loadLogs();
    
    // Check for URL parameters
    this.route.params.subscribe(params => {
      if (params['partner']) {
        // Integration logs with specific partner
        this.currentPartnerId = params['partner'];
        this.setPartnerTitle(params['partner']);
        this.loadIntegrationLogs();
      } else if (params['type']) {
        // Transaction logs with specific type - set table filter
        this.filters.table = 'transactions';
        this.currentLogType = `Transaction Logs - ${params['type'].charAt(0).toUpperCase() + params['type'].slice(1)}`;
        this.applyFilters();
      } else {
        // Check URL path for log type
        const currentUrl = this.route.snapshot.url.join('/');
        if (currentUrl.includes('logs/transaction/push')) {
          this.currentLogType = 'Push Transaction Logs';
        } else if (currentUrl.includes('logs/transaction/pull')) {
          this.currentLogType = 'Pull Transaction Logs';
        } else if (currentUrl.includes('logs/transaction/internal')) {
          this.currentLogType = 'Internal Transaction Logs';
        } else {
          // Invalid log type - show error
          this.currentLogType = 'Error: Invalid Log Type';
        }
      }
    });
  }

  private loadPartners() {
    this.partnerService.getPartners().subscribe(partners => {
      this.partners = partners;
      console.log('📊 Partners loaded:', partners);
      
      // Update partner title if we have a current partner ID
      if (this.currentPartnerId) {
        this.setPartnerTitle(this.currentPartnerId);
      }
    });
  }

  private loadLogs() {
    this.loading = true;
    console.log('🎯 Loading logs with filters:', this.filters);
    
    // Determine which API endpoint to call based on the current route or filters
    let logObservable;
    
    // Check route parameters to determine log type
    const currentUrl = this.route.snapshot.url.join('/');
    console.log('🔗 Current URL path:', currentUrl);
    
    if (currentUrl.includes('logs/transaction/push')) {
      // Push transaction logs
      console.log('📤 Loading Push transaction logs');
      logObservable = this.logService.getPushLogs(this.filters);
    } else if (currentUrl.includes('logs/transaction/pull')) {
      // Pull transaction logs
      console.log('📥 Loading Pull transaction logs');
      logObservable = this.logService.getPullLogs(this.filters);
    } else if (currentUrl.includes('logs/transaction/internal')) {
      // Internal transaction logs
      console.log('🔄 Loading Internal transaction logs');
      logObservable = this.logService.getInternalLogs(this.filters);
    } else {
      // No valid log type found - show error
      console.error('❌ No valid log type found in URL:', currentUrl);
      this.loading = false;
      this.logs = [];
      this.filteredLogs = [];
      this.currentLogType = 'Error: Invalid Log Type';
      return;
    }
    
    logObservable.subscribe({
      next: (logs) => {
        // Sort by dateTime descending (newest first)
        const sortedLogs = logs.sort((a, b) => {
          const dateA = new Date(a.dateTime);
          const dateB = new Date(b.dateTime);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Store all logs and add index
        this.allLogs = sortedLogs.map((log, index) => ({
          ...log,
          index: index + 1
        }));
        
        this.totalItems = this.allLogs.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        
        // Apply pagination to display logs
        this.updateDisplayedLogs();
        
        this.loading = false;
        console.log('📊 Logs loaded and sorted:', this.allLogs);
      },
      error: (error) => {
        console.error('❌ Error loading logs:', error);
        this.loading = false;
        // Fallback to empty array
        this.logs = [];
        this.filteredLogs = [];
      }
    });
  }

  private loadIntegrationLogs() {
    if (!this.currentPartnerId) {
      console.error('❌ No partner ID provided for integration logs');
      this.loading = false;
      return;
    }

    this.loading = true;
    console.log('🎯 Loading integration logs for partner:', this.currentPartnerId);
    console.log('📋 Integration filters:', this.integrationFilters);

    this.logService.getIntegrationLogs(this.currentPartnerId, this.integrationFilters).subscribe({
      next: (response: IntegrationLogApiResponse) => {
        console.log('📊 Integration logs response:', response);
        
        // Sort by receivedAt descending (newest first)
        const sortedLogs = response.content.sort((a, b) => {
          const dateA = new Date(a.receivedAt);
          const dateB = new Date(b.receivedAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Store all integration logs
        this.allIntegrationLogs = sortedLogs;
        
        this.integrationTotalItems = this.allIntegrationLogs.length;
        this.integrationTotalPages = Math.ceil(this.integrationTotalItems / this.integrationPageSize);
        
        // Apply pagination to display integration logs
        this.updateDisplayedIntegrationLogs();
        
        this.loading = false;
        console.log('📊 Integration logs loaded:', this.allIntegrationLogs);
      },
      error: (error) => {
        console.error('❌ Error loading integration logs:', error);
        this.loading = false;
        this.integrationLogs = [];
        this.filteredIntegrationLogs = [];
      }
    });
  }

  getLogStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'bg-success';
      case 'FAILED': return 'bg-danger';
      case 'PENDING': return 'bg-warning';
      case 'PROCESSING': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  applyFilters() {
    console.log('🎯 Applying filters:', this.filters);
    this.loadLogs();
  }

  clearFilters() {
    this.filters = {
      msisdn: '',
      targetWallet: '',
      sourceAccountNumber: '',
      startDate: '',
      endDate: '',
      table: '',
      pageNumber: '1',
      pageSize: '10',
      referenceNumber: ''
    };
    this.applyFilters();
  }


  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    if (this.currentLogType.includes('Integration')) {
      this.integrationSortColumn = event.column;
      this.integrationSortDirection = event.direction;
      this.integrationCurrentPage = 1; // Reset to first page when sorting
      this.updateDisplayedIntegrationLogs();
    } else {
      this.sortColumn = event.column;
      this.sortDirection = event.direction;
      this.currentPage = 1; // Reset to first page when sorting
      this.updateDisplayedLogs();
    }
  }

  handlePageChange(page: number) {
    if (this.currentLogType.includes('Integration')) {
      if (page >= 1 && page <= this.integrationTotalPages) {
        this.integrationCurrentPage = page;
        this.updateDisplayedIntegrationLogs();
      }
    } else {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updateDisplayedLogs();
      }
    }
  }

  handlePageSizeChange(size: number) {
    if (this.currentLogType.includes('Integration')) {
      this.integrationPageSize = size;
      this.integrationCurrentPage = 1; // Reset to first page when changing page size
      this.integrationTotalPages = Math.ceil(this.integrationTotalItems / this.integrationPageSize);
      this.updateDisplayedIntegrationLogs();
    } else {
      this.pageSize = size;
      this.currentPage = 1; // Reset to first page when changing page size
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.updateDisplayedLogs();
    }
  }

  private updateDisplayedLogs(): void {
    let sortedLogs = [...this.allLogs];
    
    // Apply sorting if specified
    if (this.sortColumn) {
      sortedLogs.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof LogData];
        const bValue = b[this.sortColumn as keyof LogData];
        
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
    this.filteredLogs = sortedLogs.slice(startIndex, endIndex);
  }

  private updateDisplayedIntegrationLogs(): void {
    let sortedLogs = [...this.allIntegrationLogs];
    
    // Apply sorting if specified
    if (this.integrationSortColumn) {
      sortedLogs.sort((a, b) => {
        const aValue = a[this.integrationSortColumn as keyof IntegrationLogData];
        const bValue = b[this.integrationSortColumn as keyof IntegrationLogData];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        return this.integrationSortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    // Apply pagination
    const startIndex = (this.integrationCurrentPage - 1) * this.integrationPageSize;
    const endIndex = startIndex + this.integrationPageSize;
    this.filteredIntegrationLogs = sortedLogs.slice(startIndex, endIndex);
  }

  viewLog(log: LogData) {
    console.log('🔍 Viewing log:', log);
    this.selectedLog = log;
    this.showLogModal = true;
  }

  closeLogModal() {
    this.showLogModal = false;
    this.selectedLog = null;
  }

  formatDateTimeSingle(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  formatDateTimeFull(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Integration log helper methods
  getDirectionClass(direction: string): string {
    switch (direction) {
      case 'IN': return 'bg-info';
      case 'OUT': return 'bg-warning';
      case 'INTERNAL': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getIntegrationStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-success';
      case 'TIMEOUT': return 'bg-warning';
      case 'FAILED': return 'bg-danger';
      case 'PENDING': return 'bg-info';
      case 'PROCESSING': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  viewIntegrationLog(log: IntegrationLogData) {
    console.log('🔍 Viewing integration log:', log);
    this.selectedIntegrationLog = log;
    this.showLogModal = true;
  }

  closeIntegrationLogModal() {
    this.showLogModal = false;
    this.selectedIntegrationLog = null;
  }

  /**
   * Set the title with partner name instead of ID
   */
  setPartnerTitle(partnerId: string) {
    if (this.partners && this.partners.length > 0) {
      const partner = this.partners.find(p => p.id === partnerId);
      if (partner) {
        this.currentLogType = `Integration Logs - ${partner.partnerName}`;
      } else {
        this.currentLogType = `Integration Logs - ${partnerId}`;
      }
    } else {
      // If partners not loaded yet, set a temporary title and update when partners load
      this.currentLogType = `Integration Logs - ${partnerId}`;
      // Update title when partners are loaded
      setTimeout(() => this.setPartnerTitle(partnerId), 100);
    }
  }

  applyIntegrationFilters() {
    console.log('🔍 Applying integration filters:', this.integrationFilters);
    this.loadIntegrationLogs();
  }

  clearIntegrationFilters() {
    this.integrationFilters = {
      page: 0,
      size: 10,
      from: undefined,
      to: undefined
    };
    console.log('🧹 Cleared integration filters');
    this.loadIntegrationLogs();
  }
}
