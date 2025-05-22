import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.loggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles     = route.data?.['roles'] as string[] | undefined;
  const userRole  = auth.role();

  if (roles && (!userRole || !roles.includes(userRole))) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};