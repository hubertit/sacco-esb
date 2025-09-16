import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InactivityService } from '../../../core/services/inactivity.service';
import { FeatherIconComponent } from '../../../shared/components/feather-icon/feather-icon.component';

@Component({
  selector: 'app-lock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FeatherIconComponent],
  template: `
    <div class="auth-page">
      <!-- Left side - Lock Form -->
      <div class="login-section">
        <div class="login-container">
          <div class="logo-section">
            <img src="assets/img/icon.png" alt="Logo" class="logo" />
            <h1>Welcome back to <span>SACCO ESB</span></h1>
          </div>
          <div class="user-info">
            <div class="user-avatar">
              <img [src]="userAvatar" [alt]="userName" />
            </div>
            <h5>{{ userName }}</h5>
            <p class="text-muted">Your session is locked</p>
          </div>
          <form (ngSubmit)="unlock()" #lockForm="ngForm" class="login-form">
            <div class="form-group">
              <div class="input-wrapper">
                <app-feather-icon name="lock" size="16px"></app-feather-icon>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  placeholder="Enter your password"
                  required
                  [class.is-invalid]="error"
                />
              </div>
              <div *ngIf="error" class="error-message">
                {{ error }}
              </div>
            </div>
            <button type="submit" class="login-btn" [disabled]="!password">
              <app-feather-icon name="unlock" size="16px"></app-feather-icon>
              Unlock
            </button>
            <div class="footer-text">
              <a routerLink="/login" class="switch-account">
                <app-feather-icon name="log-out" size="16px"></app-feather-icon>
                Sign in as a different user
              </a>
            </div>
          </form>
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
          <div class="date">{{ currentDate | date:'EEEE, MMMM d, y' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../styles/variables';

    :root {
      --second-rotation: 0deg;
      --minute-rotation: 0deg;
      --hour-rotation: 0deg;
    }

    .auth-page {
      display: flex;
      min-height: 100vh;
      width: 100%;
    }

    // Left side - Lock Form
    .login-section {
      width: 40%;
      min-width: 500px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .login-container {
      width: 100%;
      max-width: 400px;
      padding: 0 20px;

      .logo-section {
        text-align: center;
        margin-bottom: 2rem;

        .logo {
          width: 60px;
          height: 60px;
          margin-bottom: 1rem;
        }

        h1 {
          font-size: 1.5rem;
          font-weight: 500;
          color: #333;
          margin: 0;

          span {
            color: $primary;
            font-weight: 600;
          }
        }
      }

      .user-info {
        text-align: center;
        margin-bottom: 2rem;

        .user-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid $primary;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        h5 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.5rem;
        }

        .text-muted {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }

    .login-form {
      .form-group {
        margin-bottom: 1.5rem;
      }

      .input-wrapper {
        position: relative;
        
        app-feather-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        input {
          width: 100%;
          padding: 12px 15px 12px 40px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: all 0.3s ease;

          &::placeholder {
            color: #999;
          }

          &:focus {
            outline: none;
            border-color: $primary;
            box-shadow: 0 0 2px rgba($primary, 0.1);
          }

          &.is-invalid {
            border-color: $danger;
            
            &:focus {
              box-shadow: 0 0 2px rgba($danger, 0.1);
            }
          }
        }

      }

      .error-message {
        color: $danger;
        font-size: 0.85rem;
        margin-top: 0.5rem;
      }
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: $primary;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      &:hover:not(:disabled) {
        background: darken($primary, 5%);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      app-feather-icon {
        color: white;
      }
    }

    .footer-text {
      margin-top: 2rem;
      text-align: center;

      .switch-account {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s ease;

        &:hover {
          color: $primary;
        }

        app-feather-icon {
          color: currentColor;
        }
      }
    }

    // Right side - Background with Clock
    .background-section {
      flex: 1;
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
                  url('/assets/img/auth-cover.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .analog-clock {
      text-align: center;
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;

      .clock-face {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        position: relative;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
        }

        .numbers {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;

          span {
            position: absolute;
            width: 30px;
            height: 30px;
            text-align: center;
            font-size: 1.2rem;
            font-weight: 500;
            color: white;

            // 12 o'clock
            &:nth-child(1) { top: 10px; left: calc(50% - 15px); }
            // 1 o'clock
            &:nth-child(2) { top: 10%; right: 25%; }
            // 2 o'clock
            &:nth-child(3) { top: 25%; right: 10%; }
            // 3 o'clock
            &:nth-child(4) { top: calc(50% - 15px); right: 10px; }
            // 4 o'clock
            &:nth-child(5) { bottom: 25%; right: 10%; }
            // 5 o'clock
            &:nth-child(6) { bottom: 10%; right: 25%; }
            // 6 o'clock
            &:nth-child(7) { bottom: 10px; left: calc(50% - 15px); }
            // 7 o'clock
            &:nth-child(8) { bottom: 10%; left: 25%; }
            // 8 o'clock
            &:nth-child(9) { bottom: 25%; left: 10%; }
            // 9 o'clock
            &:nth-child(10) { top: calc(50% - 15px); left: 10px; }
            // 10 o'clock
            &:nth-child(11) { top: 25%; left: 10%; }
            // 11 o'clock
            &:nth-child(12) { top: 10%; left: 25%; }
          }
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          border-radius: 4px;
          pointer-events: none;
          z-index: 2;

          &.hour-hand {
            width: 4px;
            height: 70px;
            background: white;
            transform: translateX(-50%) rotate(var(--hour-rotation));
          }

          &.minute-hand {
            width: 3px;
            height: 90px;
            background: white;
            transform: translateX(-50%) rotate(var(--minute-rotation));
          }

          &.second-hand {
            width: 2px;
            height: 100px;
            background: #ff6b6b;
            transform: translateX(-50%) rotate(var(--second-rotation));
          }
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          transform: translate(-50%, -50%);
          z-index: 3;

          &::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ff6b6b;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      .date {
        font-size: 1.1rem;
        font-weight: 400;
        opacity: 0.9;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin-top: 1rem;
      }
    }

    // Responsive Design
    @media (max-width: 992px) {
      .login-section {
        width: 100%;
        min-width: auto;
      }

      .background-section {
        display: none;
      }
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2rem;

      .logo {
        width: 60px;
        height: 60px;
        margin-bottom: 1rem;
      }

      h4 {
        color: #1b2e4b;
        margin: 0;
        font-weight: 600;
      }
    }

    .user-info {
      text-align: center;
      margin-bottom: 2rem;

      .user-avatar {
        width: 80px;
        height: 80px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #fff;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      h5 {
        color: #1b2e4b;
        margin: 0;
        font-weight: 600;
      }

      .text-muted {
        color: #64748b;
        margin: 0.5rem 0 0;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #1b2e4b;
        margin-bottom: 0.5rem;
        font-weight: 500;

        app-feather-icon {
          color: #64748b;
        }
      }
    }

    .input-group {
      position: relative;
      display: flex;

      .form-control {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem 0 0 0.5rem;
        font-size: 0.875rem;
        color: #1b2e4b;
        background: #fff;

        &:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
        }
      }

      .btn-outline-secondary {
        border: 1px solid #e5e7eb;
        border-left: none;
        border-radius: 0 0.5rem 0.5rem 0;
        padding: 0.75rem;
        background: #fff;

        &:hover {
          background: #f8fafc;
        }

        app-feather-icon {
          color: #64748b;
        }
      }
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #1b2e4b;
      border: none;
      border-radius: 0.5rem;
      color: #fff;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        background: #3498db;
      }

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      app-feather-icon {
        color: #fff;
      }
    }

    .text-center {
      text-align: center;
    }

    .mt-3 {
      margin-top: 1rem;
    }

    .w-100 {
      width: 100%;
    }

    a.text-muted {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      text-decoration: none;
      font-size: 0.875rem;

      &:hover {
        color: #1b2e4b;
      }

      app-feather-icon {
        color: currentColor;
      }
    }
  `]
})
export class LockComponent implements OnInit, OnDestroy {
  private clockInterval: any;
  userName: string = '';
  userAvatar: string = '/assets/img/user.png';
  password: string = '';
  error: string = '';
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }
    this.startClock();
  }

  private startClock() {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      // Calculate rotations
      const secondRotation = (seconds * 6) + 'deg'; // 360° / 60 = 6°
      const minuteRotation = ((minutes * 6) + (seconds * 0.1)) + 'deg'; // 360° / 60 = 6°
      const hourRotation = ((hours * 30) + (minutes * 0.5)) + 'deg'; // 360° / 12 = 30°

      // Update CSS variables
      document.documentElement.style.setProperty('--second-rotation', secondRotation);
      document.documentElement.style.setProperty('--minute-rotation', minuteRotation);
      document.documentElement.style.setProperty('--hour-rotation', hourRotation);

      // Update date
      this.currentDate = now;
    };

    // Update immediately
    updateClock();

    // Update every second
    this.clockInterval = setInterval(updateClock, 1000);
  }

  ngOnDestroy() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }


  unlock() {
    if (!this.password) return;

    this.authService.validatePassword(this.password).subscribe({
      next: (valid) => {
        if (valid) {
          this.error = '';
          this.inactivityService.unlock();
        } else {
          this.error = 'Invalid password';
          this.password = '';
        }
      },
      error: (err) => {
        this.error = 'An error occurred. Please try again.';
        console.error('Unlock error:', err);
      }
    });
  }
}
