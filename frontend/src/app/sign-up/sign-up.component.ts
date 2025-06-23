import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { plans } from './subscription-plan.model';

@Component({
  selector: 'app-sign-up',
  imports: [CurrencyPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  plans = plans;

}
