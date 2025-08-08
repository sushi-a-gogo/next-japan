import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthMockService);
  const router = inject(Router);

  // On server, return true to defer auth check to client
  if (!isPlatformBrowser(platformId)) {
    console.log('Running authGuard on server, deferring to client'); // Server-side debug
    return true; // Allow SSR to render the page
  }

  // On client, check auth state
  console.log('Running authGuard on client'); // Client-side debug
  return authService.auth$.pipe(
    map((user) => {
      if (user) {
        return true; // User is signed in, allow access
      }
      console.log('No user signed in, redirecting to /home');
      return router.createUrlTree(['/home']);
    })
  );
};
