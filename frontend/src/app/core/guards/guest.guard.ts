import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // If user is already authenticated, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    // Allow access to login page for unauthenticated users
    return true;
  }
}
