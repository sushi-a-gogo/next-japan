import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewUserForm } from './new-user.form';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  newUserForm = this.getForm();


  private getForm() {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<NewUserForm>(
      {
        firstName: new FormControl<string | null>(null, { validators: [Validators.required, ...textValidators] }),
        lastName: new FormControl<string | null>(null, { validators: [Validators.required, ...textValidators] }),
        email: new FormControl<string | null>(null, {
          validators: [Validators.required, Validators.email]
        }),
      }
    );

    return form;
  }

}
