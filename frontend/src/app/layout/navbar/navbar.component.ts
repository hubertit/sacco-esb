import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, NotificationItem } from '../../core/services/notification.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { NotificationViewModalComponent } from '../../shared/components/notification-view-modal/notification-view-modal.component';
import { NameUtil } from '../../core/utils/name.util';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent, NotificationViewModalComponent],
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
        <!-- Notifications -->
        <div class="nav-item notification-dropdown" (click)="toggleNotifications()">
          <button class="icon-button">
            <app-lucide-icon name="bell" size="18px"></app-lucide-icon>
            <span class="badge notification-badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
          </button>
          
          <!-- Notification Dropdown -->
          <div class="notification-menu" *ngIf="showNotifications">
            <div class="notification-header">
              <h6>Failed Transactions</h6>
              <span class="notification-count">{{ notificationCount }} issues</span>
            </div>
            <div class="notification-list">
              <div *ngIf="notifications.length === 0" class="no-notifications">
                <app-lucide-icon name="check-circle" size="24px" class="text-success"></app-lucide-icon>
                <p>No failed transactions</p>
              </div>
              <div *ngFor="let notification of notifications" 
                   class="notification-item" 
                   [class]="'severity-' + notification.severity"
                   (click)="viewNotification(notification)">
                <div class="notification-icon">
                  <app-lucide-icon 
                    [name]="notification.type === 'transaction' ? 'credit-card' : 'activity'" 
                    size="16px">
                  </app-lucide-icon>
                </div>
                <div class="notification-content">
                  <div class="notification-message">{{ notification.message }}</div>
                  <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
                </div>
                <div class="notification-status">
                  <span class="status-badge" [class]="getStatusClass(notification.status)">
                    {{ notification.status }}
                  </span>
                </div>
              </div>
            </div>
            <div class="notification-footer" *ngIf="notifications.length > 0">
              <a href="/logs" class="view-all-link">View All Logs</a>
            </div>
          </div>
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

    <!-- Notification View Modal -->
    <app-notification-view-modal
      [isVisible]="showNotificationModal"
      [notification]="selectedNotification"
      [isLoading]="false"
      [hasError]="false"
      (close)="closeNotificationModal()"
      (viewRelatedLogs)="navigateToRelatedLogs($event)">
    </app-notification-view-modal>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isSidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  userName: string;
  userRole: string;
  showUserMenu = false;
  showNotifications = false;
  currentTime: string = '';
  currentDate: string = '';
  private timeInterval: any;

  // Notification properties
  notifications: NotificationItem[] = [];
  notificationCount = 0;
  showNotificationModal = false;
  selectedNotification: NotificationItem | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    const user = this.authService.getCurrentUser();
    // Convert username to proper name format
    this.userName = user?.name ? NameUtil.convertUsernameToName(user.name) : 'User';
    this.userRole = user?.role || 'Guest';
  }

  ngOnInit() {
    this.updateDateTime();
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
    
    // Load notifications
    this.loadNotifications();
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

  // Notification methods
  loadNotifications(): void {
    console.log('🔔 Navbar: Loading notifications...');
    this.notificationService.getFailedNotifications().subscribe({
      next: (data) => {
        console.log('🔔 Navbar: Received notifications:', data);
        this.notifications = data.notifications;
        this.notificationCount = data.count;
        console.log('🔔 Navbar: Set notificationCount to:', this.notificationCount);
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false; // Close user menu if open
  }

  viewNotification(notification: NotificationItem): void {
    this.showNotifications = false;
    
    // Open the notification modal
    this.selectedNotification = notification;
    this.showNotificationModal = true;
  }

  closeNotificationModal(): void {
    this.showNotificationModal = false;
    this.selectedNotification = null;
  }

  navigateToRelatedLogs(notification: NotificationItem): void {
    console.log('Navigating to related logs for notification:', notification);
    this.closeNotificationModal();
    
    // Navigate based on notification type
    if (notification.type === 'transaction') {
      // Navigate to transaction logs
      this.router.navigate(['/logs/transaction/internal']);
    } else if (notification.type === 'integration') {
      // Navigate to integration logs for the specific partner
      this.router.navigate(['/logs/integration']);
    }
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'FAILURE':
      case 'FAILED':
        return 'status-danger';
      case 'TIMEOUT':
        return 'status-warning';
      case 'PENDING':
        return 'status-info';
      default:
        return 'status-secondary';
    }
  }
}