import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LucideIconComponent } from '../../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideIconComponent],
  template: `
    <div class="auth-page">
      <!-- Left side - Login Form -->
      <div class="login-section">
        <div class="login-container">
          <div class="logo-section">
            <app-lucide-icon name="activity" size="48px" class="logo-icon"></app-lucide-icon>
            <h1>Log In to <span>SACCO ESB</span></h1>
          </div>
          

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input 
                  type="text" 
                  formControlName="username" 
                  placeholder="Username"
                  [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                Username is required
              </div>
            </div>

            <div class="form-group">
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  formControlName="password" 
                  placeholder="Password"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <div class="alert alert-danger" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <button type="submit" class="login-btn" [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Signing you in...' : 'Log In' }}
            </button>
            
            <div class="mt-3" *ngIf="isLoading">
              <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                Please wait while we verify your credentials...
              </small>
            </div>
          </form>

          <div class="footer-text">
            <p>© {{ currentYear }} SACCO ESB</p>
            <p>A comprehensive loan assessment system</p>
            <p>Developed by MINECOFIN</p>
          </div>
        </div>
      </div>

      <!-- Right side - Background with Clock -->
      <div class="background-section">
        <div class="analog-clock">
          <div class="clock-face">
            <div class="numbers">
              <span>12</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
              <span>11</span>
            </div>
            <div class="hand hour-hand"></div>
            <div class="hand minute-hand"></div>
            <div class="hand second-hand"></div>
            <div class="center-dot"></div>
          </div>
          <div class="date">{{ currentTime | date:'EEEE, MMMM d, y' }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  currentTime = new Date();
  currentYear = new Date().getFullYear();
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Clear any cached authentication data
    this.clearAuthCache();
    
    // Update time every second
    setInterval(() => {
      this.currentTime = new Date();
      this.updateClockHands();
    }, 1000);
  }

  private clearAuthCache(): void {
    // Clear localStorage items that might be cached
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('cached_user_info');
    
    // Clear sessionStorage
    sessionStorage.clear();
  }

  private updateClockHands(): void {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Calculate rotation angles
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
    const hourDegrees = ((hours + minutes / 60) / 12) * 360;

    // Update hand rotations using CSS custom properties
    document.documentElement.style.setProperty('--second-rotation', `${secondDegrees}deg`);
    document.documentElement.style.setProperty('--minute-rotation', `${minuteDegrees}deg`);
    document.documentElement.style.setProperty('--hour-rotation', `${hourDegrees}deg`);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (user) => {
          this.isLoading = false;
          // Navigate to dashboard or home page
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          // Handle different error types
          if (error && typeof error === 'object') {
            if (error.message) {
              // Check for timeout errors
              if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                this.errorMessage = 'Request timed out. Please check your VPN connection and try again.';
              } else if (error.message.includes('Could not open JPA EntityManager')) {
                this.errorMessage = 'Database connection failed. Please ensure the backend server is properly configured.';
              } else {
                this.errorMessage = error.message;
              }
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Login failed, try again.';
            }
          } else if (typeof error === 'string') {
            this.errorMessage = error;
          } else {
            // Catch-all for any undefined or unexpected errors
            this.errorMessage = 'Login failed, try again.';
          }
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}