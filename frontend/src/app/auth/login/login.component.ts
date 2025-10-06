import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/models/user.model';
import { AuthService } from '@app/services/auth.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { delay, of, switchMap } from 'rxjs';
import { LoginStepsComponent } from "./login-steps/login-steps.component";

@Component({
  selector: 'app-login',
  imports: [MatProgressSpinnerModule, LoginStepsComponent, NgxSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);
  private spinner = inject(NgxSpinnerService);

  private auth = inject(AuthService);
  private userService = inject(UserProfileService);
  private path = '/user/profile';

  showLoginSteps = signal<boolean>(false);
  busy = signal<boolean>(false);

  ngOnInit(): void {
    this.spinner.show();
    this.route.queryParams.pipe(
      switchMap((params) => {
        const returnToUrl = params['returnTo'] ? decodeURIComponent(params['returnTo']) : '/user/profile';
        if (returnToUrl) {
          // If route starts with '/', remove it for router.navigate to treat it as an absolute path
          const url = returnToUrl?.startsWith('/') ? returnToUrl.substring(1) : returnToUrl;
          this.path = url;
        }

        return of(this.auth.user());
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (user) => {
        if (user) {
          this.goBack();
        } else {
          setTimeout(() => {
            this.spinner.hide();
            this.showLoginSteps.set(true);
          }, 100);
        }
      },
      error: () => {
        this.goBack();
      }
    })
  }

  login(email: string) {
    this.showLoginSteps.set(false);
    this.busy.set(true);
    this.spinner.show();
    return this.auth.login$(email).pipe(delay(1500), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate([this.path]),
      error: () => this.router.navigate([this.path])
    });
  }

  signUp(user: User) {
    this.showLoginSteps.set(false);
    this.busy.set(true);
    this.spinner.show();
    this.userService.signUpUser$(user.firstName, user.lastName, user.email, user.subscriptionPlan)
      .pipe(
        switchMap((resp) => this.auth.login$(resp.data.email)),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => this.router.navigate([this.path]),
        error: () => this.router.navigate([this.path])
      });
  }

  goBack() {
    this.location.back();
  }
}
