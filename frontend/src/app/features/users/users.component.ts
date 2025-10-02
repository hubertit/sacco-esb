import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';
import { UserViewModalComponent } from '../../shared/components/user-view-modal/user-view-modal.component';
import { UserFormModalComponent } from '../../shared/components/user-form-modal/user-form-modal.component';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

import { UserService, User, UserType } from '../../core/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent, UserViewModalComponent, UserFormModalComponent, DeleteConfirmationModalComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Users</h4>
              <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" type="button" (click)="openAddUserModal()">
                <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                Add User
              </button>
            </div>
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="isLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading users...</p>
              </div>

              <!-- Error State -->
              <div *ngIf="hasError && !isLoading" class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error!</h4>
                <p>{{ errorMessage }}</p>
                <hr>
                <button class="btn btn-outline-danger btn-sm" (click)="refreshUsers()">
                  Try Again
                </button>
              </div>

              <!-- Data Table -->
              <app-data-table
                *ngIf="!isLoading && !hasError"
                [columns]="columns"
                [data]="users"
                [striped]="true"
                [showActions]="true"
                [showSearch]="false"
                [showPagination]="true"
                [currentPage]="currentPage"
                [pageSize]="pageSize"
                [totalPages]="totalPages"
                [totalItems]="totalItems"
                (onSort)="handleSort($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
                (onRowClick)="viewUser($event)">
                
                <ng-template #rowActions let-user>
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary view-btn-icon" 
                            type="button" 
                            title="View User Details"
                            (click)="viewUser(user); $event.stopPropagation()">
                      <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                    </button>
                    <button class="btn btn-sm btn-outline-warning edit-btn-icon" 
                            type="button" 
                            title="Edit User"
                            (click)="editUser(user); $event.stopPropagation()">
                      <app-lucide-icon name="edit" size="16px"></app-lucide-icon>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn-icon" 
                            type="button" 
                            title="Delete User"
                            (click)="deleteUser(user); $event.stopPropagation()">
                      <app-lucide-icon name="trash-2" size="16px"></app-lucide-icon>
                    </button>
                  </div>
                </ng-template>
              </app-data-table>
            </div>
          </div>

          <!-- User View Modal -->
          <app-user-view-modal
            [isVisible]="showViewModal"
            [user]="selectedUser"
            [isLoading]="isLoadingUser"
            [hasError]="hasUserError"
            [errorMessage]="userErrorMessage"
            (close)="closeViewModal()">
          </app-user-view-modal>

          <!-- User Form Modal -->
          <app-user-form-modal
            [isVisible]="showFormModal"
            [isLoading]="isFormLoading"
            [hasError]="!!formError"
            [userData]="formUserData"
            [isEditMode]="isEditMode"
            (close)="closeFormModal()"
            (save)="saveUser($event)">
          </app-user-form-modal>

          <!-- Delete Confirmation Modal -->
          <app-delete-confirmation-modal
            [isVisible]="showDeleteModal"
            [itemName]="deleteUserName"
            [itemType]="'User'"
            [isLoading]="isDeleteLoading"
            (confirm)="confirmDelete()"
            (cancel)="cancelDelete()">
          </app-delete-confirmation-modal>
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

      // Header dropdown styling
      .card-header .dropdown-menu {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.5rem;
        min-width: 200px;
        padding: 0.5rem 0;
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          
          &:hover {
            background-color: #f8f9fa;
            color: #495057;
            transform: translateX(2px);
          }
          
          &:active {
            background-color: #e9ecef;
            transform: translateX(0);
          }
          
          app-lucide-icon {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            display: inline-block;
            
            // Ensure icons are visible
            svg {
              width: 16px;
              height: 16px;
              display: block;
            }
          }
          
          span {
            flex: 1;
            white-space: nowrap;
          }
        }
      }

    :host ::ng-deep {
      .badge {
        font-size: 0.75em;
        font-weight: 500;
        border-radius: 0.25rem;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        box-shadow: none !important;
        border: none;
      }

      .badge-primary {
        color: #fff;
        background-color: #1b2e4b;
      }

      .badge-info {
        color: #fff;
        background-color: #3498db;
      }

      .badge-success {
        color: #fff;
        background-color: #28a745;
      }

      .badge-danger {
        color: #fff;
        background-color: #dc3545;
      }

      .view-btn-icon, .edit-btn-icon, .delete-btn-icon {
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
        background-color: transparent;
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .view-btn-icon {
        border: 1px solid #3b82f6;
        color: #3b82f6;
        
        &:hover {
          background-color: #1b2e4b;
          border-color: #1b2e4b;
          color: white;
          transform: scale(1.05);
        }
      }

      .edit-btn-icon {
        border: 1px solid #f59e0b;
        color: #f59e0b;
        
        &:hover {
          background-color: #f59e0b;
          border-color: #f59e0b;
          color: white;
          transform: scale(1.05);
        }
      }

      .delete-btn-icon {
        border: 1px solid #ef4444;
        color: #ef4444;
        
        &:hover {
          background-color: #ef4444;
          border-color: #ef4444;
          color: white;
          transform: scale(1.05);
        }
      }

      .dropdown-menu {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 0.5rem;
        min-width: 180px;
        padding: 0.5rem 0;
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          
          &:hover {
            background-color: #f8f9fa;
            color: #495057;
            transform: translateX(2px);
          }
          
          &:active {
            background-color: #e9ecef;
            transform: translateX(0);
          }
          
          &:focus {
            outline: none;
            background-color: #f8f9fa;
            box-shadow: inset 0 0 0 2px rgba(13, 110, 253, 0.25);
          }
          
          // Icon styling
          app-lucide-icon {
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            display: inline-block;
            
            // Ensure icons are visible
            svg {
              width: 16px;
              height: 16px;
              display: block;
            }
          }
          
          span {
            flex: 1;
            white-space: nowrap;
          }
        }
        
        .dropdown-divider {
          margin: 0.5rem 0;
          border-color: #e9ecef;
        }
      }
    }
  `]
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  isLoading = true;
  hasError = false;
  errorMessage = '';

  // View modal properties
  showViewModal = false;
  selectedUser: User | null = null;
  isLoadingUser = false;
  hasUserError = false;
  userErrorMessage = '';

  // Form modal properties
  showFormModal = false;
  isFormLoading = false;
  formError: string | null = null;
  formUserData: User | null = null;
  isEditMode = false;

  // Delete modal properties
  showDeleteModal = false;
  userToDelete: User | null = null;
  deleteUserName = '';
  isDeleteLoading = false;

  userTypeBadgeTemplate = (item: User) => {
    const badgeClass = item.userType === 'HUMAN' ? 'bg-primary' : 'bg-info';
    return `<span class="badge ${badgeClass}">${item.userType}</span>`;
  };

  statusBadgeTemplate = (item: User) => {
    const badgeClass = item.entityState === 'ACTIVE' ? 'bg-success' : 'bg-secondary';
    return `<span class="badge ${badgeClass}">${item.entityState}</span>`;
  };

  roleTemplate = (item: User) => {
    return item.roleName || '-';
  };

  columns: TableColumn[] = [
    { key: 'index', title: 'No.', type: 'text', sortable: false },
    { key: 'username', title: 'Username', type: 'text', sortable: true },
    { key: 'firstName', title: 'First Name', type: 'text', sortable: true },
    { key: 'lastName', title: 'Last Name', type: 'text', sortable: true },
    { key: 'userType', title: 'Type', type: 'custom', sortable: true, template: this.userTypeBadgeTemplate },
    { key: 'email', title: 'Email', type: 'text', sortable: true },
    { key: 'phoneNumber', title: 'Phone', type: 'text', sortable: true },
    { key: 'entityState', title: 'Status', type: 'custom', sortable: true, template: this.statusBadgeTemplate }
  ];

  users: User[] = [];
  allUsers: User[] = []; // Store all users for client-side operations
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Debug authentication state
    console.log('🔍 UsersComponent - Checking authentication state:');
    console.log('🔍 Access token:', localStorage.getItem('access_token'));
    console.log('🔍 Refresh token:', localStorage.getItem('refresh_token'));
    console.log('🔍 Current user:', localStorage.getItem('current_user'));
    console.log('🔍 UsersComponent - Columns:', this.columns);
    console.log('🔍 UsersComponent - Show actions enabled');
    
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up is handled automatically by Renderer2
  }

  ngAfterViewInit() {
    // Component initialization complete
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.hasError = false;
    
    console.log('🔄 UsersComponent: Starting to load users...');

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('❌ No authentication token found!');
      this.hasError = true;
      this.errorMessage = 'You are not logged in. Please log in first to view users.';
      this.isLoading = false;
      return;
    }

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$), finalize(() => {
        this.isLoading = false;
        console.log('⏹️ UsersComponent: Finished loading (isLoading set to false)');
      }))
      .subscribe({
        next: (users: User[]) => {
          console.log('✅ UsersComponent: Successfully loaded users');
          console.log('👥 Number of users received:', users?.length || 0);
          console.log('📋 Users data:', users);
          
          // Store all users and add index
          this.allUsers = users.map((user, index) => ({
            ...user,
            index: index + 1
          }));
          
          this.totalItems = this.allUsers.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          
          // Apply pagination to display users
          this.updateDisplayedUsers();
          
          // Trigger change detection to ensure DOM is updated
          this.cdr.detectChanges();
          
          if (!users || users.length === 0) {
            console.warn('⚠️ No users returned from API');
          }
        },
        error: (error) => {
          console.error('❌ UsersComponent: Error loading users');
          console.error('❌ Error object:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          
          this.hasError = true;
          
          if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 403) {
            this.errorMessage = 'Access denied. You do not have permission to view users.';
          } else {
            this.errorMessage = error.message || 'Failed to load users from the API. Please check your connection and try again.';
          }
        }
      });
  }

  public refreshUsers(): void {
    this.loadUsers();
  }


  viewUser(user: User): void {
    console.log('Viewing user:', user);
    this.selectedUser = null;
    this.showViewModal = true;
    this.isLoadingUser = true;
    this.hasUserError = false;
    this.userErrorMessage = '';

    // Load user details by username
    this.userService.getUserByUsername(user.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userDetails: User) => {
          console.log('✅ User details loaded:', userDetails);
          this.selectedUser = userDetails;
          this.isLoadingUser = false;
        },
        error: (error) => {
          console.error('❌ Error loading user details:', error);
          this.isLoadingUser = false;
          this.hasUserError = true;
          this.userErrorMessage = error.message || 'Failed to load user details. Please try again.';
        }
      });
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    this.formUserData = user;
    this.isEditMode = true;
    this.showFormModal = true;
    this.formError = null;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedUser = null;
    this.isLoadingUser = false;
    this.hasUserError = false;
    this.userErrorMessage = '';
  }

  deleteUser(user: User): void {
    console.log('Deleting user:', user);
    this.userToDelete = user;
    this.deleteUserName = `${user.firstName} ${user.lastName}`;
    this.showDeleteModal = true;
  }

  // Form modal methods
  openAddUserModal(): void {
    console.log('🎯 openAddUserModal called - opening registration modal');
    
    this.formUserData = {
      id: '',
      version: 0,
      entityState: 'ACTIVE',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      username: '',
      userType: 'HUMAN', // Default to HUMAN user type
      roleId: '',
      roleName: ''
    };
    this.isEditMode = false;
    this.showFormModal = true;
    this.formError = null;
    
    console.log('🎯 Modal opened. showFormModal:', this.showFormModal);
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.formUserData = null;
    this.isEditMode = false;
    this.isFormLoading = false;
    this.formError = null;
  }

  saveUser(userData: any): void {
    console.log('Saving user:', userData);
    this.isFormLoading = true;
    this.formError = null;

    const userPayload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email || null,
      phoneNumber: userData.phoneNumber || null,
      username: userData.username,
      userType: userData.userType,
      roleId: userData.roleId || null,
      entityState: userData.entityState
    };

    const operation = this.isEditMode 
      ? this.userService.updateUser(this.formUserData!.id, userPayload)
      : this.userService.createUser(userPayload);

    operation
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (savedUser: User) => {
          console.log('✅ User saved successfully:', savedUser);
          this.isFormLoading = false;
          this.closeFormModal();
          this.loadUsers(); // Refresh the users list
        },
        error: (error) => {
          console.error('❌ Error saving user:', error);
          this.isFormLoading = false;
          this.formError = error.message || 'Failed to save user. Please try again.';
        }
      });
  }

  // Delete modal methods
  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.isDeleteLoading = true;
    this.userService.deleteUser(this.userToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ User deleted successfully');
          this.isDeleteLoading = false;
          this.cancelDelete();
          this.loadUsers(); // Refresh the users list
        },
        error: (error) => {
          console.error('❌ Error deleting user:', error);
          this.isDeleteLoading = false;
          // You might want to show an error message here
        }
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.deleteUserName = '';
    this.isDeleteLoading = false;
  }


  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1; // Reset to first page when sorting
    this.updateDisplayedUsers();
  }

  handlePageChange(page: number) {
    console.log('🔄 UsersComponent: Page change requested to:', page);
    console.log('📊 Current state - currentPage:', this.currentPage, 'totalPages:', this.totalPages, 'pageSize:', this.pageSize);
    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers();
      console.log('✅ UsersComponent: Page changed to:', this.currentPage, 'Displaying', this.users.length, 'users');
    } else {
      console.warn('⚠️ UsersComponent: Invalid page number:', page);
    }
  }

  handlePageSizeChange(size: number) {
    console.log('🔄 UsersComponent: Page size change requested to:', size);
    console.log('📊 Current state - pageSize:', this.pageSize, 'totalItems:', this.totalItems);
    
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page when changing page size
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedUsers();
    
    console.log('✅ UsersComponent: Page size changed to:', this.pageSize, 'totalPages:', this.totalPages, 'Displaying', this.users.length, 'users');
  }

  private updateDisplayedUsers(): void {
    console.log('🔄 UsersComponent: Updating displayed users');
    console.log('📊 Pagination - currentPage:', this.currentPage, 'pageSize:', this.pageSize, 'totalItems:', this.totalItems);
    console.log('📊 All users count:', this.allUsers.length);
    
    let sortedUsers = [...this.allUsers];
    
    // Apply sorting if specified
    if (this.sortColumn) {
      console.log('🔄 Applying sort - column:', this.sortColumn, 'direction:', this.sortDirection);
      sortedUsers.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof User];
        const bValue = b[this.sortColumn as keyof User];
        
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
    console.log('📊 Pagination slice - startIndex:', startIndex, 'endIndex:', endIndex);
    
    this.users = sortedUsers.slice(startIndex, endIndex);
    console.log('✅ UsersComponent: Updated displayed users count:', this.users.length);
  }
}
