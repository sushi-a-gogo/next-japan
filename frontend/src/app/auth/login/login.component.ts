import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Plan } from '@app/models/plan.interface';
import { User } from '@app/models/user.model';
import { ModalComponent } from "@shared/modal/modal.component";
import { PlanPaymentComponent } from './plan-payment/plan-payment.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    ModalComponent,
    SignInComponent,
    SignUpFormComponent,
    SelectPlanComponent,
    PlanPaymentComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private route = inject(ActivatedRoute);

  mode = signal<'sign-in' | 'sign-up' | 'choose-plan' | 'plan-payment' | null>(null);
  busy = signal<boolean>(false);
  login = output<string>();
  signUp = output<User>();

  ngOnInit(): void {
    this.mode.set(this.route.snapshot.queryParams['signup'] || 'sign-in')
  }

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
        return "Log in to continue";
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
  }

  signIn(userId: string) {
    this.login.emit(userId);
    // this.authenticating.set(true);
    // this.auth.login$(userId).pipe(
    //   takeUntilDestroyed(this.destroyRef)
    // ).subscribe({
    //   complete: () => this.authenticating.set(false),
    //   error: () => this.authenticating.set(false)
    // });
  }

  beginSignUp(user: User) {
    this.newUser.set(user);
    this.switchMode('choose-plan');
  }

  selectPlan(plan: Plan) {
    this.subscriptionPlan.set(plan);
    this.newUser.update((prev) => ({ ...prev!, subscriptionPlan: plan.name }));
    this.switchMode('plan-payment');
  }

  complete() {
    const user = this.newUser()!;
    this.signUp.emit(user);
  }
}
