import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '@app/models/api-response.model';
import { User } from '@app/models/user.model';
import { environment } from '@environments/environment';
import { catchError, delay, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private errorService = inject(ErrorService);
  private tokenService = inject(TokenService);

  private apiUrl = `${environment.apiUrl}/api/auth`;

  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  isAuthenticated = computed(() => !!this.user());

  login$(email: string, delayInMs = 1500): Observable<User | null> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/login`, { email }).pipe(
      delay(delayInMs),
      map((res) => {
        if (res.success) {
          this.userSignal.set(res.data.user);
          this.tokenService.setToken(res.data.token);
          return res.data.user;
        } else {
          this.logout('/');
          return null;
        }
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error logging in User', true)
      })
    );
  }

  logout(redirectTo: string) {
    this.tokenService.clearToken();
    this.userSignal.set(null);

    const url = decodeURIComponent(redirectTo) || '/';
    this.router.navigateByUrl(url);
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    // const path = url.startsWith('/') ? url.substring(1) : url;
    // this.router.navigate([path]).then(() => { });
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
