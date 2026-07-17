import { Component, input, OnChanges, output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { PlanCardComponent } from './plan-card/plan-card.component';

@Component({
  selector: 'app-select-plan',
  imports: [PlanCardComponent],
  templateUrl: './select-plan.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './select-plan.component.scss'
})
export class SelectPlanComponent implements OnChanges {
  plans = input.required<SubscriptionPlan[]>();
  select = output<SubscriptionPlan>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plans']) {
      const mostPopular = this.plans().find((p) => p.mostPopular);
      const selectedPlan = this.plans().find((p) => p.selected) || mostPopular;
      selectedPlan!.selected = true;
    }
  }
}
