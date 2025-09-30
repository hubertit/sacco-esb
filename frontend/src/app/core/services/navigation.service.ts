import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { PartnerService } from './partner.service';
import { Partner } from '../models/partner.models';

export interface MenuItem {
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
  expanded?: boolean;
  partnerCode?: string; // For partner-specific submenu items
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  private menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'grid',
      path: 'dashboard'
    },
    {
      title: 'Logs',
      icon: 'file-text',
      children: [
        {
          title: 'Transaction Logs',
          icon: 'dollar-sign',
          children: [
            {
              title: 'Push',
              path: 'logs/transaction/push'
            },
            {
              title: 'Pull',
              path: 'logs/transaction/pull'
            },
            {
              title: 'Internal',
              path: 'logs/transaction/internal'
            }
          ]
        },
        {
          title: 'Integration Logs',
          icon: 'link',
          children: [] // Will be populated with partners dynamically
        }
      ]
    },
    {
      title: 'Entities',
      icon: 'database',
      path: 'entities'
    },
    {
      title: 'Users',
      icon: 'users',
      path: 'users'
    },
    {
      title: 'Roles',
      icon: 'shield',
      path: 'roles'
    },
    {
      title: 'Audit',
      icon: 'activity',
      path: 'audit'
    }
  ];

  constructor(
    private authService: AuthService,
    private partnerService: PartnerService
  ) {
    this.initializeMenu();
    this.loadPartnersForLogs();
  }

  private initializeMenu(): void {
    const filteredMenu = this.getFilteredMenuItems();
    this.menuItemsSubject.next(filteredMenu);
  }

  private loadPartnersForLogs(): void {
    console.log('🎯 NavigationService: Starting to load partners for integration logs submenu...');
    this.partnerService.getPartners().subscribe({
      next: (partners) => {
        console.log('🎯 NavigationService: Partners received:', partners);
        console.log('📊 Number of partners:', partners.length);
        
        // Find the Integration Logs submenu and update its children
        const logsMenuItem = this.menuItems.find(item => item.title === 'Logs');
        const integrationLogsMenuItem = logsMenuItem?.children?.find(child => child.title === 'Integration Logs');
        console.log('🔍 Integration Logs menu item found:', integrationLogsMenuItem);
        
        if (integrationLogsMenuItem) {
          integrationLogsMenuItem.children = partners.map(partner => ({
            title: partner.partnerName,
            path: `logs/integration/${partner.partnerCode}`,
            // Store partner code for active state detection
            partnerCode: partner.partnerCode
          }));
          
          console.log('📊 Updated Integration Logs submenu with partners:', integrationLogsMenuItem.children);
          
          // Update the reactive menu
          const filteredMenu = this.getFilteredMenuItems();
          console.log('🔄 Publishing updated menu to subscribers:', filteredMenu);
          this.menuItemsSubject.next(filteredMenu);
        } else {
          console.error('❌ Integration Logs menu item not found!');
        }
      },
      error: (error) => {
        console.error('❌ NavigationService: Error loading partners:', error);
      }
    });
  }

  private getFilteredMenuItems(): MenuItem[] {
    const userRole = this.authService.getUserRole();
    return this.menuItems.filter(item => {
      // If no roles specified, show to all
      if (!item.roles) return true;
      
      // Check if user role is in allowed roles
      return item.roles.includes(userRole);
    }).map(item => {
      // If item has children, filter them too
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (!child.roles) return true;
            return child.roles.includes(userRole);
          })
        };
      }
      return item;
    });
  }

  getMenuItems(): MenuItem[] {
    return this.getFilteredMenuItems();
  }
}