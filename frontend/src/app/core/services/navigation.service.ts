import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'grid',
      path: 'dashboard'
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
      title: 'Logs',
      icon: 'file-text',
      path: 'logs'
    },
    {
      title: 'Audit',
      icon: 'activity',
      path: 'audit'
    },
    {
      title: 'CBSEPR Mapping',
      icon: 'git-merge',
      path: 'cbsepr-mapping'
    }
  ];

  constructor(private authService: AuthService) {}

  getMenuItems(): MenuItem[] {
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
}