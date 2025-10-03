import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Plan } from '@app/models/plan.interface';
import { ButtonComponent } from '@app/shared/button/button.component';

@Component({
  selector: 'app-plan-card',
  imports: [CurrencyPipe, ButtonComponent],
  templateUrl: './plan-card.component.html',
  styleUrl: './plan-card.component.scss'
})
export class PlanCardComponent {
  plan = input.required<Plan>();
  selected = output();

  select() {
    this.selected.emit();
  }
}
