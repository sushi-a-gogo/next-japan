import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { User } from '@app/models/user.model';
import { Plan } from '@models/plan.interface';
import { PaymentForm } from './payment.form';


@Component({
  selector: 'app-plan-payment',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './plan-payment.component.html',
  styleUrl: './plan-payment.component.scss'
})
export class PlanPaymentComponent implements OnInit {
  user = input.required<User>();
  plan = input.required<Plan>();
  paymentForm = this.getForm();
  completePayment = output();
  cancel = output();

  ngOnInit(): void {
    this.paymentForm.get('nameOnCard')?.setValue(`${this.user().firstName} ${this.user().lastName}`);
  }

  createSubscription() {
    const subscription = {
      userId: 0,
      nameOnCard: this.paymentForm.value.nameOnCard!,
      creditCardNumber: this.paymentForm.value.creditCardNumber!,
      expirationMonth: this.paymentForm.value.expirationMonth!,
      expirationYear: this.paymentForm.value.expirationYear!
    };
    this.completePayment.emit();
  }

  private getForm() {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<PaymentForm>(
      {
        nameOnCard: new FormControl<string | null>(null, { validators: [Validators.required, ...textValidators] }),
        creditCardNumber: new FormControl<string | null>('4242 4242 4242 4242', { validators: [Validators.required] }),
        expirationMonth: new FormControl<string | null>('12', { validators: [Validators.required] }),
        expirationYear: new FormControl<string | null>('29', { validators: [Validators.required] }),
      }
    );

    return form;
  }

}
