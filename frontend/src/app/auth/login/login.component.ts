import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LOCAL_STORAGE_USER_KEY, StorageService } from '@app/services/storage.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { of, switchMap } from 'rxjs';
import { LoginStepsComponent } from "./login-steps/login-steps.component";

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, LoginStepsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  showLogin = signal<boolean>(false);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private storage = inject(StorageService);

  private destroyRef = inject(DestroyRef);

  private path = '/home';

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap((params) => {
        let url = decodeURIComponent(params['returnTo']);
        // If url starts with '/', remove it for router.navigate to treat it as an absolute path
        url = url?.startsWith('/') ? url.substring(1) : url;
        if (url) {
          this.path = url;
        }

        const userId = this.storage.local.getItem(LOCAL_STORAGE_USER_KEY);
        if (userId) {
          return this.auth.login$(userId);
        }
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((user) => {
      if (user) {
        this.goBack();
      } else {
        this.showLogin.set(true);
      }
    })
  }

  login(userId: string) {
    this.showLogin.set(false);
    return this.auth.login$(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate([this.path]),
      error: () => this.router.navigate([this.path])
    });
  }

  signUp(user: User) {
    this.showLogin.set(false);
    this.userService.signUpUser$(user.firstName, user.lastName, user.email, user.subscriptionPlan)
      .pipe(
        switchMap((resp) => this.auth.login$(resp.data.userId)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => this.router.navigate([this.path]),
        error: () => this.router.navigate([this.path])
      });
  }

  goBack() {
    this.router.navigate([this.path]);
  }
}
