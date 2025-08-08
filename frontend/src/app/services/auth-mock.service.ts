import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { BehaviorSubject, delay, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';
import { UserProfileService } from './user-profile.service';

const LOCAL_STORAGE_KEY = 'nextjp.user';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private router = inject(Router);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);
  private userService = inject(UserProfileService);

  private authenticated = signal<boolean>(false);
  isAuthenticated = this.authenticated.asReadonly();

  private authenticating = signal<'sign-in' | 'sign-up' | null>(null);
  isAuthenticating = this.authenticating.asReadonly();

  private authSubject = new BehaviorSubject<User | null>(null);
  auth$ = this.authSubject.asObservable();

  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUserJson = this.storage.local.getItem(LOCAL_STORAGE_KEY);
      if (savedUserJson) {
        const savedUser = JSON.parse(savedUserJson);
        this.setUser(savedUser);
      }
    }
  }

  authenticationStart(mode?: 'sign-in' | 'sign-up') {
    if (this.authenticated()) {
      return;
    }

    this.authenticating.set(mode || 'sign-in');
  }

  authenticationStop() {
    this.authenticating.set(null);
  }

  login$(userId: string) {
    return this.userService.getUser$(userId).pipe(
      delay(1500), // simulate login process
      tap((resp) => {
        this.authenticating.set(null);
        this.setUser(resp.user);
      })
    );
  }

  logout(redirectTo: string) {
    this.setUser(null);

    const url = decodeURIComponent(redirectTo) || '/home';
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    const path = url.startsWith('/') ? url.substring(1) : url;
    this.router.navigate([path]).then(() => { });
  }

  updateUserData(userData: User) {
    const authUser = this.authSubject.value;
    if (!authUser) {
      return;
    }

    const updated: User = {
      ...userData,
      email: authUser.email
    }
    this.setUser(updated);
  }


  private setUser(user: User | null) {
    const data = this.storeUser(user);
    this.authSubject.next(data);
    this.userSignal.set(data);
    this.authenticated.set(!!data);
    this.themeService.setAppearanceMode(data?.mode);
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
        mode: user.mode
      };

      this.storage.local.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data;
    } else {
      this.storage.local.removeItem(LOCAL_STORAGE_KEY)
      return null;
    }
  }
}
