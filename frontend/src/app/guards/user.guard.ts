import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { catchError, map, of } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(platformId) && !authService.user()) {
    return authService.hydrateUser$().pipe(
      map(() => true),
      catchError(() => {
        return of(true);
      })
    );
  }

  return true;
};

