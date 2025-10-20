import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { Login } from './security/auth/login/login';

export const routes: Routes = [

  { path: '', component: Home, title: 'Inicio'},
  { path: 'login', component: Login, title:'Iniciar Sesión'},
  { path: '**', component: NotFound, title:'Not Found'}
];
