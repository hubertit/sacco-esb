import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { TableColumn } from '../../shared/components/data-table/data-table.component';

import { EntityService, Entity } from '../../core/services/entity.service';
import { EntityViewModalComponent } from '../../shared/components/entity-view-modal/entity-view-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent, EntityViewModalComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Entities</h4>
              <div class="dropdown">
                <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" type="button" id="addEntityDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                  Add Entity
                </button>
                <ul class="dropdown-menu" aria-labelledby="addEntityDropdown">
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddEntityModal('Financial')">
                      <app-lucide-icon name="briefcase" size="14px"></app-lucide-icon>
                      Add Financial Institution
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" (click)="openAddEntityModal('Payment')">
                      <app-lucide-icon name="credit-card" size="14px"></app-lucide-icon>
                      Add Payment Service
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
                <p class="mt-2 text-muted">Loading entities...</p>
              </div>

              <!-- Error State -->
              <div *ngIf="error && !isLoading" class="text-center py-4">
                <div class="alert alert-danger" role="alert">
                  <h5 class="alert-heading">Error Loading Entities</h5>
                  <p>{{ error }}</p>
                  <button class="btn btn-outline-danger" (click)="loadEntities()">
                    <app-lucide-icon name="refresh-cw" size="16px"></app-lucide-icon>
                    Try Again
                  </button>
                </div>
              </div>

              <!-- Data Table -->
              <app-data-table
                *ngIf="!isLoading && !error"
                [columns]="columns"
                [data]="entities"
                [striped]="true"
                [showSearch]="false"
                [showActions]="true"
                [showPagination]="true"
                [currentPage]="currentPage"
                [pageSize]="pageSize"
                [totalPages]="totalPages"
                [totalItems]="totalItems"
                (onSort)="handleSort($event)"
                (onPageChange)="handlePageChange($event)"
                (onPageSizeChange)="handlePageSizeChange($event)"
                (onRowClick)="viewEntity($event)"
              >
                <ng-template #rowActions let-entity>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-primary view-btn-icon" 
                            type="button" 
                            title="View Entity Details"
                            (click)="viewEntity(entity)">
                      <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                    </button>
                  </div>
                </ng-template>
              </app-data-table>

              <!-- Empty State -->
              <div *ngIf="!isLoading && !error && entities.length === 0" class="text-center py-4">
                <app-lucide-icon name="building" size="48px" color="#6c757d"></app-lucide-icon>
                <h5 class="mt-3 text-muted">No Entities Found</h5>
                <p class="text-muted">No entities have been created yet.</p>
                <button class="btn btn-primary" (click)="openAddEntityModal('Financial')">
                  <app-lucide-icon name="plus" size="16px"></app-lucide-icon>
                  Add First Entity
                </button>
              </div>
            </div>
          </div>

          <!-- Entity View Modal -->
          <app-entity-view-modal
            [isVisible]="showEntityModal"
            [entity]="selectedEntity"
            [isLoading]="false"
            [hasError]="false"
            (close)="closeEntityModal()">
          </app-entity-view-modal>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 16px;
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

    .view-btn-icon {
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
      border: 1px solid #3b82f6;
      background-color: transparent;
      color: #3b82f6;
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      
      &:hover {
        background-color: #1b2e4b;
        border-color: #1b2e4b;
        color: white;
        transform: scale(1.05);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
      }

      &:active {
        transform: scale(0.95);
      }
    }
  `]
})
export class EntitiesComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  // Component state
  isLoading = false;
  error: string | null = null;
  entities: Entity[] = [];
  allEntities: Entity[] = []; // Store all entities for client-side operations
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Modal state
  showEntityModal = false;
  selectedEntity: Entity | null = null;

  columns: TableColumn[] = [
    { key: 'index', title: '#', type: 'text', sortable: false },
    { key: 'entityName', title: 'Entity Name', type: 'text', sortable: true },
    { key: 'code', title: 'Code', type: 'text', sortable: true },
    { key: 'legalCode', title: 'Legal Code', type: 'text', sortable: true },
    { key: 'district', title: 'District', type: 'text', sortable: true },
    { key: 'entityState', title: 'Status', type: 'status', sortable: true }
  ];

  constructor(
    private entityService: EntityService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadEntities();
  }

  ngAfterViewInit() {
    // DataTable initialization is handled by the DataTableComponent
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load entities from the API
   */
  loadEntities() {
    this.isLoading = true;
    this.error = null;
    
    this.entityService.getEntities()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (entities) => {
          // Store all entities and add index
          this.allEntities = entities.map((entity, index) => ({
            ...entity,
            index: index + 1
          }));
          
          this.totalItems = this.allEntities.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          
          // Apply pagination to display entities
          this.updateDisplayedEntities();
        },
        error: (error) => {
          console.error('Error loading entities:', error);
          this.error = 'Failed to load entities. Please try again.';
        }
      });
  }

  /**
   * Update displayed entities with sorting and pagination
   */
  updateDisplayedEntities(): void {
    let sortedEntities = [...this.allEntities];
    
    // Apply sorting if specified
    if (this.sortColumn) {
      sortedEntities.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof Entity];
        const bValue = b[this.sortColumn as keyof Entity];
        
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
    this.entities = sortedEntities.slice(startIndex, endIndex);
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  openAddEntityModal(type: 'Financial' | 'Payment') {
    // TODO: Implement add entity modal
    console.log('Open add entity modal for type:', type);
  }

  handleSort(event: { column: string; direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1; // Reset to first page when sorting
    this.updateDisplayedEntities();
  }

  handlePageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedEntities();
    }
  }

  handlePageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page when changing page size
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.updateDisplayedEntities();
  }

  editEntity(entity: Entity) {
    // TODO: Implement edit entity
    console.log('Edit entity:', entity);
  }

  deleteEntity(entity: Entity) {
    if (confirm(`Are you sure you want to delete ${entity.entityName}?`)) {
      this.entityService.deleteEntity(entity.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadEntities(); // Reload the list
          },
          error: (error) => {
            console.error('Error deleting entity:', error);
            this.error = 'Failed to delete entity. Please try again.';
          }
        });
    }
  }

  viewEntity(entity: Entity) {
    console.log('🔍 Viewing entity:', entity);
    this.selectedEntity = entity;
    this.showEntityModal = true;
  }

  closeEntityModal() {
    this.showEntityModal = false;
    this.selectedEntity = null;
  }
}
