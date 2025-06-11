import { Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private authenticated = signal<boolean>(false);
  isAuthenticated = this.authenticated.asReadonly();
  isAuthenticated$ = toObservable(this.authenticated);

  private authenticating = signal<boolean>(false);
  isAuthenticating = this.authenticating.asReadonly();

  constructor(private router: Router, userService: UserProfileService) {
    userService.setUserProfile$(0).pipe(takeUntilDestroyed()).subscribe();
  }

  authenticationStart() {
    if (this.authenticated()) {
      return;
    }

    this.authenticating.set(true);
  }

  authenticationStop() {
    this.authenticating.set(false);
  }

  login() {
    this.authenticating.set(false);
    this.authenticated.set(true);
  }

  loginWithRedirect(options: any) {
    this.router.navigate([options.appState.target || '/']).then(() => {
      this.authenticated.set(true);
    });
  }

  logout(redirectTo: string) {
    this.authenticated.set(false);
    const url = decodeURIComponent(redirectTo) || '/home';
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    const path = url.startsWith('/') ? url.substring(1) : url;
    this.router.navigate([path]).then(() => { });
  }
}
