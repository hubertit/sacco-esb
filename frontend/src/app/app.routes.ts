import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EntitiesComponent } from './features/entities/entities.component';
import { UsersComponent } from './features/users/users.component';
import { RolesComponent } from './features/roles/roles.component';
import { LogsComponent } from './features/logs/logs.component';
import { AuditComponent } from './features/audit/audit.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'entities',
        component: EntitiesComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'logs',
        component: LogsComponent
      },
      {
        path: 'audit',
        component: AuditComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];