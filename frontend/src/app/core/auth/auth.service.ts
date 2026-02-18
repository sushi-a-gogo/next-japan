import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '@app/core/models/api-response.model';
import { User } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/api.service';
import { catchError, map, Observable, throwError } from 'rxjs';

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
  loginStatus = signal<LoginStatus | null>('pending');
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

  signUpUser$(firstName: string, lastName: string, email: string, subscriptionPlan: string): Observable<ApiResponse<User>> {
    const newUser = {
      firstName,
      lastName,
      email,
      subscriptionPlan,
      image: { id: '', width: 0, height: 0 },
      isEmailPreferred: true,
    };
    return this.apiService.post<User>(`${this.apiUrl}/signup`, newUser).pipe(
      catchError((e) => {
        this.loginStatus.set('error');
        this.userSignal.set(null);
        return throwError(() => e);
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
