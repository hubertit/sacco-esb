import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { NotificationItem } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-view-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <!-- Modal Backdrop -->
    <div *ngIf="isVisible" class="modal-backdrop" (click)="closeModal()"></div>
    
    <!-- Modal -->
    <div *ngIf="isVisible" class="notification-modal" [class.show]="isVisible">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              Notification Details
            </h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="modal-body" *ngIf="notification">
            <!-- Notification Type Badge -->
            <div class="mb-3">
              <span class="badge notification-type-badge" [ngClass]="getTypeClass(notification.type)">
                <app-lucide-icon [name]="getTypeIcon(notification.type)" size="14px" class="me-1"></app-lucide-icon>
                {{ notification.type | titlecase }}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="mb-3">
              <span class="badge status-badge" [ngClass]="getStatusClass(notification.status)">
                {{ notification.status }}
              </span>
            </div>

            <!-- Message -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Message</label>
              <div class="notification-message">
                {{ notification.message }}
              </div>
            </div>

            <!-- Timestamp -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Timestamp</label>
              <div class="notification-timestamp">
                <app-lucide-icon name="clock" size="16px" class="me-1"></app-lucide-icon>
                {{ formatTimestamp(notification.timestamp) }}
              </div>
            </div>

            <!-- Severity -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Severity</label>
              <div class="notification-severity">
                <span class="badge severity-badge" [ngClass]="getSeverityClass(notification.severity)">
                  <app-lucide-icon [name]="getSeverityIcon(notification.severity)" size="14px" class="me-1"></app-lucide-icon>
                  {{ notification.severity | titlecase }}
                </span>
              </div>
            </div>

            <!-- Additional Details -->
            <div class="mb-3">
              <label class="form-label fw-semibold">Additional Details</label>
              <div class="notification-details">
                <div class="detail-item">
                  <strong>ID:</strong> {{ notification.id }}
                </div>
                <div class="detail-item">
                  <strong>Type:</strong> {{ notification.type }}
                </div>
                <div class="detail-item">
                  <strong>Status:</strong> {{ notification.status }}
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onViewRelatedLogs()">
              <app-lucide-icon name="external-link" size="16px" class="me-1"></app-lucide-icon>
              View Related Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
    }

    .notification-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .notification-modal.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-dialog {
      max-width: 600px;
      width: 90%;
      margin: 0 auto;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      border: none;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: #f8fafc;
      border-radius: 8px 8px 0 0;
    }

    .modal-title {
      color: #1e293b;
      font-weight: 600;
      margin: 0;
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

    .modal-body {
      padding: 1.5rem;
    }

    .form-label {
      color: #374151;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .notification-message {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 0.75rem;
      font-size: 0.875rem;
      color: #1e293b;
      word-break: break-word;
    }

    .notification-timestamp {
      display: flex;
      align-items: center;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .notification-details {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
    }

    .detail-item {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f8fafc;
      border-radius: 0 0 8px 8px;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s ease;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border-color: #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .btn-primary {
      background: #1b2e4b;
      color: white;
      border-color: #1b2e4b;
    }

    .btn-primary:hover {
      background: #3498db;
      border-color: #3498db;
    }

    .badge {
      padding: 0.35em 0.65em;
      font-size: 0.75em;
      font-weight: 500;
      border-radius: 0.25rem;
      display: inline-flex;
      align-items: center;
    }

    .notification-type-badge {
      background: #e0f2fe;
      color: #0277bd;
      border: 1px solid #b3e5fc;
    }

    .status-badge {
      &.status-danger {
        background: #dc2626;
        color: white;
      }
      &.status-warning {
        background: #f59e0b;
        color: white;
      }
      &.status-info {
        background: #3b82f6;
        color: white;
      }
      &.status-secondary {
        background: #6b7280;
        color: white;
      }
    }

    .severity-badge {
      &.severity-high {
        background: #dc2626;
        color: white;
      }
      &.severity-medium {
        background: #f59e0b;
        color: white;
      }
      &.severity-low {
        background: #10b981;
        color: white;
      }
    }
  `]
})
export class NotificationViewModalComponent {
  @Input() isVisible = false;
  @Input() notification: NotificationItem | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Output() close = new EventEmitter<void>();
  @Output() viewRelatedLogs = new EventEmitter<NotificationItem>();

  closeModal(): void {
    this.close.emit();
  }

  onViewRelatedLogs(): void {
    if (this.notification) {
      this.viewRelatedLogs.emit(this.notification);
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getTypeClass(type: string): string {
    return 'notification-type-badge';
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'transaction':
        return 'credit-card';
      case 'integration':
        return 'link';
      default:
        return 'bell';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'FAILURE':
      case 'FAILED':
        return 'status-danger';
      case 'TIMEOUT':
        return 'status-warning';
      case 'PENDING':
        return 'status-info';
      default:
        return 'status-secondary';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return 'severity-low';
    }
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'high':
        return 'alert-triangle';
      case 'medium':
        return 'alert-circle';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  }
}
