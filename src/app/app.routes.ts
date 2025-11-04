import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { Login } from './security/auth/login/login';
import { UserRegister } from './users/userRegister/user-register/user-register';
import { TripList } from './trips/TripList/trip-list/trip-list';
import { authGuard } from './guards/auth/auth-guard';
import { TripCreateEdit } from './trips/tripCreateEdit/trip-create-edit/trip-create-edit';
import { TripDetails } from './trips/tripDetails/trip-details/trip-details';
import { Layout } from './AppLayout/layout/layout';
import { ItineraryList } from './itineraries/itinerary-list/itinerary-list';
import { ActivityBrowser } from './activities/activity-browser/activity-browser';
import { ItineraryCreateEdit } from './itineraries/itinerary-create-edit/itinerary-create-edit';
import { Profile } from './users/profile/profile';
import { ItineraryDetails } from './itineraries/itinerary-details/itinerary-details';
import { ChecklistList } from './checklist/checklist-list/checklist-list';
import { ChecklistCreateEdit } from './checklist/checklist-create-edit/checklist-create-edit';

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
                children: [
                    {
                        path: '', 
                        component: TripList,
                        title: 'Mis Viajes',
                        canActivate: [authGuard(['VER_VIAJES', 'ROLE_ADMIN', 'VER_VIAJE_USUARIO'])],
                    },
                    {
                        path: 'create',
                        component: TripCreateEdit,
                        title: 'Crear Viaje',
                        canActivate: [authGuard(['CREAR_VIAJE', 'ROLE_USER'])],
                    },
                    {
                        path: ':id',
                        component: TripDetails,
                        title: 'Detalle del Viaje',
                        canActivate: [authGuard(['VER_VIAJE_USUARIO', 'ROLE_USER'])],
                    },

                    {
                        path: ':id/edit',
                        component: TripCreateEdit,
                        title: 'Editar Viaje',
                        canActivate: [authGuard(['MODIFICAR_VIAJE', 'ROLE_USER'])],
                    },
                ],
            },
            {
                path: 'users',
                children: [
                    {
                        path: ':id/edit', 
                        component: UserRegister,
                        title: 'Editar Usuario',
                        canActivate: [authGuard(['MODIFICAR_USUARIO_ADMIN', 'ROLE_ADMIN'])],
                    },
                ],
            },
            {
                path: 'profile',
                children:[
                    {
                        path:'me',
                        component: Profile,
                title: 'Mi Perfil',
                canActivate: [authGuard(['ROLE_USER', 'VER_PERFIL'])],
                    },
                    {
                        path: 'me/edit',
                        component: UserRegister,
                        title: 'Editar Perfil',
                        canActivate: [authGuard(['ROLE_USER', 'MODIFICAR_USUARIO'])],
                    }
                ]
            },
            {
                path:'itineraries',
                children:
                [
                    {
                        path: '',
                        component: ItineraryList,
                        title: 'Mis Itinerarios',
                        canActivate: [authGuard(['VER_ITINERARIO_USUARIO', 'ROLE_USER'])]
                    },
                    {
                        path: 'create',
                        component: ItineraryCreateEdit,
                        title: 'Agregar Itinerario',
                        canActivate: [authGuard(['CREAR_ITINERARIO', 'ROLE_USER'])]
                    },
                    {
                        path: ':id/edit',
                        component: ItineraryCreateEdit,
                        title: 'Editar Itinerario',
                        canActivate: [authGuard(['MODIFICAR_ITINERARIO', 'ROLE_USER'])]
                    },
                    {
                        path: ':id',
                        component: ItineraryDetails,
                        title: 'Detalles Itinerario',
                        canActivate: [authGuard(['VER_ITINERARIO',  'ROLE_USER'])]
                    }
                ]
            },
            {
                path:'activities',
                children:
                [
                    {
                        path: '',
                        component: ActivityBrowser,
                        title: 'Actividades',
                        canActivate: [authGuard(['VER_TODAS_ACTIVIDADES', 'VER_ACTIVIDAD', 'VER_ACTIVIDAD_EMPRESA', 'VER_ACTIVIDAD_USUARIO', 'ROLE_USER'])]
                    }
                ]
            }, 
            {
                path:'checklists',
                children:
                [
                    {
                        path: '',
                        component: ChecklistList,
                        title: 'Checklists',
                        canActivate: [authGuard(['ROLE_USER'])] // cambiar permisos
                    }, 
                    {
                        path: 'create',
                        component: ChecklistCreateEdit,
                        title: 'Crear Checklist',
                        canActivate: [authGuard(['ROLE_USER'])]
                    }
                ]
            }
            
        ],
    },
    { path: '**', component: NotFound, title: 'Not Found' },
];
