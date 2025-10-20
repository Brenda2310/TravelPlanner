import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { Login } from './security/login/login/login';

export const routes: Routes = [

  { path: '', component: Home, title: 'Inicio'},
  { path: 'login', component: Login, title:'Iniciar Sesión'},
  { path: '**', component: NotFound, title:'Not Found'}
];
