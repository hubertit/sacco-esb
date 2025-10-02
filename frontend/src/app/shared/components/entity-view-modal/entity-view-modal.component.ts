import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { Entity } from '../../../core/services/entity.service';

@Component({
  selector: 'app-entity-view-modal',
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
              Entity Details
            </h5>
            <button type="button" class="btn-close-custom" (click)="closeModal()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>
          <div class="modal-body">
            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Loading entity details...</p>
            </div>

            <!-- Error State -->
            <div *ngIf="hasError && !isLoading" class="alert alert-danger" role="alert">
              <h6 class="alert-heading">Error Loading Entity</h6>
              <p class="mb-0">Failed to load entity details. Please try again.</p>
            </div>

            <!-- Entity Details -->
            <div *ngIf="!isLoading && !hasError && entity" class="entity-info">
              <div class="info-item">
                <label>Entity Name</label>
                <span class="value">{{ entity.entityName }}</span>
              </div>
              <div class="info-item">
                <label>Code</label>
                <span class="value">{{ entity.code }}</span>
              </div>
              <div class="info-item">
                <label>Legal Code</label>
                <span class="value">{{ entity.legalCode }}</span>
              </div>
              <div class="info-item">
                <label>District</label>
                <span class="value">{{ entity.district }}</span>
              </div>
              <div class="info-item">
                <label>Status</label>
                <span class="badge" [class.bg-success]="entity.entityState === 'ACTIVE'" 
                      [class.bg-secondary]="entity.entityState === 'INACTIVE'">
                  {{ entity.entityState }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="isVisible" class="modal-backdrop fade show"></div>
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
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;
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
    
    .entity-info {
      padding: 0.5rem 0;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .info-item label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
    }
    
    .info-item .value {
      font-size: 0.875rem;
      color: #1e293b;
      font-weight: 500;
    }
    
    .badge {
      font-size: 0.75rem;
      padding: 0.375rem 0.75rem;
    }
    
    .bg-success {
      background-color: #198754 !important;
    }
    
    .bg-secondary {
      background-color: #6c757d !important;
    }
  `]
})
export class EntityViewModalComponent {
  @Input() isVisible = false;
  @Input() entity: Entity | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
