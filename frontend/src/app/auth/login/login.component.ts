import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Plan } from '@app/models/plan.interface';
import { User } from '@app/models/user.model';
import { AuthMockService } from '@app/services/auth-mock.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';
import { ModalComponent } from "@shared/modal/modal.component";
import { of, switchMap } from 'rxjs';
import { PlanPaymentComponent } from './plan-payment/plan-payment.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
    ModalComponent,
    SignInComponent,
    SignUpFormComponent,
    SelectPlanComponent,
    PlanPaymentComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private auth = inject(AuthMockService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  mode = signal<'sign-in' | 'sign-up' | 'choose-plan' | 'plan-payment'>(this.auth.isAuthenticating() || 'sign-in');
  busy = signal<boolean>(false);
  authenticating = signal<boolean>(false);

  modeHeaderText = computed(() => {
    switch (this.mode()) {
      case 'sign-up':
        return "Create your account";
      case 'choose-plan':
        return "Choose your plan";
      case 'plan-payment':
        return "Enter payment details";
      case 'sign-in':
      default:
        return "Choose your account";
    }
  })

  newUser = signal<User | null>(null);
  subscriptionPlan = signal<Plan | null>(null);

  switchMode(mode?: 'sign-in' | 'sign-up' | 'choose-plan' | 'plan-payment') {
    this.busy.set(true);
    setTimeout(() => {
      if (!mode) {
        mode = this.mode() === 'sign-in' ? 'sign-up' : 'sign-in';
      }
      if (mode === 'sign-in') {
        this.newUser.set(null);
        this.subscriptionPlan.set(null);
      }

      this.mode.set(mode);
      this.busy.set(false);
    }, 500);
  }

  cancel() {
    this.auth.authenticationStop();
  }

  signIn(userId: string) {
    this.authenticating.set(true);
    this.userService.getUser$(userId).pipe(
      switchMap((user) => {
        this.auth.login(user);
        return of(user);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
    ;
  }

  signUp(user: User) {
    console.log(`Signed up: ${user.email}`);
    this.newUser.set(user);
    this.switchMode('choose-plan');
  }

  selectPlan(plan: Plan) {
    console.log(`Selected: ${plan.name}`);
    this.subscriptionPlan.set(plan);
    this.switchMode('plan-payment');
  }

  complete() {
    this.authenticating.set(true);
    this.userService.setUserProfile$(this.newUser()!).pipe(
      switchMap((user) => {
        this.auth.login(user);
        return of(user);
      }),
      takeUntilDestroyed(this.destroyRef)).subscribe();
    ;
  }
}
