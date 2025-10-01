import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { LogData, IntegrationLogData } from '../../../core/models/log-data.models';

@Component({
  selector: 'app-log-view-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="isVisible" [style.display]="isVisible ? 'block' : 'none'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="!isVisible">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <app-lucide-icon name="file-text" size="20px" class="text-primary"></app-lucide-icon>
              <span *ngIf="log">Transaction Log Details</span>
              <span *ngIf="integrationLog">Integration Log Details</span>
            </h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading log information...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="hasError && !isLoading" class="alert alert-danger" role="alert">
              <h6 class="alert-heading">
                <app-lucide-icon name="x" size="16px" class="me-2"></app-lucide-icon>
                Error Loading Log
              </h6>
              <p class="mb-0">{{ errorMessage }}</p>
            </div>

            <!-- Transaction Log Information -->
            <div *ngIf="log && !integrationLog && !isLoading && !hasError" class="log-info">
              <!-- Header with Status and Key Info -->
              <div class="log-header">
                <div class="status-section">
                  <span class="badge status-badge" [class]="getStatusClass(log.logStatus)">
                    <app-lucide-icon name="check" size="14px" class="me-1" *ngIf="log.logStatus === 'SUCCESS'"></app-lucide-icon>
                    <app-lucide-icon name="x" size="14px" class="me-1" *ngIf="log.logStatus === 'FAILED' || log.logStatus === 'FAILURE'"></app-lucide-icon>
                    <app-lucide-icon name="pause" size="14px" class="me-1" *ngIf="log.logStatus === 'PENDING'"></app-lucide-icon>
                    <app-lucide-icon name="loader" size="14px" class="me-1" *ngIf="log.logStatus === 'PROCESSING'"></app-lucide-icon>
                    {{ log.logStatus }}
                  </span>
                </div>
                <div class="key-info">
                  <div class="amount-display">{{ formatAmount(log.amount) }}</div>
                  <div class="date-display">{{ formatDateTime(log.dateTime) }}</div>
                </div>
              </div>

              <!-- Main Content Grid -->
              <div class="content-grid">
                <!-- Left Column -->
                <div class="content-column">
                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="credit-card" size="14px" class="me-2"></app-lucide-icon>
                      Transaction
                    </h6>
                    <div class="info-item">
                      <label>Reference</label>
                      <span class="value">{{ log.referenceNumber }}</span>
                    </div>
                    <div class="info-item">
                      <label>Status Code</label>
                      <span class="value">{{ log.status }}</span>
                    </div>
                    <div class="info-item">
                      <label>Message</label>
                      <span class="value">{{ log.message }}</span>
                    </div>
                  </div>

                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="users" size="14px" class="me-2"></app-lucide-icon>
                      Accounts
                    </h6>
                    <div class="info-item">
                      <label>Source Wallet</label>
                      <span class="value">{{ log.sourceWallet }}</span>
                    </div>
                    <div class="info-item">
                      <label>Wallet Name</label>
                      <span class="value">{{ log.walletNames }}</span>
                    </div>
                    <div class="info-item">
                      <label>Target Account</label>
                      <span class="value">{{ log.targetAccountNumber }}</span>
                    </div>
                    <div class="info-item">
                      <label>Target Name</label>
                      <span class="value">{{ log.targetAccountName }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="content-column">
                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="settings" size="14px" class="me-2"></app-lucide-icon>
                      System
                    </h6>
                    <div class="info-item">
                      <label>Channel</label>
                      <span class="value">{{ log.channel }}</span>
                    </div>
                    <div class="info-item">
                      <label>Provider</label>
                      <span class="value">{{ log.provider }}</span>
                    </div>
                    <div class="info-item">
                      <label>Session ID</label>
                      <span class="value">{{ log.sessionId }}</span>
                    </div>
                    <div class="info-item">
                      <label>External Ref</label>
                      <span class="value">{{ log.externalRefNumber }}</span>
                    </div>
                  </div>

                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="map-pin" size="14px" class="me-2"></app-lucide-icon>
                      Branch
                    </h6>
                    <div class="info-item">
                      <label>Branch Code</label>
                      <span class="value">{{ log.branchCode }}</span>
                    </div>
                    <div class="info-item">
                      <label>Branch Name</label>
                      <span class="value">{{ log.branchName }}</span>
                    </div>
                    <div class="info-item">
                      <label>District Code</label>
                      <span class="value">{{ log.districtCode }}</span>
                    </div>
                    <div class="info-item">
                      <label>Year</label>
                      <span class="value">{{ log.year }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Integration Log Information -->
            <div *ngIf="integrationLog && !log && !isLoading && !hasError" class="log-info">
              <!-- Header with Status and Key Info -->
              <div class="log-header">
                <div class="status-section">
                  <span class="badge status-badge" [class]="getIntegrationStatusClass(integrationLog.status)">
                    <app-lucide-icon name="check" size="14px" class="me-1" *ngIf="integrationLog.status === 'COMPLETED'"></app-lucide-icon>
                    <app-lucide-icon name="x" size="14px" class="me-1" *ngIf="integrationLog.status === 'FAILED' || integrationLog.status === 'FAILURE'"></app-lucide-icon>
                    <app-lucide-icon name="pause" size="14px" class="me-1" *ngIf="integrationLog.status === 'PENDING'"></app-lucide-icon>
                    <app-lucide-icon name="loader" size="14px" class="me-1" *ngIf="integrationLog.status === 'PROCESSING'"></app-lucide-icon>
                    <app-lucide-icon name="clock" size="14px" class="me-1" *ngIf="integrationLog.status === 'TIMEOUT'"></app-lucide-icon>
                    {{ integrationLog.status }}
                  </span>
                </div>
                <div class="key-info">
                  <div class="date-display">{{ formatDateTime(integrationLog.receivedAt) }}</div>
                  <div class="size-display">{{ formatBytes(integrationLog.payloadSize) }}</div>
                </div>
              </div>

              <!-- Main Content Grid -->
              <div class="content-grid">
                <!-- Left Column -->
                <div class="content-column">
                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="activity" size="14px" class="me-2"></app-lucide-icon>
                      Message Details
                    </h6>
                    <div class="info-item">
                      <label>Correlation ID</label>
                      <span class="value">{{ integrationLog.correlationId }}</span>
                    </div>
                    <div class="info-item">
                      <label>Direction</label>
                      <span class="value">{{ integrationLog.direction }}</span>
                    </div>
                    <div class="info-item">
                      <label>Message Type</label>
                      <span class="value">{{ integrationLog.messageType }}</span>
                    </div>
                    <div class="info-item">
                      <label>Description</label>
                      <span class="value">{{ integrationLog.description }}</span>
                    </div>
                  </div>

                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="users" size="14px" class="me-2"></app-lucide-icon>
                      Partner
                    </h6>
                    <div class="info-item">
                      <label>Partner Name</label>
                      <span class="value">{{ integrationLog.partner.partnerName }}</span>
                    </div>
                    <div class="info-item">
                      <label>Partner Code</label>
                      <span class="value">{{ integrationLog.partner.partnerCode }}</span>
                    </div>
                    <div class="info-item">
                      <label>Partner ID</label>
                      <span class="value">{{ integrationLog.partner.id }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="content-column">
                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="settings" size="14px" class="me-2"></app-lucide-icon>
                      Technical Details
                    </h6>
                    <div class="info-item">
                      <label>Response Code</label>
                      <span class="value">{{ integrationLog.responseCode }}</span>
                    </div>
                    <div class="info-item">
                      <label>Payload Format</label>
                      <span class="value">{{ integrationLog.payloadFormat }}</span>
                    </div>
                    <div class="info-item">
                      <label>Payload Size</label>
                      <span class="value">{{ formatBytes(integrationLog.payloadSize) }}</span>
                    </div>
                    <div class="info-item">
                      <label>Sensitive</label>
                      <span class="value">{{ integrationLog.sensitive ? 'Yes' : 'No' }}</span>
                    </div>
                  </div>

                  <div class="info-section">
                    <h6 class="section-title">
                      <app-lucide-icon name="clock" size="14px" class="me-2"></app-lucide-icon>
                      Timing
                    </h6>
                    <div class="info-item">
                      <label>Received At</label>
                      <span class="value">{{ formatDateTime(integrationLog.receivedAt) }}</span>
                    </div>
                    <div class="info-item" *ngIf="integrationLog.processedAt">
                      <label>Processed At</label>
                      <span class="value">{{ formatDateTime(integrationLog.processedAt) }}</span>
                    </div>
                    <div class="info-item" *ngIf="integrationLog.processedAt">
                      <label>Response Time</label>
                      <span class="value response-time" [class]="getResponseTimeClass(integrationLog.receivedAt, integrationLog.processedAt)">
                        {{ calculateResponseTime(integrationLog.receivedAt, integrationLog.processedAt) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payload Section -->
              <div class="info-section mt-3">
                <h6 class="section-title">
                  <app-lucide-icon name="code" size="14px" class="me-2"></app-lucide-icon>
                  Payload
                </h6>
                <div class="payload-container clickable-json" 
                     (click)="copyToClipboard(formatPayload(integrationLog.payloadJson))"
                     title="Click to copy JSON to clipboard">
                  <pre class="payload-content">{{ formatPayload(integrationLog.payloadJson) }}</pre>
                </div>
              </div>

              <!-- Extra Section -->
              <div class="info-section mt-3" *ngIf="integrationLog.extra">
                <h6 class="section-title">
                  <app-lucide-icon name="info" size="14px" class="me-2"></app-lucide-icon>
                  Extra Information
                </h6>
                <div class="payload-container clickable-json" 
                     (click)="copyToClipboard(formatPayload(integrationLog.extra))"
                     title="Click to copy JSON to clipboard">
                  <pre class="payload-content">{{ formatPayload(integrationLog.extra) }}</pre>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade" [class.show]="isVisible" *ngIf="isVisible"></div>
  `,
  styles: [`
    .modal {
      z-index: 1055;
    }

    .modal-backdrop {
      z-index: 1050;
    }

    .btn-close-custom {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      color: #6c757d;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-close-custom:hover {
      color: #fff;
      background-color: #dc3545;
      border-color: #dc3545;
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
    }

    .btn-close-custom:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .status-section {
      display: flex;
      align-items: center;
    }

    .key-info {
      text-align: right;
    }

    .amount-display {
      font-size: 1.25rem;
      font-weight: 700;
      color: #059669;
      margin-bottom: 0.25rem;
    }

    .date-display {
      font-size: 0.875rem;
      color: #64748b;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .content-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-section {
      background: #f8fafc;
      border-radius: 0.5rem;
      padding: 1rem;
      border: 1px solid #e2e8f0;
    }

    .section-title {
      color: #1e293b;
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item label {
      font-weight: 500;
      color: #64748b;
      font-size: 0.75rem;
      margin: 0;
      min-width: 100px;
      flex-shrink: 0;
    }

    .info-item .value {
      color: #1e293b;
      font-size: 0.875rem;
      font-weight: 500;
      text-align: right;
      word-break: break-all;
      flex: 1;
      margin-left: 1rem;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 0.375rem;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }

    .status-badge.badge-success {
      background-color: #10b981;
      color: white;
    }

    .status-badge.badge-danger {
      background-color: #ef4444;
      color: white;
    }

    .status-badge.badge-warning {
      background-color: #f59e0b;
      color: white;
    }

    .status-badge.badge-info {
      background-color: #3b82f6;
      color: white;
    }

    .modal-header {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .size-display {
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .payload-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .payload-content {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.75rem;
      line-height: 1.4;
      color: #1e293b;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .response-time {
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
    }

    .response-time-excellent {
      background-color: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .response-time-good {
      background-color: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .response-time-warning {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .response-time-slow {
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .response-time-invalid {
      background-color: #f3f4f6;
      color: #6b7280;
      border: 1px solid #d1d5db;
    }

    .clickable-json {
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .clickable-json:hover {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .clickable-json:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .clickable-json::after {
      content: "Click to copy";
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }

    .clickable-json:hover::after {
      opacity: 1;
    }
  `]
})
export class LogViewModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() log: LogData | null = null;
  @Input() integrationLog: IntegrationLogData | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = '';

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Handle escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SUCCESS': return 'bg-success';
      case 'FAILED': return 'bg-danger';
      case 'FAILURE': return 'bg-danger';
      case 'PENDING': return 'bg-warning';
      case 'PROCESSING': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
      const diffInMinutes = Math.abs(now.getTime() - date.getTime()) / (1000 * 60);
      if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)} minutes ago`;
      } else {
        return `${Math.floor(diffInHours)} hours ago`;
      }
    }
    
    // Otherwise show full date and time
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  }

  // Integration log helper methods
  getIntegrationStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-success';
      case 'TIMEOUT': return 'bg-warning';
      case 'FAILED': return 'bg-danger';
      case 'FAILURE': return 'bg-danger';
      case 'PENDING': return 'bg-info';
      case 'PROCESSING': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatPayload(payloadJson: string): string {
    try {
      const parsed = JSON.parse(payloadJson);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      return payloadJson;
    }
  }

  calculateResponseTime(receivedAt: string, processedAt: string): string {
    try {
      const received = new Date(receivedAt);
      const processed = new Date(processedAt);
      const diffInMs = processed.getTime() - received.getTime();
      
      if (diffInMs < 0) {
        return 'Invalid time';
      }
      
      // Convert to seconds
      const diffInSeconds = diffInMs / 1000;
      
      if (diffInSeconds < 1) {
        return `${Math.round(diffInMs)}ms`;
      } else if (diffInSeconds < 60) {
        return `${diffInSeconds.toFixed(2)}s`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        const seconds = Math.round(diffInSeconds % 60);
        return `${minutes}m ${seconds}s`;
      } else {
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
      }
    } catch (error) {
      return 'Invalid time';
    }
  }

  getResponseTimeClass(receivedAt: string, processedAt: string): string {
    try {
      const received = new Date(receivedAt);
      const processed = new Date(processedAt);
      const diffInMs = processed.getTime() - received.getTime();
      
      if (diffInMs < 0) {
        return 'response-time-invalid';
      }
      
      const diffInSeconds = diffInMs / 1000;
      
      if (diffInSeconds < 1) {
        return 'response-time-excellent'; // < 1 second
      } else if (diffInSeconds < 5) {
        return 'response-time-good'; // 1-5 seconds
      } else if (diffInSeconds < 30) {
        return 'response-time-warning'; // 5-30 seconds
      } else {
        return 'response-time-slow'; // > 30 seconds
      }
    } catch (error) {
      return 'response-time-invalid';
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
      this.showCopySuccess();
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }

  showCopySuccess(): void {
    // Create a temporary success indicator
    const successElement = document.createElement('div');
    successElement.className = 'copy-success-toast';
    successElement.textContent = '✓ Copied to clipboard';
    successElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successElement);
    
    // Remove after 2 seconds
    setTimeout(() => {
      successElement.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (successElement.parentNode) {
          successElement.parentNode.removeChild(successElement);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 2000);
  }
}
