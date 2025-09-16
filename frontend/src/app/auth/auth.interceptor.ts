// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { environment } from '@environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const auth = inject(AuthService);

  if (auth.token && req.url.startsWith(apiUrl)) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${auth.token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
