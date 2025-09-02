import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { delay, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { EventRegistrationService } from './event-registration.service';
import { NotificationService } from './notification.service';
import { LOCAL_STORAGE_USER_KEY, StorageService } from './storage.service';
import { ThemeService } from './theme.service';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private router = inject(Router);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);
  private userService = inject(UserProfileService);
  private eventRegistrationService = inject(EventRegistrationService);
  private notificationService = inject(NotificationService);

  private authenticated = signal<boolean>(false);
  isAuthenticated = this.authenticated.asReadonly();

  private activatedSignal = signal<boolean>(false);
  activated = this.activatedSignal.asReadonly();

  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();

  userStatusChecked() {
    this.activatedSignal.set(true);
  }

  login$(userId: string) {
    return this.userService.getUser$(userId).pipe(
      delay(1500), // simulate login process
      switchMap((resp) => {
        this.setUser(resp.data);
        return resp.data ? this.fetchUserData$(userId) : of(null)
      }),
      tap(() => this.userStatusChecked()),
      map(() => this.user())
    );
  }

  logout(redirectTo: string) {
    this.setUser(null);
    this.eventRegistrationService.clearUserRegistrations();

    const url = decodeURIComponent(redirectTo) || '/home';
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    const path = url.startsWith('/') ? url.substring(1) : url;
    this.router.navigate([path]).then(() => { });
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

  private setUser(user: User | null) {
    const data = this.storeUser(user);
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
        createdAt: user.createdAt,
        mode: user.mode
      };

      this.storage.local.setItem(LOCAL_STORAGE_USER_KEY, user.userId);
      return data;
    } else {
      this.storage.local.removeItem(LOCAL_STORAGE_USER_KEY)
      return null;
    }
  }
}
