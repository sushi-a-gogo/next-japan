import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  //return router.navigate(["/home"]);
  return true; // disable for demo site
};
