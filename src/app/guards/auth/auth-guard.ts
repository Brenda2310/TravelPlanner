import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../services/security/security-service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(SecurityService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; 
  } else {
    console.log('Acceso denegado. Redirigiendo a login.');
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
};
