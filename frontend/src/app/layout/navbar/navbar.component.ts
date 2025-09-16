import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.sidebar-collapsed]="isSidebarCollapsed">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onToggleSidebar()">
          <i class="fas fa-bars"></i>
        </button>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search...">
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-item">
          <button class="icon-button">
            <i class="far fa-bell"></i>
            <span class="badge">3</span>
          </button>
        </div>

        <div class="nav-item">
          <button class="icon-button">
            <i class="far fa-envelope"></i>
            <span class="badge">5</span>
          </button>
        </div>

        <div class="nav-item user-profile" (click)="toggleUserMenu()">
          <img [src]="'assets/img/user.png'" alt="User" class="avatar">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <i class="fas fa-chevron-down"></i>

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
                <i class="fas fa-user"></i>
                <span>My Profile</span>
              </a>
              <a href="javascript:void(0)" class="menu-item">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
              </a>
              <div class="divider"></div>
              <a href="javascript:void(0)" class="menu-item" (click)="logout()">
                <i class="fas fa-sign-out-alt"></i>
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

  constructor(private authService: AuthService) {
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

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}