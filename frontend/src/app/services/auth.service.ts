import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';

type LoginStatus = 'idle' | 'pending' | 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  private apiUrl = 'api/auth';
  private userSignal = signal<User | null>(null);
  private accessTokenSignal = signal<string | null>(null);

  user = this.userSignal.asReadonly();
  accessToken = this.accessTokenSignal.asReadonly();
  loginStatus = signal<LoginStatus | null>(null);
  isAuthenticated = computed(() => !!this.user());

  hydrateUser$() {
    return this.apiService.get<{ user: User, accessToken: string }>(`${this.apiUrl}/user`).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.loginStatus.set('success');
          this.userSignal.set(res.data.user);
          this.accessTokenSignal.set(res.data.accessToken);
          return res.data.user;
        } else {
          this.loginStatus.set('idle');
          return null;
        }
      }),
      catchError((e) => {
        this.loginStatus.set('error');
        this.userSignal.set(null);
        this.accessTokenSignal.set(null);
        return throwError(() => e);
      })
    );
  }

  login$(email: string): Observable<User | null> {
    this.loginStatus.set('pending');
    return this.apiService.post<{ user: User; accessToken: string }>(`${this.apiUrl}/login`, { email }).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.userSignal.set(res.data.user);
          this.accessTokenSignal.set(res.data.accessToken);
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
    return this.apiService.post<{ user: User, accessToken: string }>(
      `${this.apiUrl}/refresh`,
      {}
    ).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.userSignal.set(res.data.user);
          this.accessTokenSignal.set(res.data.accessToken)
          return res.data.user;
        }
        throw new Error('Refresh failed');
      })
    );
  }


  logout(redirectTo: string) {
    this.apiService.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: (res) => {
        if (res.success) {
          this.loginStatus.set('idle');
          this.userSignal.set(null);
          this.accessTokenSignal.set(null);

          const url = decodeURIComponent(redirectTo) || '/';
          this.router.navigateByUrl(url);
        }
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
