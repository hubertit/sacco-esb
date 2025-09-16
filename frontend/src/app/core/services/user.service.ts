import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-03-16T10:30:00',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-03-15T16:45:00',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      role: 'User',
      status: 'inactive',
      lastLogin: '2024-03-10T09:15:00',
      createdAt: '2024-02-01'
    }
  ];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    // TODO: Replace with actual API call
    return of(this.mockUsers).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    // TODO: Replace with actual API call
    const user = this.mockUsers.find(u => u.id === id);
    return of(user).pipe(delay(500));
  }

  createUser(user: Omit<User, 'id' | 'lastLogin' | 'createdAt'>): Observable<User> {
    // TODO: Replace with actual API call
    const newUser: User = {
      ...user,
      id: Math.max(...this.mockUsers.map(u => u.id)) + 1,
      lastLogin: '-',
      createdAt: new Date().toISOString()
    };
    this.mockUsers.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    // TODO: Replace with actual API call
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index] = { ...this.mockUsers[index], ...user };
      return of(this.mockUsers[index]).pipe(delay(500));
    }
    throw new Error('User not found');
  }

  deleteUser(id: number): Observable<void> {
    // TODO: Replace with actual API call
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      return of(undefined).pipe(delay(500));
    }
    throw new Error('User not found');
  }
}
