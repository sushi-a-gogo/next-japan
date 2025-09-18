import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '@app/models/api-response.model';
import { User } from '@app/models/user.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

type LoginStatus = 'idle' | 'pending' | 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userSignal = signal<User | null>(null);

  user = this.userSignal.asReadonly();
  loginStatus = signal<LoginStatus | null>(null);
  isAuthenticated = computed(() => !!this.user());

  hydrateUser$() {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/user`).pipe(
      map((res) => {
        if (res.success) {
          this.loginStatus.set('success');
          this.userSignal.set(res.data);
          return res.data;
        } else {
          this.loginStatus.set('idle');
          return null;
        }
      }),
      catchError((e) => {
        this.loginStatus.set('error');
        this.userSignal.set(null);
        return throwError(() => e);
      })
    );
  }

  login$(email: string): Observable<User | null> {
    this.loginStatus.set('pending');
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/login`, { email }).pipe(
      map((res) => {
        if (res.success) {
          this.userSignal.set(res.data.user);
          this.loginStatus.set('success');
          return res.data.user;
        } else {
          this.loginStatus.set('error');
          this.logout('/');
          return null;
        }
      }),
      catchError((e) => {
        this.loginStatus.set('error');
        this.userSignal.set(null);
        return throwError(() => e);
      })
    );
  }

  refreshToken$() {
    return this.http.post<ApiResponse<{ user: User }>>(
      `${this.apiUrl}/refresh`,
      {}
    ).pipe(
      map((res) => {
        if (res.success) {
          this.userSignal.set(res.data.user);
          return res.data.user;
        }
        throw new Error('Refresh failed');
      })
    );
  }


  logout(redirectTo: string) {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.loginStatus.set('idle');
        this.userSignal.set(null);

        const url = decodeURIComponent(redirectTo) || '/';
        this.router.navigateByUrl(url);
        // If url starts with '/', remove it for router.navigate to treat it as an absolute path
        // const path = url.startsWith('/') ? url.substring(1) : url;
        // this.router.navigate([path]).then(() => { });
        // Optionally, clear any stored user data or tokens
      },
      error: (err) => {
        console.error('Logout failed', err);
      },
    });
  }

  updateUserData(userData: User) {
    const current = this.user();
    if (!current) return;

    const updated: User = {
      ...userData,
      createdAt: current.createdAt,
      email: current.email,
    };

    this.userSignal.set(updated);
  }
}
