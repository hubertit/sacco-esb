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
    <span class="badge ${item.roleType === 'ADMINISTRATOR' ? 'badge-primary' : 'badge-info'}">
      ${item.roleType}
    </span>
  `;

  statusTemplate = (item: Role) => `
    <span class="badge ${item.entityState === 'ACTIVE' ? 'badge-success' : 'badge-danger'}">
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

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.loadRoles();
  }

  private loadRoles() {
    this.roleService.getRoles().subscribe(roles => {
      // Add index numbers to roles for the No. column
      this.roles = roles.map((role, index) => ({
        ...role,
        index: index + 1
      }));
    });
  }

  openAddRoleModal(type: 'System' | 'Custom') {
    // TODO: Implement add role modal
    console.log('Open add role modal for type:', type);
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }


  handlePageChange(page: number) {
    // TODO: Implement pagination
    console.log('Page:', page);
  }

  handlePageSizeChange(size: number) {
    // TODO: Implement page size change
    console.log('Page size:', size);
  }
}
