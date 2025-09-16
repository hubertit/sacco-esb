import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { UserService, User, UserType } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FeatherIconComponent, DataTableComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Users</h4>
              <div class="dropdown">
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" type="button" id="addUserDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <app-feather-icon name="plus" size="14px"></app-feather-icon>
                  Add User
                </button>
                <ul class="dropdown-menu" aria-labelledby="addUserDropdown">
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddUserModal('Human')">
                      <app-feather-icon name="user" size="14px"></app-feather-icon>
                      Add Human User
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddUserModal('Application')">
                      <app-feather-icon name="box" size="14px"></app-feather-icon>
                      Add Application
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="card-body">
              <app-data-table
                [columns]="columns"
                [data]="users"
                [striped]="true"
                (onSort)="handleSort($event)"
                (onSearch)="handleSearch($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
              ></app-data-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
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
      padding: 1.5rem;
    }

    .btn-primary {
      background-color: #1b2e4b;
      border-color: #1b2e4b;

      &:hover {
        background-color: #3498db;
        border-color: #3498db;
      }

      app-feather-icon {
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
    }
  `]
})
export class UsersComponent implements OnInit {
  userTypeBadgeTemplate = (item: User) => `
    <span class="badge ${item.type === 'Human' ? 'badge-primary' : 'badge-info'}">
      ${item.type}
    </span>
  `;

  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'text', sortable: true },
    { key: 'name', title: 'Name', type: 'text', sortable: true },
    { key: 'type', title: 'Type', type: 'custom', sortable: true, template: this.userTypeBadgeTemplate },
    { key: 'email', title: 'Email', type: 'text', sortable: true },
    { key: 'role', title: 'Role', type: 'text', sortable: true },
    { key: 'status', title: 'Status', type: 'status', sortable: true },
    { key: 'lastLogin', title: 'Last Login', type: 'date', sortable: true },
    { key: 'createdAt', title: 'Created At', type: 'date', sortable: true }
  ];

  users: User[] = [];

  userTypeBadgeTemplate = (item: User) => `
    <span class="badge ${item.type === 'Human' ? 'badge-primary' : 'badge-info'}">
      ${item.type}
    </span>
  `;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openAddUserModal(type: UserType) {
    // TODO: Implement add user modal
    console.log('Open add user modal for type:', type);
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    // TODO: Implement sorting
    console.log('Sort:', event);
  }

  handleSearch(term: string) {
    // TODO: Implement search
    console.log('Search term:', term);
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
