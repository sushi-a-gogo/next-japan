import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/core/models/user.model';
import SUBSCRIPTION_PLANS, { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { DialogComponent } from "@app/shared/ui/dialog/dialog.component";
import { PlanPaymentComponent } from './plan-payment/plan-payment.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';

@Component({
  selector: 'app-login-steps',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    DialogComponent,
    SignInComponent,
    SignUpFormComponent,
    SelectPlanComponent,
    PlanPaymentComponent
  ],
  templateUrl: './login-steps.component.html',
  styleUrl: './login-steps.component.scss'
})
export class LoginStepsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  mode = signal<'sign-in' | 'sign-up' | 'choose-plan' | 'plan-payment' | null>(null);
  busy = signal<boolean>(false);
  newUser = signal<User | null>(null);
  subscriptionPlan = signal<SubscriptionPlan | null>(null);
  plans = SUBSCRIPTION_PLANS.map((p) => ({ ...p }));
  login = output<string>();
  signUp = output<User>();
  goBack = output();

  modeHeaderText = computed(() => {
    switch (this.mode()) {
      case 'sign-up':
        return "Create your account";
      case 'choose-plan':
        return "Choose your plan";
      case 'plan-payment':
        return "Enter pretend payment details";
      case 'sign-in':
      default:
        return "Demo the full user experience";
    }
  })

  ngOnInit(): void {
    this.mode.set(this.route.snapshot.queryParams['signup'] || 'sign-in')
  }

  switchMode(mode?: 'sign-in' | 'sign-up' | 'choose-plan' | 'plan-payment') {
    this.busy.set(true);

    if (!mode) {
      mode = this.mode() === 'sign-in' ? 'sign-up' : 'sign-in';
    }

    if (mode === 'sign-in') {
      this.newUser.set(null);
      this.subscriptionPlan.set(null);
    }

    setTimeout(() => {
      this.mode.set(mode);
      this.busy.set(false);
    }, 400);
  }

  signIn(userId: string) {
    this.login.emit(userId);
  }

  beginSignUp() {
    this.switchMode('sign-up');
  }

  choosePlan(user: User) {
    this.newUser.set(user);
    this.switchMode('choose-plan');
  }

  selectPlan(plan: SubscriptionPlan) {
    this.subscriptionPlan.set(plan);
    this.newUser.update((prev) => ({ ...prev!, subscriptionPlan: plan.name }));
    this.switchMode('plan-payment');
  }

  completeSignUp() {
    const user = this.newUser()!;
    this.signUp.emit(user);
  }
}
