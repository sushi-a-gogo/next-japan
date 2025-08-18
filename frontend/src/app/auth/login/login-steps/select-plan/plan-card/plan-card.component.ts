import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Plan } from '../../../../../models/plan.interface';

@Component({
  selector: 'app-plan-card',
  imports: [CurrencyPipe, MatButtonModule],
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
