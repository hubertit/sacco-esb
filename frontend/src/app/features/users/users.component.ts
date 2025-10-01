import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';
import { UserViewModalComponent } from '../../shared/components/user-view-modal/user-view-modal.component';

import { UserService, User, UserType } from '../../core/services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent, UserViewModalComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Users</h4>
              <div class="dropdown">
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" type="button" id="addUserDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                  Add User
                </button>
                <ul class="dropdown-menu" aria-labelledby="addUserDropdown">
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-3" (click)="openAddUserModal('HUMAN')">
                      <app-lucide-icon name="user" size="16px" class="text-primary"></app-lucide-icon>
                      <span>Add Human User</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-3" (click)="openAddUserModal('APPLICATION')">
                      <app-lucide-icon name="box" size="16px" class="text-info"></app-lucide-icon>
                      <span>Add Application</span>
                    </a>
                  </li>
                </ul>
              </div>
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
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-secondary view-btn" 
                            type="button" 
                            title="View User Details"
                            (click)="viewUser(user)">
                      <app-lucide-icon name="eye" size="12px"></app-lucide-icon>
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
            (close)="closeViewModal()"
            (edit)="editUser($event)"
            (delete)="deleteUser($event)">
          </app-user-view-modal>
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

      // View button styles
      .view-btn {
        cursor: pointer;
        user-select: none;
        border-color: #6c757d !important; // Grayish border
        color: #6c757d !important; // Grayish text
        transition: all 0.2s ease;
        padding: 0.25rem 0.5rem !important; // Smaller padding for compact width
        min-width: auto !important; // Remove minimum width constraint
        
        &:hover {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          color: white !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2);
        }
        
        &:focus {
          box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25) !important;
          border-color: #6c757d !important;
        }
        
        &:active {
          transform: translateY(0);
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
    
    // Check Bootstrap availability
    this.checkBootstrapAvailability();
    
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

  private initializeBootstrapDropdowns() {
    // Wait for the DOM to be ready and ensure Bootstrap is loaded
    setTimeout(() => {
      if (typeof bootstrap === 'undefined') {
        console.error('❌ Bootstrap is not available!');
        return;
      }

      // Find all dropdown elements in the current component
      const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
      console.log('🔍 Found dropdown elements:', dropdownElements.length);
      
      dropdownElements.forEach((element, index) => {
        console.log(`🔍 Initializing dropdown ${index}:`, element);
        try {
          // Dispose existing dropdown if any
          const existingDropdown = bootstrap.Dropdown.getInstance(element);
          if (existingDropdown) {
            existingDropdown.dispose();
          }
          
          // Create new dropdown with proper configuration
          const dropdown = new bootstrap.Dropdown(element, {
            autoClose: true,
            boundary: 'viewport'
          });
          
          console.log(`✅ Dropdown ${index} initialized successfully`);
        } catch (error) {
          console.error(`❌ Error initializing dropdown ${index}:`, error);
        }
      });
    }, 300);
  }

  private checkBootstrapAvailability() {
    // Check if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
      console.log('✅ Bootstrap is available');
      console.log('🔍 Bootstrap version:', bootstrap.Tooltip.VERSION || 'Unknown');
    } else {
      console.error('❌ Bootstrap is not available!');
      console.log('🔍 Available global objects:', Object.keys(window));
    }
  }

  private setupDropdownEventDelegation() {
    // Use Renderer2 for better event handling
    this.renderer.listen('document', 'click', this.handleDropdownClick);
  }

  private handleDropdownClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const dropdownToggle = target.closest('[data-bs-toggle="dropdown"]');
    
    if (dropdownToggle) {
      event.preventDefault();
      event.stopPropagation();
      
      // Manually toggle the dropdown
      if (typeof bootstrap !== 'undefined') {
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
        dropdown.toggle();
      }
    }
    
    // Handle dropdown menu item clicks
    const dropdownItem = target.closest('.dropdown-item');
    if (dropdownItem) {
      // Let the click event propagate to handle the action
      // Don't prevent default here as we want the click handlers to work
    }
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
          
          // Reinitialize Bootstrap dropdowns after data is loaded and DOM is updated
          setTimeout(() => {
            this.initializeBootstrapDropdowns();
          }, 100);
          
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

  openAddUserModal(type: UserType) {
    // TODO: Implement add user modal
    console.log('Open add user modal for type:', type);
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
    // TODO: Implement edit user functionality
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
    // TODO: Implement delete user functionality
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
