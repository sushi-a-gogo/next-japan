import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from '@app/models/user-profile.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private authenticated = signal<boolean>(false);
  isAuthenticated = this.authenticated.asReadonly();

  private authenticating = signal<'sign-in' | 'sign-up' | null>(null);
  isAuthenticating = this.authenticating.asReadonly();

  private authSubject = new BehaviorSubject<UserProfile | null>(null);
  auth$ = this.authSubject.asObservable();

  constructor(private router: Router) {
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

  login(user: UserProfile) {
    this.authenticating.set(null);
    this.authenticated.set(!!user);
    this.authSubject.next(user);
  }

  logout(redirectTo: string) {
    this.authSubject.next(null);
    this.authenticated.set(false);
    const url = decodeURIComponent(redirectTo) || '/home';
    // If url starts with '/', remove it for router.navigate to treat it as an absolute path
    const path = url.startsWith('/') ? url.substring(1) : url;
    this.router.navigate([path]).then(() => { });
  }
}
