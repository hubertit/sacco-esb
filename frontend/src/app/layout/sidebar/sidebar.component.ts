import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavigationService, MenuItem } from '../../core/services/navigation.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { InactivityService } from '../../core/services/inactivity.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo-container">
          <app-lucide-icon name="activity" size="32px" class="logo-icon"></app-lucide-icon>
          <span class="logo-text" *ngIf="!isCollapsed">SACCO ESB</span>
        </div>
      </div>

      <div class="user-info" *ngIf="!isCollapsed">
        <div class="user-avatar">
          <img [src]="userAvatar" [alt]="userName">
        </div>
        <div class="user-details text-center">
          <h5 class="user-name">{{ userName }}</h5>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>

      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <ng-container *ngFor="let item of menuItems">
            <!-- Menu Item with Children -->
            <div class="nav-item" *ngIf="item.children" [class.active]="isMenuActive(item)">
              <a class="nav-link" (click)="toggleSubmenu(item)">
                <app-lucide-icon [name]="item.icon" size="18px" *ngIf="item.icon"></app-lucide-icon>
                <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
                <app-lucide-icon name="chevron-right" size="14px" *ngIf="!isCollapsed"
                   [class.rotated]="item.expanded"></app-lucide-icon>
              </a>
              <div class="submenu" *ngIf="item.expanded && !isCollapsed">
                <a *ngFor="let child of item.children"
                   [routerLink]="child.path"
                   routerLinkActive="active"
                   class="submenu-item">
                  {{ child.title }}
                </a>
              </div>
            </div>

            <!-- Single Menu Item -->
            <div class="nav-item" *ngIf="!item.children">
              <a class="nav-link" [routerLink]="[item.path]" routerLinkActive="active">
                <app-lucide-icon [name]="item.icon" size="18px" *ngIf="item.icon"></app-lucide-icon>
                <span class="nav-text" *ngIf="!isCollapsed">{{ item.title }}</span>
              </a>
            </div>
          </ng-container>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="footer-item" (click)="lockScreen()">
          <app-lucide-icon name="lock" size="18px"></app-lucide-icon>
          <span *ngIf="!isCollapsed">Lock Screen</span>
        </div>
        <div class="footer-item" (click)="onToggleCollapse()">
          <app-lucide-icon [name]="isCollapsed ? 'chevron-right' : 'chevron-left'" size="18px"></app-lucide-icon>
          <span *ngIf="!isCollapsed">Collapse Menu</span>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  menuItems: MenuItem[];
  userName: string = '';
  userRole: string = '';
  userAvatar: string = '/assets/img/user.png';

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private inactivityService: InactivityService,
    private authService: AuthService
  ) {
    this.menuItems = this.navigationService.getMenuItems();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userRole = user.role;
      if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
    // Close other submenus
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.expanded = false;
      }
    });
  }

  isMenuActive(item: MenuItem): boolean {
    if (!item.children) {
      return false;
    }
    return item.children.some(child =>
      window.location.pathname.startsWith(child.path || '')
    );
  }

  lockScreen(): void {
    this.router.navigate(['/lock']);
  }
}
