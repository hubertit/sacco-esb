import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@sacco.rw',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    avatar: '/assets/img/user.png'
  },
  {
    id: 2,
    email: 'user@sacco.rw',
    password: 'user123',
    name: 'Regular User',
    role: 'USER',
    avatar: '/assets/img/user.png'
  },
  {
    id: 3,
    email: 'manager@sacco.rw',
    password: 'manager123',
    name: 'Manager User',
    role: 'MANAGER',
    avatar: '/assets/img/user.png'
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('sacco.user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call delay
    return new Observable(observer => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Remove password from user object
          const { password: _, ...safeUser } = user;
          
          // Store user info
          this.currentUser = safeUser;
          localStorage.setItem('sacco.user', JSON.stringify(safeUser));
          localStorage.setItem('sacco.token', 'mock-jwt-token-' + Date.now());
          
          observer.next(safeUser);
          observer.complete();
        } else {
          observer.error('Invalid email or password');
        }
      }, 1000); // 1 second delay to simulate network request
    });
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('sacco.user');
    localStorage.removeItem('sacco.token');
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem('sacco.token');
  }

  getUserRole(): string {
    return this.currentUser?.role || '';
  }

  validatePassword(password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.id === this.currentUser?.id && u.password === password);
        observer.next(!!user);
        observer.complete();
      }, 500);
    });
  }
}