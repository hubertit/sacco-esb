import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent, DataTableComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Users</h4>
              <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" (click)="openAddUserModal()">
                <app-feather-icon name="user-plus" size="14px"></app-feather-icon>
                Add New User
              </button>
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
  `]
})
export class UsersComponent implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'text', sortable: true },
    { key: 'name', title: 'Name', type: 'text', sortable: true },
    { key: 'email', title: 'Email', type: 'text', sortable: true },
    { key: 'role', title: 'Role', type: 'text', sortable: true },
    { key: 'status', title: 'Status', type: 'status', sortable: true },
    { key: 'lastLogin', title: 'Last Login', type: 'date', sortable: true },
    { key: 'createdAt', title: 'Created At', type: 'date', sortable: true }
  ];

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openAddUserModal() {
    // TODO: Implement add user modal
    console.log('Open add user modal');
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
