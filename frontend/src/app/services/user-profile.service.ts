import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { User } from '@app/models/user.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { UserProfile } from '@models/user-profile.model';
import { catchError, delay, map, Observable, tap } from 'rxjs';
import { AuthMockService } from './auth-mock.service';
import { ErrorService } from './error.service';
import { EventRegistrationService } from './event-registration.service';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';

const LOCAL_STORAGE_KEY = 'nextjp.user';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private platformId = inject(PLATFORM_ID);

  private http = inject(HttpClient);
  private authService = inject(AuthMockService);
  private errorService = inject(ErrorService);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);
  private eventRegistrationService = inject(EventRegistrationService);

  private apiUri = `${environment.apiUrl}/api/user`;

  private user = signal<UserProfile | null>(null);
  userProfile = this.user.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUserJson = this.storage.local.getItem(LOCAL_STORAGE_KEY);
      if (savedUserJson) {
        const savedUser = JSON.parse(savedUserJson);
        this.user.set(savedUser);
        this.themeService.setAppearanceMode(savedUser.mode);
        this.authService.login(savedUser);
      }
    }
  }

  getUsers$() {
    return this.http.get<{ users: UserProfile[] }>(`${this.apiUri}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUsers'),
      map((resp) => resp.users),
      catchError((e) => this.errorService.handleError(e, 'Error fetching users.', true))
    );
  }

  getUser$(id: string) {
    return this.http.get<{ user: UserProfile }>(`${this.apiUri}/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUser'),
      delay(1500), // simulate login process
      tap((resp) => {
        this.setUser(resp.user);
      }),
      catchError((e) => this.errorService.handleError(e, 'Error fetching user.', true))
    );
  }

  updateProfile$(userProfile: UserProfile): Observable<UserProfile> {
    const prevUser = this.user();
    this.setUser(userProfile);
    return this.http.put<UserProfile>(`${this.apiUri}/update`, userProfile).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveUser"),
      catchError((e) => {
        this.setUser(prevUser);
        return this.errorService.handleError(e, 'Error updating user profile', true)
      })
    );
  }

  clearUserProfile() {
    this.setUser(null);
  }

  signUpUser$(firstName: string, lastName: string, email: string, subscriptionPlan: string) {
    return this.http.post<{ user: User }>(`${this.apiUri}/signup`, { firstName, lastName, email, subscriptionPlan }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "signUpUser"),
      tap((resp) => {
        const newUserProfile: UserProfile = {
          ...resp.data,
          image: { id: '', width: 0, height: 0 },
          addressLine1: null,
          city: null,
          state: null,
          zip: null,
          phone: null,
          isEmailPreferred: true
        };
        this.user.set(newUserProfile);
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving user profile', true)
      })
    );
  }

  private setUser(user: UserProfile | null) {
    this.user.set(user);
    if (user) {
      this.storage.local.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      this.storage.local.removeItem(LOCAL_STORAGE_KEY)
    }
    this.themeService.setAppearanceMode(user?.mode);
  }
}
