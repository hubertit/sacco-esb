import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService, MenuItem } from '../../core/services/navigation.service';
import { LucideIconComponent } from '../../shared/components/lucide-icon/lucide-icon.component';
import { InactivityService } from '../../core/services/inactivity.service';
import { AuthService } from '../../core/services/auth.service';
import { NameUtil } from '../../core/utils/name.util';

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
                <ng-container *ngFor="let child of item.children">
                  <!-- Submenu item with its own children (nested submenu) -->
                  <div *ngIf="child.children" class="nested-submenu">
                    <a class="submenu-item parent level-1"
                       [class.expanded]="child.expanded"
                       (click)="toggleSubmenu(child)">
                      {{ child.title }}
                    </a>
                    <div class="nested-submenu-items" *ngIf="child.expanded">
                      <a *ngFor="let grandchild of child.children"
                         [routerLink]="grandchild.path"
                         [class.active]="isSubmenuItemActive(grandchild)"
                         class="submenu-item nested level-2"
                         (click)="onSubmenuClick(grandchild)">
                        {{ grandchild.title }}
                      </a>
                    </div>
                  </div>
                  
                  <!-- Simple submenu item without children -->
                  <a *ngIf="!child.children"
                     [routerLink]="child.path"
                     [class.active]="isSubmenuItemActive(child)"
                     class="submenu-item"
                     (click)="onSubmenuClick(child)">
                    {{ child.title }}
                  </a>
                </ng-container>
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
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  menuItems: MenuItem[] = [];
  userName: string = '';
  userRole: string = '';
  userAvatar: string = '/assets/img/user.png';
  private menuSubscription: Subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private inactivityService: InactivityService,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      // Convert username to proper name format
      this.userName = NameUtil.convertUsernameToName(user.name);
      this.userRole = user.role;
      if (user.avatar) {
        this.userAvatar = user.avatar;
      }
    }
  }

  ngOnInit(): void {
    // Subscribe to menu items changes
    this.menuSubscription = this.navigationService.menuItems$.subscribe(menuItems => {
      console.log('🎯 Sidebar: Received updated menu items:', menuItems);
      this.menuItems = menuItems;
      
      // Debug submenu paths
      menuItems.forEach(item => {
        if (item.children) {
          console.log('🔍 Submenu for', item.title, ':', item.children);
          item.children.forEach(child => {
            console.log('  - Child:', child.title, 'Path:', child.path);
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
  }

  /**
   * Check if a submenu item should be active based on current URL
   */
  isSubmenuItemActive(child: MenuItem): boolean {
    const currentUrl = this.router.url;
    
    // Check if current URL matches the child path exactly
    if (child.path && currentUrl.includes(child.path)) {
      return true;
    }
    
    // For partner-specific paths, check if we're on the integration logs page with the specific partner
    if (child.partnerCode && currentUrl.includes('/logs/integration/') && currentUrl.includes(child.partnerCode)) {
      return true;
    }
    
    return false;
  }

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  onSubmenuClick(child: MenuItem): void {
    console.log('🎯 Submenu clicked:', child);
    console.log('🔗 Path:', child.path);
    if (child.path) {
      console.log('🚀 Navigating to:', child.path);
    }
  }

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
    // Don't close other submenus - let users keep multiple submenus open
    console.log('🎯 Toggling submenu:', item.title, 'expanded:', item.expanded);
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
