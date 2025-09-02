import { Component, computed, input, OnInit, signal } from '@angular/core';
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
  selectedPlanName = signal<string | null>(null);

  plans = computed(() => {
    const subscriptionPlans = SUBSCRIPTION_PLANS.map((p) => ({ ...p }));
    const userPlan = subscriptionPlans.find((plan) => plan.name === this.user().subscriptionPlan) || null;
    if (userPlan) {
      userPlan.subscribed = true
    }
    const selectedPlan = subscriptionPlans.find((plan) => plan.name === this.selectedPlanName()) || null;
    if (selectedPlan) {
      selectedPlan.selected = true
    }

    return subscriptionPlans;
  });

  subscriptionPlan = computed(() => {
    const plan = this.plans().find((plan) => plan.name === this.selectedPlanName()) || null;
    return plan;
  });

  ngOnInit(): void {
    this.selectedPlanName.set(this.user().subscriptionPlan);
  }

  selectPlan(plan: Plan) {
    this.selectedPlanName.set(plan.name);
  }

  update(subscriptionPlanName: string) {
    this.selectedPlanName.set(subscriptionPlanName);
  }
}
