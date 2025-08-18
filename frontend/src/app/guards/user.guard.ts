import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LOCAL_STORAGE_USER_KEY, StorageService } from '@app/services/storage.service';

export const userGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthMockService);
  const storage = inject(StorageService);

  if (isPlatformBrowser(platformId)) {
    const userId = storage.local.getItem(LOCAL_STORAGE_USER_KEY);
    if (userId && !authService.user()) {
      return router.navigate(["login"], { queryParams: { returnTo: state.url } });
    }
  }

  authService.userStatusChecked();
  return true;
};

