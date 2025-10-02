import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface CreateEntityData {
  entityState: 'ACTIVE' | 'INACTIVE';
  code: string;
  legalCode: string;
  entityName: string;
  district: string;
}

@Component({
  selector: 'app-create-entity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <!-- Modal Backdrop -->
    <div *ngIf="isVisible" class="modal-backdrop" (click)="onBackdropClick()"></div>
    
    <!-- Modal -->
    <div *ngIf="isVisible" class="modal-container" [class.show]="isVisible">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              Create New Entity
            </h5>
            <button type="button" class="btn-close-custom" (click)="onClose()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <form #createForm="ngForm" (ngSubmit)="onSubmit()" novalidate>
              <!-- Entity Name -->
              <div class="mb-3">
                <label for="entityName" class="form-label required">
                  <app-lucide-icon name="building" size="16px" class="me-1"></app-lucide-icon>
                  Entity Name
                </label>
                <input 
                  type="text" 
                  id="entityName" 
                  name="entityName"
                  class="form-control" 
                  [(ngModel)]="formData.entityName"
                  #entityNameInput="ngModel"
                  required
                  minlength="2"
                  maxlength="100"
                  placeholder="Enter entity name"
                  [class.is-invalid]="entityNameInput.invalid && entityNameInput.touched">
                <div *ngIf="entityNameInput.invalid && entityNameInput.touched" class="invalid-feedback">
                  <div *ngIf="entityNameInput.errors?.['required']">Entity name is required</div>
                  <div *ngIf="entityNameInput.errors?.['minlength']">Entity name must be at least 2 characters</div>
                  <div *ngIf="entityNameInput.errors?.['maxlength']">Entity name must not exceed 100 characters</div>
                </div>
              </div>

              <!-- Code and Legal Code Row -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="code" class="form-label required">
                      <app-lucide-icon name="hash" size="16px" class="me-1"></app-lucide-icon>
                      Code
                    </label>
                    <input 
                      type="text" 
                      id="code" 
                      name="code"
                      class="form-control" 
                      [(ngModel)]="formData.code"
                      #codeInput="ngModel"
                      required
                      minlength="2"
                      maxlength="20"
                      placeholder="Enter entity code"
                      [class.is-invalid]="codeInput.invalid && codeInput.touched">
                    <div *ngIf="codeInput.invalid && codeInput.touched" class="invalid-feedback">
                      <div *ngIf="codeInput.errors?.['required']">Code is required</div>
                      <div *ngIf="codeInput.errors?.['minlength']">Code must be at least 2 characters</div>
                      <div *ngIf="codeInput.errors?.['maxlength']">Code must not exceed 20 characters</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="legalCode" class="form-label required">
                      <app-lucide-icon name="file-text" size="16px" class="me-1"></app-lucide-icon>
                      Legal Code
                    </label>
                    <input 
                      type="text" 
                      id="legalCode" 
                      name="legalCode"
                      class="form-control" 
                      [(ngModel)]="formData.legalCode"
                      #legalCodeInput="ngModel"
                      required
                      minlength="2"
                      maxlength="20"
                      placeholder="Enter legal code"
                      [class.is-invalid]="legalCodeInput.invalid && legalCodeInput.touched">
                    <div *ngIf="legalCodeInput.invalid && legalCodeInput.touched" class="invalid-feedback">
                      <div *ngIf="legalCodeInput.errors?.['required']">Legal code is required</div>
                      <div *ngIf="legalCodeInput.errors?.['minlength']">Legal code must be at least 2 characters</div>
                      <div *ngIf="legalCodeInput.errors?.['maxlength']">Legal code must not exceed 20 characters</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- District -->
              <div class="mb-3">
                <label for="district" class="form-label required">
                  <app-lucide-icon name="map-pin" size="16px" class="me-1"></app-lucide-icon>
                  District
                </label>
                <select 
                  id="district" 
                  name="district"
                  class="form-select" 
                  [(ngModel)]="formData.district"
                  #districtInput="ngModel"
                  required
                  [class.is-invalid]="districtInput.invalid && districtInput.touched">
                  <option value="">Select a district</option>
                  <option *ngFor="let district of rwandaDistricts" [value]="district">
                    {{ district }}
                  </option>
                </select>
                <div *ngIf="districtInput.invalid && districtInput.touched" class="invalid-feedback">
                  <div *ngIf="districtInput.errors?.['required']">Please select a district</div>
                </div>
              </div>

              <!-- Entity State -->
              <div class="mb-3">
                <label for="entityState" class="form-label required">
                  <app-lucide-icon name="toggle-left" size="16px" class="me-1"></app-lucide-icon>
                  Status
                </label>
                <select 
                  id="entityState" 
                  name="entityState"
                  class="form-select" 
                  [(ngModel)]="formData.entityState"
                  #entityStateInput="ngModel"
                  required
                  [class.is-invalid]="entityStateInput.invalid && entityStateInput.touched">
                  <option value="">Select status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <div *ngIf="entityStateInput.invalid && entityStateInput.touched" class="invalid-feedback">
                  <div *ngIf="entityStateInput.errors?.['required']">Status is required</div>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" (click)="onClose()">
              <app-lucide-icon name="x" size="16px" class="me-1"></app-lucide-icon>
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-success" 
              (click)="onSubmit()"
              [disabled]="isLoading || !createForm.form.valid">
              <app-lucide-icon *ngIf="!isLoading" name="plus" size="16px" class="me-1"></app-lucide-icon>
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ isLoading ? 'Creating...' : 'Create Entity' }}
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
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1040;
    }

    .modal-container {
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

    .modal-container.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-dialog {
      max-width: 600px;
      width: 90%;
      margin: 0;
      transform: translateY(-50px);
      transition: transform 0.3s ease;
    }

    .modal-container.show .modal-dialog {
      transform: translateY(0);
    }

    .modal-content {
      border: none;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
      background-color: #ffffff;
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

    .modal-footer {
      border-top: 1px solid #e5e7eb;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 0 0 12px 12px;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }

    .form-label.required::after {
      content: ' *';
      color: #ef4444;
    }

    .form-control, .form-select {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .form-control:focus, .form-select:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-control.is-invalid, .form-select.is-invalid {
      border-color: #ef4444;
    }

    .form-control.is-invalid:focus, .form-select.is-invalid:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .invalid-feedback {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
    }

    .btn {
      border-radius: 8px;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-success {
      background-color: #10b981;
      border-color: #10b981;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #059669;
      border-color: #059669;
      transform: translateY(-1px);
    }

    .btn-success:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-outline-secondary {
      color: #6b7280;
      border-color: #d1d5db;
    }

    .btn-outline-secondary:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
      color: #374151;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .modal-dialog {
        width: 95%;
        max-width: none;
      }
      
      .modal-body {
        padding: 1.5rem;
      }
      
      .modal-footer {
        padding: 1rem;
      }
    }
  `]
})
export class CreateEntityModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<CreateEntityData>();

  formData: CreateEntityData = {
    entityState: 'ACTIVE',
    code: '',
    legalCode: '',
    entityName: '',
    district: ''
  };

  // Rwanda's 30 districts
  rwandaDistricts = [
    'Bugesera',
    'Gatsibo',
    'Kayonza',
    'Kirehe',
    'Ngoma',
    'Nyagatare',
    'Rwamagana',
    'Gasabo',
    'Kicukiro',
    'Nyarugenge',
    'Burera',
    'Gakenke',
    'Gicumbi',
    'Musanze',
    'Rulindo',
    'Gisagara',
    'Huye',
    'Kamonyi',
    'Muhanga',
    'Nyamagabe',
    'Nyanza',
    'Nyaruguru',
    'Ruhango',
    'Karongi',
    'Ngororero',
    'Nyabihu',
    'Nyamasheke',
    'Rubavu',
    'Rusizi',
    'Rutsiro'
  ];

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    console.log('🎯 Create modal visibility changed:', this.isVisible);
  }

  private resetForm() {
    this.formData = {
      entityState: 'ACTIVE',
      code: '',
      legalCode: '',
      entityName: '',
      district: ''
    };
  }

  onSubmit() {
    if (this.isLoading) return;
    
    // Emit the form data
    this.create.emit(this.formData);
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  onBackdropClick() {
    if (!this.isLoading) {
      this.onClose();
    }
  }
}
