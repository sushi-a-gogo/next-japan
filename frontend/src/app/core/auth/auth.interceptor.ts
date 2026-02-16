import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { environment } from '@environments/environment';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';

let refresh$: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const auth = inject(AuthService);

  // Attach cookies for API calls
  if (req.url.startsWith(apiUrl)) {
    const token = auth.accessToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
    } else {
      req = req.clone({
        withCredentials: true
      });
    }
  }

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.url?.startsWith(apiUrl)) {
        const body = event.body as Partial<ApiResponse<unknown>>;
        const normalized = {
          success: body?.success ?? true,
          data: body?.data !== undefined ? body.data : null, // Use body.data or null
          message: body?.message ?? '',
        };
        return event.clone({ body: normalized });
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/auth/');
      if (error.status !== 401 || isAuthEndpoint || req.headers.has('X-Retry')) {
        const normalizedError = {
          success: false,
          data: null,
          message:
            error.error?.message || error.statusText || 'Something went wrong',
        };
        return throwError(() => normalizedError);
      }

      if (!refresh$) {
        refresh$ = auth.refreshToken$().pipe(
          finalize(() => {
            refresh$ = null;
          }),
          shareReplay(1)
        );
      }

      // refresh, then retry request
      return refresh$.pipe(
        switchMap(() => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${auth.accessToken()}`,
              'X-Retry': 'true'
            },
            withCredentials: true
          });

          return next(retryReq);
        }),
        catchError((refreshErr) => {
          auth.logout('/');
          return throwError(() => refreshErr);
        })
      );
    }));
};
