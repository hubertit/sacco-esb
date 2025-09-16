import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FeatherIconComponent } from '../../shared/components/feather-icon/feather-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FeatherIconComponent],
  template: `
    <nav class="navbar" [class.sidebar-collapsed]="isSidebarCollapsed">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onToggleSidebar()">
          <app-feather-icon name="menu" size="18px"></app-feather-icon>
        </button>
        <div class="search-box">
          <app-feather-icon name="search" size="18px"></app-feather-icon>
          <input type="text" placeholder="Search...">
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-item">
          <button class="icon-button">
            <app-feather-icon name="bell" size="18px"></app-feather-icon>
            <span class="badge">3</span>
          </button>
        </div>

        <div class="nav-item">
          <button class="icon-button">
            <app-feather-icon name="mail" size="18px"></app-feather-icon>
            <span class="badge">5</span>
          </button>
        </div>

        <div class="nav-item user-profile" (click)="toggleUserMenu()">
          <img [src]="'assets/img/user.png'" alt="User" class="avatar">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <app-feather-icon name="chevron-down" size="16px"></app-feather-icon>

          <!-- User Dropdown Menu -->
          <div class="user-menu" *ngIf="showUserMenu">
            <div class="menu-header">
              <img [src]="'assets/img/user.png'" alt="User" class="avatar">
              <div>
                <h6>{{ userName }}</h6>
                <span>{{ userRole }}</span>
              </div>
            </div>
            <div class="menu-items">
              <a href="javascript:void(0)" class="menu-item">
                <app-feather-icon name="user" size="16px"></app-feather-icon>
                <span>My Profile</span>
              </a>
              <a href="javascript:void(0)" class="menu-item">
                <app-feather-icon name="settings" size="16px"></app-feather-icon>
                <span>Settings</span>
              </a>
              <div class="divider"></div>
              <a href="javascript:void(0)" class="menu-item" (click)="lockScreen()">
                <app-feather-icon name="lock" size="16px"></app-feather-icon>
                <span>Lock Screen</span>
              </a>
              <a href="javascript:void(0)" class="menu-item" (click)="logout()">
                <app-feather-icon name="log-out" size="16px"></app-feather-icon>
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() isSidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string;
  userRole: string;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
    this.userRole = user?.role || 'Guest';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  lockScreen(): void {
    this.showUserMenu = false;
    this.router.navigate(['/lock']);
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}