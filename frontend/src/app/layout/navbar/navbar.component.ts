import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a class="brand-logo" routerLink="/">
          <img src="assets/img/icon.png" alt="SACCO ESB">
          <span>SACCO ESB</span>
        </a>
        <button class="sidebar-toggle" (click)="toggleSidebar.emit()">
          <span></span>
        </button>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="user-menu" (click)="isUserMenuOpen = !isUserMenuOpen">
            <img src="assets/img/user.png" alt="User" class="user-avatar">
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRole }}</span>
            </div>
            <div class="user-dropdown" *ngIf="isUserMenuOpen">
              <a routerLink="/profile">Profile</a>
              <a (click)="logout()">Logout</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  userName = localStorage.getItem('sacco.name') || 'Guest';
  userRole = localStorage.getItem('sacco.role') || 'User';
  isUserMenuOpen = false;

  logout(): void {
    localStorage.removeItem('sacco.token');
    localStorage.removeItem('sacco.name');
    localStorage.removeItem('sacco.role');
    window.location.href = '/login';
  }
}
