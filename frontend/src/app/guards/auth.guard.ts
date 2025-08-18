import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthMockService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true; // Allow SSR to render the page
  }

  if (authService.user()) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
