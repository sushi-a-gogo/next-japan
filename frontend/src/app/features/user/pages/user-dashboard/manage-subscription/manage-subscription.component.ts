import { Component, computed, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { PlanPaymentComponent } from "@app/core/auth/login/login-steps/plan-payment/plan-payment.component";
import { SelectPlanComponent } from "@app/core/auth/login/login-steps/select-plan/select-plan.component";
import { User } from '@app/core/models/user.model';
import SUBSCRIPTION_PLANS, { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-manage-subscription',
  imports: [ToastModule, SelectPlanComponent, PlanPaymentComponent],
  templateUrl: './manage-subscription.component.html',
  styleUrl: './manage-subscription.component.scss'
})
export class ManageSubscriptionComponent implements OnChanges {
  private messageService = inject(MessageService);

  user = input.required<User>();
  selectedIndex = input.required<number>();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedIndex"]) {
      this.selectedPlanName.set(this.user().subscriptionPlan);
    }
  }

  selectPlan(plan: SubscriptionPlan) {
    this.selectedPlanName.set(plan.name);
  }

  update(subscriptionPlanName: string) {
    this.selectedPlanName.set(subscriptionPlanName);
    this.messageService.add({
      severity: 'info',
      summary: 'Subscription Updated!',
      detail: 'Your subscription was updated successfully.'
    });
  }
}
