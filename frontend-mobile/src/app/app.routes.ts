import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login.component';
import { RegisterComponent } from './features/auth/components/register.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';
import { ProfileComponent } from './features/profile/components/profile.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
