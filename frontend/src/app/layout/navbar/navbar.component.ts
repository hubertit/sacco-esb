import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <nav class="navbar" [class.sidebar-collapsed]="isSidebarCollapsed">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onToggleSidebar()">
          <app-lucide-icon name="menu" size="18px"></app-lucide-icon>
        </button>
        <div class="datetime-display">
          <div class="time">{{ currentTime }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
      </div>

      <div class="navbar-right">
        <div class="nav-item">
          <button class="icon-button">
            <app-lucide-icon name="bell" size="18px"></app-lucide-icon>
            <span class="badge">3</span>
          </button>
        </div>

        <div class="nav-item">
          <button class="icon-button">
            <app-lucide-icon name="mail" size="18px"></app-lucide-icon>
            <span class="badge">5</span>
          </button>
        </div>

        <div class="nav-item user-profile" (click)="toggleUserMenu()">
          <img [src]="'assets/img/user.png'" alt="User" class="avatar">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <app-lucide-icon name="chevron-down" size="16px"></app-lucide-icon>

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
                <app-lucide-icon name="user" size="16px"></app-lucide-icon>
                <span>My Profile</span>
              </a>
              <a href="javascript:void(0)" class="menu-item">
                <app-lucide-icon name="settings" size="16px"></app-lucide-icon>
                <span>Settings</span>
              </a>
              <div class="divider"></div>
              <a href="javascript:void(0)" class="menu-item" (click)="lockScreen()">
                <app-lucide-icon name="lock" size="16px"></app-lucide-icon>
                <span>Lock Screen</span>
              </a>
              <a href="javascript:void(0)" class="menu-item" (click)="logout()">
                <app-lucide-icon name="log-out" size="16px"></app-lucide-icon>
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
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isSidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string;
  userRole: string;
  showUserMenu = false;
  currentTime: string = '';
  currentDate: string = '';
  private timeInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'User';
    this.userRole = user?.role || 'Guest';
  }

  ngOnInit() {
    this.updateDateTime();
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateDateTime() {
    const now = new Date();
    
    // Format time (HH:MM:SS)
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Format date (Day, Month DD, YYYY)
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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