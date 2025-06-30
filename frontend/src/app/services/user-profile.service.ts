import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { UserProfile } from '@models/user-profile.model';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthMockService } from './auth-mock.service';
import { ErrorService } from './error.service';
import { StorageService } from './storage.service';

const LOCAL_STORAGE_KEY = 'nextjp.user';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthMockService);
  private errorService = inject(ErrorService);
  private storage = inject(StorageService);

  private apiUri = `${environment.apiUrl}/api/user`;

  private user = signal<UserProfile | null>(null);
  userProfile = this.user.asReadonly();

  constructor() {
    afterNextRender(() => {
      const savedUser = this.storage.local.getItem(LOCAL_STORAGE_KEY);
      if (savedUser) {
        this.user.set(JSON.parse(savedUser));
        this.authService.login();
      }
    });
  }

  getUsers$() {
    return this.http.get<{ users: UserProfile[] }>(`${this.apiUri}/list`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUsers'),
      map((resp) => resp.users),
      catchError((e) => this.errorService.handleError(e, 'Error fetching users.', true))
    );
  }

  getUser$(id: number) {
    return this.http.get<{ user: UserProfile }>(`${this.apiUri}/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUser'),
      tap((resp) => {
        this.setUser(resp.user);
      }),
      catchError((e) => this.errorService.handleError(e, 'Error fetching user.', true))
    );
  }

  updateProfile$(userProfile: UserProfile): Observable<UserProfile> {
    const prevUser = this.user();
    this.setUser(userProfile);

    return of(userProfile).pipe(delay(100), catchError((err) => {
      this.setUser(prevUser);
      return throwError(() => new Error('User update failed.'))
    }));
  }

  clearUserProfile() {
    this.setUser(null);
  }

  private setUser(user: UserProfile | null) {
    this.user.set(user);
    if (user) {
      this.storage.local.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      this.storage.local.removeItem(LOCAL_STORAGE_KEY)
    }
  }
}
