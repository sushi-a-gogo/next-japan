import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { TokenService } from '@app/services/token.service';

export const userGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (isPlatformBrowser(platformId)) {
    if (tokenService.getToken() && !tokenService.isTokenExpired() && !authService.user()) {
      return router.navigate(["login"], { queryParams: { returnTo: state.url } });
    }
  }

  return true;
};

