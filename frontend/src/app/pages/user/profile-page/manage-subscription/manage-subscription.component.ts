import { Component, input, OnInit, signal } from '@angular/core';
import { PlanPaymentComponent } from "@app/auth/login/login-steps/plan-payment/plan-payment.component";
import { SelectPlanComponent } from "@app/auth/login/login-steps/select-plan/select-plan.component";
import SUBSCRIPTION_PLANS, { Plan } from '@app/models/plan.interface';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-manage-subscription',
  imports: [SelectPlanComponent, PlanPaymentComponent],
  templateUrl: './manage-subscription.component.html',
  styleUrl: './manage-subscription.component.scss'
})
export class ManageSubscriptionComponent implements OnInit {
  user = input.required<User>();
  plans = signal<Plan[]>([]);
  subscriptionPlan = signal<Plan | null>(null);

  ngOnInit(): void {
    const allPlans = SUBSCRIPTION_PLANS.map((p) => ({ ...p }));
    const userPlan = allPlans.find((plan) => plan.name === this.user().subscriptionPlan) || null;
    if (userPlan) {
      userPlan.subscribed = true
      userPlan.selected = true;
      this.subscriptionPlan.set(userPlan);
    }

    this.plans.set(allPlans);
  }

  selectPlan(plan: Plan) {
    this.plans.update((prev) => prev.map((p) => ({
      ...p,
      selected: p.name === plan.name
    })));
    this.subscriptionPlan.set(plan);
  }

}
