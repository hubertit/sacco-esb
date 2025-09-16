import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableColumn } from '../../shared/components/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';

declare var $: any;

interface Entity {
  id: number;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent, DataTableComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Entities</h4>
              <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" (click)="openAddEntityModal()">
                <app-feather-icon name="plus" size="14px"></app-feather-icon>
                Add New Entity
              </button>
            </div>
            <div class="card-body">
              <app-data-table
                tableId="entitiesTable"
                [columns]="columns"
                [data]="entities"
                (table-action)="handleTableAction($event)"
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
export class EntitiesComponent implements OnInit, AfterViewInit {
  columns: TableColumn[] = [
    { key: 'id', title: 'ID', type: 'text', sortable: true },
    { key: 'name', title: 'Name', type: 'text', sortable: true },
    { key: 'type', title: 'Type', type: 'text', sortable: true },
    { key: 'status', title: 'Status', type: 'status', sortable: true },
    { key: 'createdAt', title: 'Created At', type: 'date', sortable: true },
    { key: 'updatedAt', title: 'Updated At', type: 'date', sortable: true },
    {
      key: 'actions',
      title: 'Actions',
      type: 'custom',
      sortable: false,
      render: (data: any, type: string, row: any) => {
        if (type === 'display') {
          return `
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-info" data-action="edit">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="btn btn-sm btn-danger" data-action="delete">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          `;
        }
        return data;
      }
    }
  ];

  entities: Entity[] = [
    {
      id: 1,
      name: 'Bank A',
      type: 'Financial Institution',
      status: 'active',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15'
    },
    {
      id: 2,
      name: 'SACCO B',
      type: 'Cooperative',
      status: 'active',
      createdAt: '2024-03-14',
      updatedAt: '2024-03-15'
    },
    {
      id: 3,
      name: 'Payment Provider C',
      type: 'Payment Service',
      status: 'inactive',
      createdAt: '2024-03-13',
      updatedAt: '2024-03-14'
    }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    // DataTable initialization is handled by the DataTableComponent
  }

  openAddEntityModal() {
    // TODO: Implement add entity modal
    console.log('Open add entity modal');
  }

  handleTableAction(event: any) {
    const { action, row } = event.detail;
    
    switch (action) {
      case 'edit':
        this.editEntity(row);
        break;
      case 'delete':
        this.deleteEntity(row);
        break;
    }
  }

  editEntity(entity: Entity) {
    // TODO: Implement edit entity
    console.log('Edit entity:', entity);
  }

  deleteEntity(entity: Entity) {
    // TODO: Implement delete entity
    console.log('Delete entity:', entity);
  }
}
