import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { Login } from './security/auth/login/login';
import { UserRegister } from './users/userRegister/user-register/user-register';
import { TripList } from './trips/TripList/trip-list/trip-list';
import { authGuard } from './guards/auth/auth-guard';
import { App } from './app';
import { TripCreateEdit } from './trips/tripCreateEdit/trip-create-edit/trip-create-edit';

export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio' },
  { path: 'login', component: Login, title: 'Iniciar Sesión' },
  { path: 'register', component: UserRegister, title: 'Registrarse' },
  {
    path: '',
    canActivate: [authGuard(['ROLE_USER', 'ROLE_COMPANY', 'ROLE_ADMIN'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Home, title: 'Dashboard' },

      {
        path: 'trips',
        component: TripList,
        title: 'Mis Viajes',
        canActivate: [authGuard(['VER_VIAJES', 'ROLE_ADMIN'])],
      },

      {
        path: 'trips/create',
        component: TripCreateEdit,
        title: 'Viajes',
        canActivate: [authGuard(['CREAR_VIAJE', 'ROLE_USER'])],
      },

      {
        path: ':id/editTrip',
        component: TripCreateEdit,
        title: 'Editar Viaje',
        canActivate: [authGuard(['MODIFICAR_VIAJE', 'ROLE_USER'])], 
      },

      {
        path: ':id/edit',
        component: UserRegister,
        title: 'Editar Usuario',
        canActivate: [authGuard(['', 'ROLE_USER'])], 
      },

      // Protected Route Example: Users List (Admin Only)
      // {
      //     path: 'users',
      //     component: UserListComponent,
      //     title: 'Admin Usuarios',
      //     canActivate: [authGuard(['VER_TODOS_USUARIOS', 'ROLE_ADMIN'])]
      // },
    ],
  },
  { path: '**', component: NotFound, title: 'Not Found' },
];
