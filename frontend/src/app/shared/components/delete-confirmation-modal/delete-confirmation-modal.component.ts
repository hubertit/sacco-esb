import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="isVisible" [style.display]="isVisible ? 'block' : 'none'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="!isVisible">
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              Confirm Deletion
            </h5>
            <button type="button" class="btn-close-custom" (click)="onCancel()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div class="confirmation-content">
              <div class="warning-icon">
                <app-lucide-icon name="trash-2" size="48px" class="text-danger"></app-lucide-icon>
              </div>
              
              <div class="confirmation-message">
                <h6 class="mb-3">Are you sure you want to delete this item?</h6>
                <div class="item-details" *ngIf="itemName">
                  <div class="detail-item">
                    <strong>Name:</strong> {{ itemName }}
                  </div>
                  <div class="detail-item" *ngIf="itemType">
                    <strong>Type:</strong> {{ itemType }}
                  </div>
                </div>
                <div class="warning-text">
                  <app-lucide-icon name="info" size="16px" class="me-2"></app-lucide-icon>
                  <span>This action cannot be undone.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" (click)="onConfirm()" [disabled]="isLoading">
              <app-lucide-icon name="trash-2" size="16px" class="me-1" *ngIf="!isLoading"></app-lucide-icon>
              <div class="spinner-border spinner-border-sm me-1" role="status" *ngIf="isLoading">
                <span class="visually-hidden">Loading...</span>
              </div>
              {{ isLoading ? 'Deleting...' : 'Delete' }}
            </button>
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

    .modal-header {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
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
      padding: 2rem;
    }

    .confirmation-content {
      text-align: center;
    }

    .warning-icon {
      margin-bottom: 1.5rem;
    }

    .confirmation-message h6 {
      color: #1e293b;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .item-details {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      text-align: left;
    }

    .detail-item {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #374151;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .warning-text {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
      font-size: 0.875rem;
      font-weight: 500;
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 0.375rem;
      padding: 0.75rem;
    }

    .modal-footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 1rem 1.5rem;
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

    .btn-danger {
      background: #dc2626;
      color: white;
      border-color: #dc2626;
    }

    .btn-danger:hover:not(:disabled) {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class DeleteConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() itemName: string = '';
  @Input() itemType: string = '';
  @Input() isLoading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
