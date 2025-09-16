import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from '@app/models/api-response.model';
import { User } from '@app/models/user.model';
import { environment } from '@environments/environment';
import { catchError, delay, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ErrorService } from './error.service';
import { EventRegistrationService } from './event-registration.service';
import { NotificationService } from './notification.service';
import { ThemeService } from './theme.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private errorService = inject(ErrorService);
  private eventRegistrationService = inject(EventRegistrationService);
  private notificationService = inject(NotificationService);
  private themeService = inject(ThemeService);
  private tokenService = inject(TokenService);

  private apiUrl = `${environment.apiUrl}/api/auth`;

  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  isAuthenticated = computed(() => !!this.user());

  login$(email: string, delayInMs = 1500): Observable<User | null> {
    return this.http.post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/login`, { email }).pipe(
      delay(delayInMs),
      switchMap((res) => {
        if (res.success) {
          this.setUser(res.data.user);
          this.tokenService.setToken(res.data.token);
        }

        return res.success ? this.fetchUserData$(res.data.user.userId) : of(null)
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error logging in User', true)
      }),
      map(() => this.user())
    );
  }

  logout(redirectTo: string) {
    this.setUser(null);
    this.eventRegistrationService.clearUserRegistrations();

    const url = decodeURIComponent(redirectTo) || '/';
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    const path = url.startsWith('/') ? url.substring(1) : url;
    this.router.navigate([path]).then(() => { });
  }

  hydrateFromToken$() {
    const payload = this.tokenService.decodeToken();
    if (payload) {
      return this.login$(payload.email, 0);
    }

    return of(null);
  }

  updateUserData(userData: User) {
    const updated: User = {
      ...userData,
      createdAt: this.user()!.createdAt,
      email: this.user()!.email
    }
    this.setUser(updated);
  }

  private fetchUserData$(userId: string) {
    const observables = {
      eventRegistrations: this.eventRegistrationService.getUserEventRegistrations$(userId),
      notifications: this.notificationService.getUserNotifications$(userId)
    }
    return forkJoin(observables);
  }

  private setUser(user2: User | null) {
    const user = this.storeUser(user2);
    this.userSignal.set(user);
    this.themeService.setAppearanceMode(user?.mode);
  }

  private storeUser(user: User | null): User | null {
    if (user) {
      const data = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt,
        mode: user.mode
      };
      return data;
    } else {
      this.tokenService.clearToken();
      return null;
    }
  }


}
