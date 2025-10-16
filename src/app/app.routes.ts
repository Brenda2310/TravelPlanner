import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { NotFound } from './shared/not-found/not-found';
import { Home } from './pages/home/home';

export const routes: Routes = [

  { path: '', component: Home },
  { path: '**', component: NotFound }
];
