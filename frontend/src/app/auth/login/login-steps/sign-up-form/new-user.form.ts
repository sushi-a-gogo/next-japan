import { FormControl } from '@angular/forms';

export interface NewUserForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
}
