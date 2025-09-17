// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { environment } from '@environments/environment';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const auth = inject(AuthService);

  // Only attach token for API calls
  if (req.url.startsWith(apiUrl)) {
    req = req.clone({
      withCredentials: true
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;

        // Call refresh endpoint
        return auth.refreshToken$().pipe(
          switchMap((newToken) => {
            isRefreshing = false;

            // Retry original request with fresh token
            const retryReq = req.clone({
              withCredentials: true
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            auth.logout('/'); // clear state & redirect
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
