import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';
import { User, UserType } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';
import { Role } from '../../../core/models/role.models';
import { Subject, takeUntil } from 'rxjs';

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  userType: UserType;
  roleId: string;
  entityState: 'ACTIVE' | 'INACTIVE';
  id?: string;
}

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="isVisible" [style.display]="isVisible ? 'block' : 'none'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="!isVisible">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? 'Edit User' : 'Add New User' }}
            </h5>
            <button type="button" class="btn-close-custom" (click)="onClose()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <form #userForm="ngForm" (ngSubmit)="onSubmit()" novalidate>
              <!-- User Type Selection -->
              <div class="mb-3">
                <label for="userType" class="form-label required">
                  <app-lucide-icon name="users" size="16px" class="me-1"></app-lucide-icon>
                  User Type
                </label>
                <select 
                  id="userType" 
                  name="userType"
                  class="form-select" 
                  [(ngModel)]="formData.userType"
                  #userTypeInput="ngModel"
                  required
                  [class.is-invalid]="userTypeInput.invalid && userTypeInput.touched">
                  <option value="">Select user type</option>
                  <option value="HUMAN">Human User</option>
                  <option value="APPLICATION">Application</option>
                </select>
                <div *ngIf="userTypeInput.invalid && userTypeInput.touched" class="invalid-feedback">
                  <div *ngIf="userTypeInput.errors?.['required']">User type is required</div>
                </div>
              </div>

              <!-- First Name and Last Name Row -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="firstName" class="form-label required">
                      <app-lucide-icon name="user" size="16px" class="me-1"></app-lucide-icon>
                      First Name
                    </label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName"
                      class="form-control" 
                      [(ngModel)]="formData.firstName"
                      #firstNameInput="ngModel"
                      required
                      minlength="2"
                      maxlength="50"
                      placeholder="Enter first name"
                      [class.is-invalid]="firstNameInput.invalid && firstNameInput.touched">
                    <div *ngIf="firstNameInput.invalid && firstNameInput.touched" class="invalid-feedback">
                      <div *ngIf="firstNameInput.errors?.['required']">First name is required</div>
                      <div *ngIf="firstNameInput.errors?.['minlength']">First name must be at least 2 characters</div>
                      <div *ngIf="firstNameInput.errors?.['maxlength']">First name must not exceed 50 characters</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="lastName" class="form-label required">
                      <app-lucide-icon name="user" size="16px" class="me-1"></app-lucide-icon>
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName"
                      class="form-control" 
                      [(ngModel)]="formData.lastName"
                      #lastNameInput="ngModel"
                      required
                      minlength="2"
                      maxlength="50"
                      placeholder="Enter last name"
                      [class.is-invalid]="lastNameInput.invalid && lastNameInput.touched">
                    <div *ngIf="lastNameInput.invalid && lastNameInput.touched" class="invalid-feedback">
                      <div *ngIf="lastNameInput.errors?.['required']">Last name is required</div>
                      <div *ngIf="lastNameInput.errors?.['minlength']">Last name must be at least 2 characters</div>
                      <div *ngIf="lastNameInput.errors?.['maxlength']">Last name must not exceed 50 characters</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label required">
                  <app-lucide-icon name="at-sign" size="16px" class="me-1"></app-lucide-icon>
                  Username
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  class="form-control" 
                  [(ngModel)]="formData.username"
                  #usernameInput="ngModel"
                  required
                  minlength="3"
                  maxlength="50"
                  placeholder="Enter username"
                  [class.is-invalid]="usernameInput.invalid && usernameInput.touched">
                <div *ngIf="usernameInput.invalid && usernameInput.touched" class="invalid-feedback">
                  <div *ngIf="usernameInput.errors?.['required']">Username is required</div>
                  <div *ngIf="usernameInput.errors?.['minlength']">Username must be at least 3 characters</div>
                  <div *ngIf="usernameInput.errors?.['maxlength']">Username must not exceed 50 characters</div>
                </div>
              </div>

              <!-- Email and Phone Row -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="email" class="form-label">
                      <app-lucide-icon name="mail" size="16px" class="me-1"></app-lucide-icon>
                      Email
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      class="form-control" 
                      [(ngModel)]="formData.email"
                      #emailInput="ngModel"
                      placeholder="Enter email address"
                      [class.is-invalid]="emailInput.invalid && emailInput.touched">
                    <div *ngIf="emailInput.invalid && emailInput.touched" class="invalid-feedback">
                      <div *ngIf="emailInput.errors?.['email']">Please enter a valid email address</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">
                      <app-lucide-icon name="phone" size="16px" class="me-1"></app-lucide-icon>
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      id="phoneNumber" 
                      name="phoneNumber"
                      class="form-control" 
                      [(ngModel)]="formData.phoneNumber"
                      #phoneNumberInput="ngModel"
                      placeholder="Enter phone number">
                  </div>
                </div>
              </div>

              <!-- Role Selection -->
              <div class="mb-3">
                <label for="roleId" class="form-label">
                  <app-lucide-icon name="shield" size="16px" class="me-1"></app-lucide-icon>
                  Role
                </label>
                
                <!-- Loading state -->
                <div *ngIf="isLoadingRoles" class="d-flex align-items-center">
                  <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading roles...</span>
                  </div>
                  <span class="text-muted">Loading roles...</span>
                </div>
                
                <!-- Error state -->
                <div *ngIf="rolesError" class="alert alert-warning" role="alert">
                  <small>{{ rolesError }}</small>
                  <button type="button" class="btn btn-sm btn-outline-warning ms-2" (click)="loadRoles()">
                    Retry
                  </button>
                </div>
                
                <!-- Role selection dropdown -->
                <select 
                  *ngIf="!isLoadingRoles && !rolesError"
                  id="roleId" 
                  name="roleId"
                  class="form-select" 
                  [(ngModel)]="formData.roleId"
                  #roleIdInput="ngModel">
                  <option value="">Select a role (optional)</option>
                  <option *ngFor="let role of roles" [value]="role.id">
                    {{ role.name }} ({{ role.roleType }})
                  </option>
                </select>
                
                <div class="form-text">Optional: Associate user with a specific role</div>
              </div>

              <!-- User State -->
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

              <!-- User ID (Read-only for edit mode) -->
              <div *ngIf="isEditMode && formData.id" class="mb-3">
                <label for="userId" class="form-label">
                  <app-lucide-icon name="key" size="16px" class="me-1"></app-lucide-icon>
                  User ID
                </label>
                <input 
                  type="text" 
                  id="userId" 
                  name="userId"
                  class="form-control" 
                  [value]="formData.id"
                  readonly
                  placeholder="Auto-generated">
                <div class="form-text">This ID is automatically generated and cannot be changed.</div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <div class="ms-auto">
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="onSubmit()"
                [disabled]="isLoading || !userForm.form.valid">
                <app-lucide-icon *ngIf="!isLoading" [name]="isEditMode ? 'save' : 'plus'" size="16px" class="me-1"></app-lucide-icon>
                <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User') }}
              </button>
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
      padding: 2rem;
    }

    .modal-footer {
      border-top: 1px solid #e2e8f0;
      padding: 1.5rem;
      background-color: #f8fafc;
      border-radius: 0 0 0.75rem 0.75rem;
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
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

    .form-text {
      font-size: 0.75rem;
      color: #6b7280;
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

    .btn-primary {
      background-color: #1b2e4b;
      border-color: #1b2e4b;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #3498db;
      border-color: #3498db;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .modal-dialog {
        margin: 1rem;
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
export class UserFormModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() userData: User | null = null;
  @Input() isEditMode = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserFormData>();

  formData: UserFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    username: '',
    userType: 'HUMAN',
    roleId: '',
    entityState: 'ACTIVE'
  };

  // Role-related properties
  roles: Role[] = [];
  isLoadingRoles = false;
  rolesError: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    console.log('🎯 UserFormModalComponent - ngOnInit called');
    console.log('🎯 isVisible:', this.isVisible);
    this.initializeForm();
    this.loadRoles();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges() {
    console.log('🎯 UserFormModalComponent - ngOnChanges called');
    console.log('🎯 isVisible:', this.isVisible);
    console.log('🎯 userData:', this.userData);
    console.log('🎯 isEditMode:', this.isEditMode);
    this.initializeForm();
  }

  private initializeForm() {
    if (this.userData) {
      this.formData = {
        id: this.userData.id || '',
        firstName: this.userData.firstName || '',
        lastName: this.userData.lastName || '',
        email: this.userData.email || '',
        phoneNumber: this.userData.phoneNumber || '',
        username: this.userData.username || '',
        userType: this.userData.userType || 'HUMAN',
        roleId: this.userData.roleId || '',
        entityState: this.userData.entityState || 'ACTIVE'
      };
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      userType: 'HUMAN',
      roleId: '',
      entityState: 'ACTIVE'
    };
  }

  onSubmit() {
    if (this.isLoading) return;
    
    this.save.emit(this.formData);
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  loadRoles() {
    this.isLoadingRoles = true;
    this.rolesError = null;
    
    this.roleService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles) => {
          console.log('🎯 Roles loaded successfully:', roles);
          this.roles = roles;
          this.isLoadingRoles = false;
        },
        error: (error) => {
          console.error('❌ Error loading roles:', error);
          this.rolesError = 'Failed to load roles. Please try again.';
          this.isLoadingRoles = false;
        }
      });
  }
}
