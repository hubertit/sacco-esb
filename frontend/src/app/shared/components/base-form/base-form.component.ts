import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="base-form">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">{{ title }}</h5>
          <ng-content select="[header-actions]"></ng-content>
        </div>
        
        <div class="card-body">
          <ng-content></ng-content>
        </div>

        <div class="card-footer bg-white d-flex justify-content-end gap-2">
          <button 
            *ngIf="showCancel" 
            type="button" 
            class="btn btn-light" 
            (click)="onCancel.emit()">
            {{ cancelText }}
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="form.invalid || isSubmitting">
            <span 
              *ngIf="isSubmitting" 
              class="spinner-border spinner-border-sm me-2" 
              role="status">
            </span>
            {{ submitText }}
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .base-form {
      width: 100%;
    }

    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class BaseFormComponent {
  @Input() form!: FormGroup;
  @Input() title = 'Form';
  @Input() submitText = 'Submit';
  @Input() cancelText = 'Cancel';
  @Input() showCancel = true;
  @Input() isSubmitting = false;

  @Output() onCancel = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();

  submit(): void {
    if (this.form.valid) {
      this.onSubmit.emit();
    }
  }
}
