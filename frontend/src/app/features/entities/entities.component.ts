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
import { EntityFormModalComponent, EntityFormData } from '../../shared/components/entity-form-modal/entity-form-modal.component';
import { CreateEntityModalComponent, CreateEntityData } from '../../shared/components/create-entity-modal/create-entity-modal.component';
import { DeleteConfirmationModalComponent } from '../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-entities',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, LucideIconComponent, DataTableComponent, EntityViewModalComponent, EntityFormModalComponent, CreateEntityModalComponent, DeleteConfirmationModalComponent],
  template: `
    <div class="dashboard-container">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="card-title mb-0">Entities</h4>
              <button class="btn btn-primary btn-sm d-flex align-items-center gap-2" 
                      type="button" 
                      (click)="openAddEntityModal('Financial')">
                <app-lucide-icon name="plus" size="14px"></app-lucide-icon>
                Add Entity
              </button>
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
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary view-btn-icon" 
                            type="button" 
                            title="View Entity Details"
                            (click)="viewEntity(entity); $event.stopPropagation()">
                      <app-lucide-icon name="eye" size="16px"></app-lucide-icon>
                    </button>
                    <button class="btn btn-sm btn-outline-warning edit-btn-icon" 
                            type="button" 
                            title="Edit Entity"
                            (click)="editEntity(entity); $event.stopPropagation()">
                      <app-lucide-icon name="edit" size="16px"></app-lucide-icon>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn-icon" 
                            type="button" 
                            title="Delete Entity"
                            (click)="deleteEntity(entity); $event.stopPropagation()">
                      <app-lucide-icon name="trash-2" size="16px"></app-lucide-icon>
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

          <!-- Entity Form Modal -->
          <app-entity-form-modal
            [isVisible]="showFormModal"
            [isLoading]="isFormLoading"
            [hasError]="!!formError"
            [entityData]="formEntityData"
            [isEditMode]="isEditMode"
            (close)="closeFormModal()"
            (save)="saveEntity($event)"
            (contractCreated)="onContractCreated($event)">
          </app-entity-form-modal>

          <!-- Create Entity Modal -->
          <app-create-entity-modal
            [isVisible]="showCreateModal"
            [isLoading]="isCreateLoading"
            [hasError]="!!createError"
            (close)="closeCreateModal()"
            (create)="createEntity($event)">
          </app-create-entity-modal>

          <!-- Delete Confirmation Modal -->
          <app-delete-confirmation-modal
            [isVisible]="showDeleteModal"
            [itemName]="deleteEntityName"
            [itemType]="'Entity'"
            [isLoading]="isDeleteLoading"
            (confirm)="confirmDelete()"
            (cancel)="cancelDelete()">
          </app-delete-confirmation-modal>
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
  
  // Form modal state
  showFormModal = false;
  isFormLoading = false;
  formError: string | null = null;
  formEntityData: EntityFormData | null = null;
  isEditMode = false;
  
  // Create modal state
  showCreateModal = false;
  isCreateLoading = false;
  createError: string | null = null;

  // Delete modal state
  showDeleteModal = false;
  isDeleteLoading = false;
  deleteEntityName = '';
  entityToDelete: Entity | null = null;

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
    console.log('🚀 Opening create entity modal for type:', type);
    // Close any other modals first
    this.closeAllModals();
    this.createError = null;
    this.showCreateModal = true;
    console.log('🚀 showCreateModal set to:', this.showCreateModal);
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
    console.log('✏️ Editing entity:', entity);
    // Close any other modals first
    this.closeAllModals();
    this.isEditMode = true;
    this.formEntityData = {
      id: entity.id,
      version: entity.version,
      entityState: entity.entityState,
      code: entity.code,
      legalCode: entity.legalCode,
      entityId: entity.entityId,
      entityName: entity.entityName,
      district: entity.district
    };
    this.formError = null;
    this.showFormModal = true;
  }

  deleteEntity(entity: Entity) {
    console.log('🗑️ Requesting to delete entity:', entity);
    // Close any other modals first
    this.closeAllModals();
    this.entityToDelete = entity;
    this.deleteEntityName = entity.entityName;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.entityToDelete) return;
    
    this.isDeleteLoading = true;
    this.entityService.deleteEntity(this.entityToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Entity deleted successfully');
          this.cancelDelete();
          this.loadEntities(); // Reload the list
        },
        error: (error) => {
          console.error('❌ Error deleting entity:', error);
          this.isDeleteLoading = false;
        }
      });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.isDeleteLoading = false;
    this.deleteEntityName = '';
    this.entityToDelete = null;
  }

  viewEntity(entity: Entity) {
    console.log('🔍 Viewing entity:', entity);
    // Close any other modals first
    this.closeAllModals();
    this.selectedEntity = entity;
    this.showEntityModal = true;
  }

  closeEntityModal() {
    this.showEntityModal = false;
    this.selectedEntity = null;
  }

  // Close all modals to prevent conflicts
  closeAllModals() {
    this.showEntityModal = false;
    this.showFormModal = false;
    this.showCreateModal = false;
    this.selectedEntity = null;
    this.formEntityData = null;
    this.formError = null;
    this.createError = null;
    this.isFormLoading = false;
    this.isCreateLoading = false;
  }

  // Form modal methods
  closeFormModal() {
    this.showFormModal = false;
    this.formEntityData = null;
    this.formError = null;
    this.isFormLoading = false;
  }

  onContractCreated(contractData: any) {
    console.log('📄 Contract created for entity:', contractData);
    // You can add additional logic here, such as showing a success message
    // or updating the UI to reflect the new contract
  }

  saveEntity(formData: EntityFormData) {
    this.isFormLoading = true;
    this.formError = null;

    const entityOperation = this.isEditMode 
      ? this.entityService.updateEntity(formData.id!, formData)
      : this.entityService.createEntity(formData);

    entityOperation
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isFormLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Entity saved successfully:', response);
          this.closeFormModal();
          this.loadEntities(); // Reload the list
        },
        error: (error) => {
          console.error('❌ Error saving entity:', error);
          this.formError = error.error?.message || 'Failed to save entity. Please try again.';
        }
      });
  }

  // Create modal methods
  closeCreateModal() {
    this.showCreateModal = false;
    this.createError = null;
    this.isCreateLoading = false;
  }

  createEntity(formData: CreateEntityData) {
    this.isCreateLoading = true;
    this.createError = null;

    this.entityService.createEntity(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isCreateLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Entity created successfully:', response);
          this.closeCreateModal();
          this.loadEntities(); // Reload the list
        },
        error: (error) => {
          console.error('❌ Error creating entity:', error);
          this.createError = error.error?.message || 'Failed to create entity. Please try again.';
        }
      });
  }
}
