import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { AuthService } from '@app/services/auth.service';
import { environment } from '@environments/environment';
import { catchError, map, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

function getCookie(name: string): string | null {
  // Only safe to access document.cookie on client (SSR/prerender has no document)
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = environment.apiUrl;
  const auth = inject(AuthService);

  // Attach cookies for API calls
  if (req.url.startsWith(apiUrl)) {
    const token = getCookie('XSRF-TOKEN');

    if (token) {
      req = req.clone({
        setHeaders: { 'X-XSRF-TOKEN': token },
        withCredentials: true
      });
    } else {
      req = req.clone({ withCredentials: true });
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
    // Handle 401 errors + refresh flow
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing) {
        isRefreshing = true;
        return auth.refreshToken$().pipe(
          switchMap(() => {
            isRefreshing = false;
            const retryReq = req.clone({ withCredentials: true });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            auth.logout('/');
            return throwError(() => refreshErr);
          })
        );
      }
      // Normalize errors too
      const normalizedError = {
        success: false,
        data: null,
        message:
          error.error?.message || error.statusText || 'Something went wrong',
      };
      return throwError(() => normalizedError);
    })
  );
};
