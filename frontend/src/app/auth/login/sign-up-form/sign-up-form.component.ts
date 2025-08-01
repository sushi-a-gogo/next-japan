import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@app/models/user.model';
import { NewUserForm } from './new-user.form';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  newUserForm = this.getForm();
  signUp = output<User>();
  cancel = output();

  createUser() {
    const user: User = {
      userId: '',
      firstName: this.newUserForm.value.firstName!,
      lastName: this.newUserForm.value.lastName!,
      email: this.newUserForm.value.email!,
      image: {
        id: '',
        width: 0,
        height: 0,
      }
    };
    this.signUp.emit(user);
  }

  private getForm() {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<NewUserForm>(
      {
        firstName: new FormControl<string | null>('Mister', { validators: [Validators.required, ...textValidators] }),
        lastName: new FormControl<string | null>('Mister', { validators: [Validators.required, ...textValidators] }),
        email: new FormControl<string | null>('mister@mr.mister', {
          validators: [Validators.required, Validators.email]
        }),
      }
    );

    return form;
  }

}
