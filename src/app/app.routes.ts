import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { NotFound } from './shared/not-found/not-found';
import { HomeComponent } from './pages/home-component/home-component';

export const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: '**', component: NotFound }
];
