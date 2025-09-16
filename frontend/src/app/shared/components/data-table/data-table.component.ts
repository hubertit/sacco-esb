import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-buttons';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';

declare var $: any;

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'boolean' | 'custom' | 'status';
  template?: any;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-wrapper">
      <table [id]="tableId" class="table table-striped dt-responsive nowrap" style="width:100%">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.title }}</th>
            <th *ngIf="showActions" class="no-sort">Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements AfterViewInit, OnDestroy {
  private dataTable: any;
  @Input() tableId = 'dataTable';
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() showHeader = true;
  @Input() showSearch = true;
  @Input() showActions = true;
  @Input() showPagination = true;
  @Input() hover = true;
  @Input() striped = true;
  @Input() noDataMessage = 'No data available';
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalPages = 1;
  @Input() pageSizes = [5, 10, 25, 50];

  @Output() onSort = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<number>();

  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.onSort.emit({ column: this.sortColumn, direction: this.sortDirection });
  }

  ngAfterViewInit(): void {
    this.initializeDataTable();
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }

  private initializeDataTable(): void {
    const tableId = '#' + (this.tableId || 'dataTable');
    this.dataTable = $(tableId).DataTable({
      data: this.data,
      columns: this.columns.map(col => ({
        data: col.key,
        title: col.title,
        orderable: col.sortable,
        render: (data: any, type: string, row: any) => {
          if (type === 'display') {
            switch (col.type) {
              case 'date':
                return new Date(data).toLocaleString();
              case 'boolean':
                return `<span class="badge ${data ? 'badge-success' : 'badge-danger'}">${data ? 'Yes' : 'No'}</span>`;
              case 'status':
                return `<span class="badge ${data === 'active' ? 'badge-success' : 'badge-danger'}">${data}</span>`;
              default:
                return data;
            }
          }
          return data;
        }
      })),
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      language: {
        search: 'Search:',
        lengthMenu: 'Show _MENU_ entries',
        info: 'Showing _START_ to _END_ of _TOTAL_ entries',
        infoEmpty: 'Showing 0 to 0 of 0 entries',
        infoFiltered: '(filtered from _MAX_ total entries)',
        paginate: {
          first: 'First',
          last: 'Last',
          next: 'Next',
          previous: 'Previous'
        }
      }
    });

    // Handle row actions
    $(tableId).on('click', '[data-action]', (event: any) => {
      const action = $(event.currentTarget).data('action');
      const rowData = this.dataTable.row($(event.currentTarget).closest('tr')).data();
      this.onAction.emit({ action, row: rowData });
    });
  }
}
