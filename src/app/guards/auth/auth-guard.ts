import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../security/services/security-service';

/*export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(SecurityService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const roles = authService.getRoles();
    const hasRole = roles.some(r => allowedRoles.includes(r));

    if (hasRole) return true;

    console.log('Access Denied. Unauthorized');
    return router.createUrlTree(['/unauthorized']);
  };
};

*/