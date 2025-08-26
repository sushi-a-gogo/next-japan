import { FormControl } from '@angular/forms';

export interface UserProfileForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  preferredContactMethod: FormControl<'email' | 'phone' | null>;
}
