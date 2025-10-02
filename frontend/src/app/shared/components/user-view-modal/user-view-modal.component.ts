import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { User } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-view-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="isVisible" [style.display]="isVisible ? 'block' : 'none'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="!isVisible">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              User Information
            </h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="14px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading user information...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="hasError && !isLoading" class="alert alert-danger" role="alert">
              <h6 class="alert-heading">
                <app-lucide-icon name="x" size="16px" class="me-2"></app-lucide-icon>
                Error Loading User
              </h6>
              <p class="mb-0">{{ errorMessage }}</p>
            </div>

            <!-- User Information -->
            <div *ngIf="user && !isLoading && !hasError" class="user-info">
              <!-- User Avatar and Basic Info -->
              <div class="row mb-3">
                <div class="col-md-4 text-center">
                  <div class="user-avatar">
                    <app-lucide-icon name="user" size="40px" class="text-primary"></app-lucide-icon>
                  </div>
                </div>
                <div class="col-md-8">
                  <h4 class="user-name">{{ user.firstName }} {{ user.lastName }}</h4>
                  <p class="user-username text-muted">@{{ user.username }}</p>
                  <div class="user-badges">
                    <span class="badge" [class]="getUserTypeBadgeClass(user.userType)">
                      {{ user.userType }}
                    </span>
                    <span class="badge" [class]="getStatusBadgeClass(user.entityState)">
                      {{ user.entityState }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- User Details -->
              <div class="row">
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">
                      <app-lucide-icon name="mail" size="14px" class="me-2"></app-lucide-icon>
                      Email Address
                    </label>
                    <p class="info-value">{{ user.email || 'Not provided' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">
                      <app-lucide-icon name="smartphone" size="14px" class="me-2"></app-lucide-icon>
                      Phone Number
                    </label>
                    <p class="info-value">{{ user.phoneNumber || 'Not provided' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">
                      <app-lucide-icon name="shield" size="14px" class="me-2"></app-lucide-icon>
                      Role
                    </label>
                    <p class="info-value">{{ user.roleName || 'No role assigned' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <label class="info-label">
                      <app-lucide-icon name="database" size="14px" class="me-2"></app-lucide-icon>
                      User ID
                    </label>
                    <p class="info-value text-muted small">{{ maskUserId(user.id) }}</p>
                  </div>
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

    .modal-content {
      border: none;
      border-radius: 0.75rem;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
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
      padding: 1.5rem;
    }

    .user-info {
      .user-avatar {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border: 2px solid #1b2e4b;
      }

      .user-name {
        color: #1b2e4b;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }

      .user-username {
        font-size: 1rem;
        margin-bottom: 1rem;
      }

      .user-badges {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .info-item {
        margin-bottom: 1.5rem;

        .info-label {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          color: #1b2e4b;
          font-size: 1rem;
          margin: 0;
          word-break: break-word;
        }
      }
    }

    .modal-footer {
      border-top: 1px solid #e9ecef;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 0 0 0.75rem 0.75rem;

      .btn {
        border-radius: 0.5rem;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        transition: all 0.2s ease;

        &.btn-primary {
          background-color: #1b2e4b;
          border-color: #1b2e4b;

          &:hover {
            background-color: #3498db;
            border-color: #3498db;
          }
        }

        &.btn-secondary {
          background-color: #6c757d;
          border-color: #6c757d;

          &:hover {
            background-color: #5a6268;
            border-color: #545b62;
          }
        }

      }
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;

      &.badge-primary {
        background-color: #1b2e4b;
        color: white;
      }

      &.badge-info {
        background-color: #3498db;
        color: white;
      }

      &.badge-success {
        background-color: #28a745;
        color: white;
      }

      &.badge-danger {
        background-color: #dc3545;
        color: white;
      }
    }

    // Responsive adjustments
    @media (max-width: 768px) {
      .modal-dialog {
        margin: 1rem;
      }

      .user-info {
        .row {
          .col-md-3,
          .col-md-6,
          .col-md-9 {
            margin-bottom: 1rem;
          }
        }
      }
    }
  `]
})
export class UserViewModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() user: User | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = '';

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isVisible) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  getUserTypeBadgeClass(userType: string): string {
    return userType === 'HUMAN' ? 'bg-primary' : 'bg-info';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'ACTIVE' ? 'bg-success' : 'bg-secondary';
  }

  maskUserId(id: string): string {
    if (!id || id.length < 8) {
      return id;
    }
    // Show first 4 and last 4 characters, mask the middle
    const start = id.substring(0, 4);
    const end = id.substring(id.length - 4);
    const middle = '*'.repeat(Math.max(4, id.length - 8));
    return `${start}${middle}${end}`;
  }
}
