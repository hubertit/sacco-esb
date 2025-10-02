import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../lucide-icon/lucide-icon.component';

export interface ContractData {
  username: string;
  password: string;
  entityName?: string;
}

@Component({
  selector: 'app-contract-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent],
  template: `
    <!-- Modal -->
    <div class="modal fade" [class.show]="isVisible" [style.display]="isVisible ? 'block' : 'none'" 
         tabindex="-1" role="dialog" [attr.aria-hidden]="!isVisible">
      <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <app-lucide-icon name="file-plus" size="20px" class="text-primary"></app-lucide-icon>
              <span>Add Contract</span>
            </h5>
            <button type="button" class="btn-close-custom" (click)="onClose()" aria-label="Close">
              <app-lucide-icon name="x" size="18px"></app-lucide-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <form #contractForm="ngForm" (ngSubmit)="onSubmit()" novalidate>
              <!-- Entity Name (Read-only) -->
              <div class="mb-3" *ngIf="entityName">
                <label for="entityName" class="form-label">
                  <app-lucide-icon name="building" size="16px" class="me-1"></app-lucide-icon>
                  Entity
                </label>
                <input 
                  type="text" 
                  id="entityName" 
                  name="entityName"
                  class="form-control" 
                  [value]="entityName"
                  readonly
                  placeholder="Entity name">
              </div>

              <!-- Username -->
              <div class="mb-3">
                <label for="username" class="form-label required">
                  <app-lucide-icon name="user" size="16px" class="me-1"></app-lucide-icon>
                  Username
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  class="form-control" 
                  [(ngModel)]="formData.username"
                  #usernameInput="ngModel"
                  required
                  minlength="3"
                  maxlength="50"
                  placeholder="Enter username"
                  [class.is-invalid]="usernameInput.invalid && usernameInput.touched">
                <div *ngIf="usernameInput.invalid && usernameInput.touched" class="invalid-feedback">
                  <div *ngIf="usernameInput.errors?.['required']">Username is required</div>
                  <div *ngIf="usernameInput.errors?.['minlength']">Username must be at least 3 characters</div>
                  <div *ngIf="usernameInput.errors?.['maxlength']">Username must not exceed 50 characters</div>
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label required">
                  <app-lucide-icon name="lock" size="16px" class="me-1"></app-lucide-icon>
                  Auto-Generated Password
                </label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="password" 
                    name="password"
                    class="form-control" 
                    [(ngModel)]="formData.password"
                    #passwordInput="ngModel"
                    readonly
                    placeholder="Auto-generated password">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary" 
                    (click)="copyPassword()"
                    [disabled]="!formData.password"
                    title="Copy password to clipboard">
                    <app-lucide-icon name="copy" size="16px"></app-lucide-icon>
                  </button>
                </div>
                <div class="form-text">
                  <app-lucide-icon name="info" size="14px" class="me-1"></app-lucide-icon>
                  Password is auto-generated. Please copy it before submitting.
                </div>
              </div>

              <!-- Copy Confirmation -->
              <div class="mb-3" *ngIf="formData.password">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="passwordCopied" 
                    name="passwordCopied"
                    [(ngModel)]="passwordCopied"
                    #passwordCopiedInput="ngModel">
                  <label class="form-check-label" for="passwordCopied">
                    <app-lucide-icon name="check-circle" size="16px" class="me-1"></app-lucide-icon>
                    I have copied the password and saved it securely
                  </label>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-primary w-100" 
              (click)="onSubmit()"
              [disabled]="isLoading || !contractForm.form.valid || !passwordCopied">
              <app-lucide-icon *ngIf="!isLoading" name="save" size="16px" class="me-1"></app-lucide-icon>
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              {{ isLoading ? 'Creating...' : 'Create Contract' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade" [class.show]="isVisible" *ngIf="isVisible"></div>
  `,
  styles: [`
    .modal {
      z-index: 1060;
    }

    .modal-backdrop {
      z-index: 1055;
    }

    .modal-content {
      border: none;
      border-radius: 0.75rem;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    }

    .modal-header {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .btn-close-custom {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      color: #6c757d;
      padding: 0;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-close-custom:hover {
      color: #fff;
      background-color: #dc3545;
      border-color: #dc3545;
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
    }

    .btn-close-custom:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-footer {
      border-top: 1px solid #e2e8f0;
      padding: 1rem 1.5rem;
      background-color: #f8fafc;
      border-radius: 0 0 0.75rem 0.75rem;
      display: flex;
      justify-content: center;
    }

    .form-label {
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }

    .form-label.required::after {
      content: ' *';
      color: #ef4444;
    }

    .form-control {
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.is-invalid {
      border-color: #ef4444;
    }

    .form-control.is-invalid:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .input-group {
      display: flex;
      align-items: stretch;
    }

    .input-group .form-control {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .input-group .btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
    }

    .form-check {
      display: flex;
      align-items: center;
      margin-bottom: 0;
    }

    .form-check-input {
      margin-right: 0.5rem;
      margin-top: 0;
    }

    .form-check-label {
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .invalid-feedback {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 0.25rem;
    }

    .btn {
      border-radius: 8px;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .btn-primary {
      background-color: #1b2e4b;
      border-color: #1b2e4b;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #3498db;
      border-color: #3498db;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-outline-secondary {
      color: #6b7280;
      border-color: #d1d5db;
    }

    .btn-outline-secondary:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
      color: #374151;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .modal-dialog {
        margin: 1rem;
      }
      
      .modal-body {
        padding: 1rem;
      }
      
      .modal-footer {
        padding: 0.75rem 1rem;
      }
    }
  `]
})
export class ContractModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() entityName: string = '';

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ContractData>();

  formData: ContractData = {
    username: '',
    password: ''
  };

  passwordCopied = false;

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
      // Modal is now visible, generate password and reset form
      this.resetForm();
      this.generatePassword();
    }
  }

  private resetForm() {
    this.formData = {
      username: '',
      password: ''
    };
    this.passwordCopied = false;
  }

  private generatePassword() {
    // Generate a secure random password
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    this.formData.password = password;
  }

  async copyPassword() {
    try {
      await navigator.clipboard.writeText(this.formData.password);
      // Show success feedback
      this.showCopySuccess();
    } catch (err) {
      console.error('Failed to copy password: ', err);
      // Fallback for older browsers
      this.fallbackCopyTextToClipboard(this.formData.password);
    }
  }

  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopySuccess();
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
    
    document.body.removeChild(textArea);
  }

  onSubmit() {
    if (this.isLoading || !this.passwordCopied) return;
    
    // Emit the form data
    this.save.emit(this.formData);
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  showCopySuccess(): void {
    // Create a temporary success indicator
    const successElement = document.createElement('div');
    successElement.className = 'copy-success-toast';
    successElement.textContent = '✓ Password copied to clipboard';
    successElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      z-index: 9999;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successElement);
    
    // Remove after 2 seconds
    setTimeout(() => {
      successElement.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (successElement.parentNode) {
          successElement.parentNode.removeChild(successElement);
        }
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      }, 300);
    }, 2000);
  }
}
