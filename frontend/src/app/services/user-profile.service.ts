import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { User } from '@app/models/user.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { UserProfile } from '@models/user-profile.model';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { AuthMockService } from './auth-mock.service';
import { ErrorService } from './error.service';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';

const LOCAL_STORAGE_KEY = 'nextjp.user';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthMockService);
  private errorService = inject(ErrorService);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);

  private apiUri = `${environment.apiUrl}/api/user`;

  private user = signal<UserProfile | null>(null);
  userProfile = this.user.asReadonly();

  constructor() {
    afterNextRender(() => {
      const savedUser = this.storage.local.getItem(LOCAL_STORAGE_KEY);
      if (savedUser) {
        this.user.set(JSON.parse(savedUser));
        this.themeService.setAppearanceMode(this.user()?.mode);
        this.authService.login(this.user()!);
      }
    });
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

  setUserProfile$(user: User) {
    const newUserProfile: UserProfile = {
      ...user,
      addressLine1: null,
      city: null,
      state: null,
      zip: null,
      phone: null,
      isEmailPreferred: false
    };
    this.user.set(newUserProfile);

    return of(newUserProfile).pipe(delay(1500));
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
