import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RecordsComponent } from './components/records/records.component';
import { AddRecordsComponent } from './components/add-records/add-records.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'records', component: RecordsComponent, canActivate: [authGuard] },
  { path: 'add-records', component: AddRecordsComponent, canActivate: [authGuard, roleGuard('add')] },
  { path: '**', redirectTo: '/login' }
];
