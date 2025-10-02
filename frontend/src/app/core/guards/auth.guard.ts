import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('🔒 AuthGuard - Checking authentication status');
    
    if (this.authService.isLoggedIn()) {
      console.log('🔒 AuthGuard - User is authenticated, allowing access');
      return true;
    }

    console.log('🔒 AuthGuard - User is not authenticated, redirecting to login');
    // Clear any stale authentication data
    this.authService.logout();
    return false;
  }
}
