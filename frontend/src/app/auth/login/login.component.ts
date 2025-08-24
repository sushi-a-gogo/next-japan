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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private storage = inject(StorageService);
  private path = '/user/profile';

  showLoginSteps = signal<boolean>(false);
  userId = this.storage.local.getItem(LOCAL_STORAGE_USER_KEY);
  busy = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap((params) => {
        const returnToUrl = decodeURIComponent(params['returnTo']);
        if (returnToUrl) {
          // If route starts with '/', remove it for router.navigate to treat it as an absolute path
          const url = returnToUrl?.startsWith('/') ? returnToUrl.substring(1) : returnToUrl;
          this.path = url;
        }

        return this.userId ? this.auth.login$(this.userId) : of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (user) => {
        if (user) {
          this.goBack();
        } else {
          setTimeout(() => {
            this.showLoginSteps.set(true);
          }, 100);
        }
      },
      error: () => {
        this.storage.local.removeItem(LOCAL_STORAGE_USER_KEY);
        this.goBack();
      }
    })
  }

  login(userId: string) {
    this.showLoginSteps.set(false);
    this.busy.set(true);
    return this.auth.login$(userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(["/user/profile"]),
      error: () => this.router.navigate([this.path])
    });
  }

  signUp(user: User) {
    this.showLoginSteps.set(false);
    this.userService.signUpUser$(user.firstName, user.lastName, user.email, user.subscriptionPlan)
      .pipe(
        switchMap((resp) => this.auth.login$(resp.data.userId)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => this.router.navigate(["/user/profile"]),
        error: () => this.router.navigate([this.path])
      });
  }

  goBack() {
    this.router.navigate([this.path]);
  }
}
