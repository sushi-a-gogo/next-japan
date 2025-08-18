import { Component, output } from '@angular/core';
import plans, { Plan } from '@models/plan.interface';
import { PlanCardComponent } from './plan-card/plan-card.component';

@Component({
  selector: 'app-select-plan',
  imports: [PlanCardComponent],
  templateUrl: './select-plan.component.html',
  styleUrl: './select-plan.component.scss'
})
export class SelectPlanComponent {
  plans = plans;
  select = output<Plan>();
}
