import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { RoleService } from '../../core/services/role.service';
import { Role } from '../../core/models/role.models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Roles</h4>
              <div class="dropdown">
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" type="button" id="addRoleDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                  Add Role
                </button>
                <ul class="dropdown-menu" aria-labelledby="addRoleDropdown">
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddRoleModal('System')">
                      <app-lucide-icon name="shield" size="14px"></app-lucide-icon>
                      Add System Role
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddRoleModal('Custom')">
                      <app-lucide-icon name="users" size="14px"></app-lucide-icon>
                      Add Custom Role
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-body">
              <app-data-table
                [columns]="columns"
                [data]="roles"
                [striped]="true"
                [showSearch]="false"
                [showPagination]="true"
                [currentPage]="currentPage"
                [pageSize]="pageSize"
                [totalPages]="totalPages"
                [totalItems]="totalItems"
                (onSort)="handleSort($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
              ></app-data-table>
            </div>
          </div>
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

    :host ::ng-deep {
      .badge {
        padding: 0.35em 0.65em;
        font-size: 0.75em;
        font-weight: 500;
        border-radius: 0.25rem;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
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
    }
  `]
})
export class RolesComponent implements OnInit {
  roleTypeTemplate = (item: Role) => `
    <span class="badge ${item.roleType === 'ADMINISTRATOR' ? 'bg-primary' : 'bg-info'}">
      ${item.roleType}
    </span>
  `;

  statusTemplate = (item: Role) => `
    <span class="badge ${item.entityState === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}">
      ${item.entityState}
    </span>
  `;

  columns: TableColumn[] = [
    { key: 'index', title: 'No.', type: 'text', sortable: false },
    { key: 'name', title: 'Name', type: 'text', sortable: true },
    { key: 'roleType', title: 'Role Type', type: 'custom', sortable: true, template: this.roleTypeTemplate },
    { key: 'entityState', title: 'Status', type: 'custom', sortable: true, template: this.statusTemplate },
    { key: 'version', title: 'Version', type: 'text', sortable: true }
  ];

  roles: Role[] = [];
  allRoles: Role[] = []; // Store all roles for client-side operations
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.loadRoles();
  }

  private loadRoles() {
    this.roleService.getRoles().subscribe(roles => {
      // Store all roles and add index
      this.allRoles = roles.map((role, index) => ({
        ...role,
        index: index + 1
      }));
      
      this.totalItems = this.allRoles.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      
      // Apply pagination to display roles
      this.updateDisplayedRoles();
    });
  }

  openAddRoleModal(type: 'System' | 'Custom') {
    // TODO: Implement add role modal
    console.log('Open add role modal for type:', type);
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1; // Reset to first page when sorting
    this.updateDisplayedRoles();
  }

  handlePageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedRoles();
    }
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page when changing page size
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedRoles();
  }

  private updateDisplayedRoles(): void {
    let sortedRoles = [...this.allRoles];
    
    // Apply sorting if specified
    if (this.sortColumn) {
      sortedRoles.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof Role];
        const bValue = b[this.sortColumn as keyof Role];
        
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
    this.roles = sortedRoles.slice(startIndex, endIndex);
  }
}
