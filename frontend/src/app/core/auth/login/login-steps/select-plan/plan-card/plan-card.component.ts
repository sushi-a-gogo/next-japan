import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { ButtonComponent } from '@app/shared/ui/button/button.component';

@Component({
  selector: 'app-plan-card',
  imports: [CurrencyPipe, ButtonComponent],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.scss'
})
export class PlanCardComponent {
  plan = input.required<SubscriptionPlan>();
  selected = output();

  select() {
    this.selected.emit();
  }
}
