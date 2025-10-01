import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <div class="permissions-container">
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <app-lucide-icon name="shield-check" size="24px" class="header-icon"></app-lucide-icon>
            <h1>Permissions Management</h1>
          </div>
          <p class="header-subtitle">Manage user permissions and access controls</p>
        </div>
      </div>

      <!-- Coming Soon Section -->
      <div class="coming-soon-container">
        <div class="coming-soon-card">
          <div class="coming-soon-icon">
            <app-lucide-icon name="clock" size="64px"></app-lucide-icon>
          </div>
          <h2 class="coming-soon-title">Coming Soon</h2>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permissions-container {
      padding: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      .header-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;

        h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .header-icon {
          color: #1b2e4b;
        }
      }

      .header-subtitle {
        color: #6b7280;
        font-size: 1rem;
        margin: 0;
      }
    }

    .coming-soon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .coming-soon-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .coming-soon-icon {
      margin-bottom: 1.5rem;
      color: #1b2e4b;
    }

    .coming-soon-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    @media (max-width: 768px) {
      .permissions-container {
        padding: 1rem;
      }

      .coming-soon-card {
        padding: 2rem;
      }

      .coming-soon-title {
        font-size: 2rem;
      }
    }
  `]
})
export class PermissionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
