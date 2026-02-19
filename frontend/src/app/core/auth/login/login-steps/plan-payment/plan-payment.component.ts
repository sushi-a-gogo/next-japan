import { Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { User } from '@app/core/models/user.model';
import { SubscriptionPlan } from '@app/features/user/models/subscription-plan.interface';
import { UserProfile } from '@app/features/user/models/user-profile.model';
import { UserProfileService } from '@app/features/user/services/user-profile.service';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { delay, of, switchMap } from 'rxjs';
import { PaymentForm } from './payment.form';


@Component({
  selector: 'app-plan-payment',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
  templateUrl: './plan-payment.component.html',
  styleUrl: './plan-payment.component.scss'
})
export class PlanPaymentComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserProfileService);
  private destroyRef = inject(DestroyRef);

  user = input.required<User>();
  plan = input.required<SubscriptionPlan>();
  paymentForm = this.getForm();
  completePayment = output();
  updatePayment = output<string>();
  cancel = output();
  busy = signal<boolean>(false);

  ngOnInit(): void {
    this.paymentForm.get('nameOnCard')?.setValue(`${this.user().firstName} ${this.user().lastName}`);
  }

  createSubscription() {
    this.completePayment.emit();
  }

  updateSubscription() {
    const subscription = {
      userId: this.user().userId,
      nameOnCard: this.paymentForm.value.nameOnCard!,
      creditCardNumber: this.paymentForm.value.creditCardNumber!,
      expirationMonth: this.paymentForm.value.expirationMonth!,
      expirationYear: this.paymentForm.value.expirationYear!
    };

    this.busy.set(true);
    this.userService.getUser$(this.user().userId).pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          const profile: UserProfile = {
            ...res.data,
            subscriptionPlan: this.plan()!.name
          };
          return this.userService.updateProfile$(profile);
        }
        return of(res);
      }),
      delay(500),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.user().subscriptionPlan = res.data.subscriptionPlan;
          this.authService.updateUserData(res.data);
          this.updatePayment.emit(res.data.subscriptionPlan);
        }
        this.busy.set(false);
      },
      error: (err) => {
        console.error('API Error', err.message);
        this.busy.set(false);
      }
    });
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
