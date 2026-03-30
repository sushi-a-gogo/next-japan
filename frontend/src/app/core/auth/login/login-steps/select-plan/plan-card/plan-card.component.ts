import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";

@Component({
  selector: 'app-plan-card',
  imports: [CurrencyPipe, NextButtonComponent],
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
