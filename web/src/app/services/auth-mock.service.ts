import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthMockService {
  private authenticated = signal<boolean>(true);
  isAuthenticated = this.authenticated.asReadonly();
  isAuthenticated$ = toObservable(this.authenticated);

  constructor(private router: Router) { }

  loginWithRedirect(options: any) {
    this.router.navigate([options.appState.target || '/']).then(() => {
      this.authenticated.set(true);
    });
  }

  logout(redirectTo: string) {
    this.authenticated.set(false);
    this.router.navigate([redirectTo || '/']).then(() => { });
  }
}
