import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { NotFound } from './shared/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NotFound }
];
