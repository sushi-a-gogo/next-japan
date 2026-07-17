import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";

@Component({
  selector: 'app-plan-card',
  imports: [CurrencyPipe, NextButtonComponent],
  templateUrl: './plan-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './plan-card.component.scss'
})
export class PlanCardComponent {
  plan = input.required<SubscriptionPlan>();
  selected = output();

  select() {
    this.selected.emit();
  }
}
