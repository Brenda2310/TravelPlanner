import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { Login } from './security/auth/login/login';
import { UserRegister } from './users/userRegister/user-register/user-register';

export const routes: Routes = [

  { path: '', component: Home, title: 'Inicio'},
  { path: 'login', component: Login, title:'Iniciar Sesión'},
  { path: 'register', component: UserRegister, title:'Registrarse'},
  { path: '**', component: NotFound, title:'Not Found'}
];
