import { FormControl } from '@angular/forms';

export interface PaymentForm {
  nameOnCard: FormControl<string | null>;
  creditCardNumber: FormControl<string | null>;
  expirationMonth: FormControl<string | null>;
  expirationYear: FormControl<string | null>;
}
