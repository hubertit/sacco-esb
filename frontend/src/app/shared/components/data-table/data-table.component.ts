import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
      <!-- Table Header Actions -->
      <div class="data-table-header" *ngIf="showHeader">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="d-flex align-items-center gap-2">
            <div class="search-box" *ngIf="showSearch">
              <input
                type="text"
                class="form-control"
                placeholder="Search..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch.emit($event)">
            </div>
            <ng-content select="[table-actions-left]"></ng-content>
          </div>
          <div class="d-flex align-items-center gap-2">
            <ng-content select="[table-actions-right]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Main Table -->
      <div class="table-responsive">
        <table class="table" [class.table-hover]="hover" [class.table-striped]="striped">
          <thead>
            <tr>
              <th *ngFor="let col of columns" 
                  [class.sortable]="col.sortable"
                  (click)="col.sortable && sort(col.key)">
                {{ col.title }}
                <i *ngIf="col.sortable" class="sort-icon"
                   [class.asc]="sortColumn === col.key && sortDirection === 'asc'"
                   [class.desc]="sortColumn === col.key && sortDirection === 'desc'">
                </i>
              </th>
              <th *ngIf="showActions" class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of data">
              <td *ngFor="let col of columns">
                <ng-container [ngSwitch]="col.type">
                  <ng-container *ngSwitchCase="'date'">
                    {{ item[col.key] | date:'medium' }}
                  </ng-container>
                  <ng-container *ngSwitchCase="'boolean'">
                    <span class="badge" [class.badge-success]="item[col.key]" [class.badge-danger]="!item[col.key]">
                      {{ item[col.key] ? 'Yes' : 'No' }}
                    </span>
                  </ng-container>
                  <ng-container *ngSwitchCase="'custom'">
                    <ng-container *ngTemplateOutlet="col.template; context: { $implicit: item }">
                    </ng-container>
                  </ng-container>
                  <ng-container *ngSwitchDefault>
                    {{ item[col.key] }}
                  </ng-container>
                </ng-container>
              </td>
              <td *ngIf="showActions" class="actions-column">
                <ng-content select="[row-actions]" [ngTemplateOutlet]="rowActions" [ngTemplateOutletContext]="{ $implicit: item }">
                </ng-content>
              </td>
            </tr>
            <tr *ngIf="!data?.length">
              <td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="text-center py-4">
                {{ noDataMessage }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="data-table-footer d-flex justify-content-between align-items-center mt-3" *ngIf="showPagination">
        <div class="page-size">
          <select class="form-select" [(ngModel)]="pageSize" (ngModelChange)="onPageSizeChange.emit($event)">
            <option *ngFor="let size of pageSizes" [value]="size">{{ size }} per page</option>
          </select>
        </div>
        <nav aria-label="Table navigation" *ngIf="totalPages > 1">
          <ul class="pagination mb-0">
            <li class="page-item" [class.disabled]="currentPage === 1">
              <a class="page-link" href="javascript:void(0)" (click)="onPageChange.emit(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item" *ngFor="let page of getPages()" [class.active]="page === currentPage">
              <a class="page-link" href="javascript:void(0)" (click)="onPageChange.emit(page)">{{ page }}</a>
            </li>
            <li class="page-item" [class.disabled]="currentPage === totalPages">
              <a class="page-link" href="javascript:void(0)" (click)="onPageChange.emit(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
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

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
