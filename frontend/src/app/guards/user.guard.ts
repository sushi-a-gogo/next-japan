import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { TokenService } from '@app/services/token.service';
import { catchError, map, of } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (isPlatformBrowser(platformId) && !authService.user()) {
    const userToken = tokenService.decodeToken();
    if (userToken && !tokenService.isTokenExpired()) {
      return authService.login$(userToken.email, 0).pipe(
        map(() => true),
        catchError(() => {
          tokenService.clearToken();
          return of(true);
        })
      );
    }
  }

  return true;
};

