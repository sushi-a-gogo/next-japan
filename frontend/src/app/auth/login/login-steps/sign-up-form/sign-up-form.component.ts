import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@app/models/user.model';
import { ButtonComponent } from '@app/shared/button/button.component';
import { NewUserForm } from './new-user.form';

@Component({
  selector: 'app-sign-up-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  newUserForm = this.getForm();
  submit = output<User>();
  switchToSignIn = output();

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
      },
      subscriptionPlan: ''
    };
    this.submit.emit(user);
  }

  private getForm() {
    const textValidators = [Validators.maxLength(100)];

    const form = new FormGroup<NewUserForm>(
      {
        firstName: new FormControl<string | null>('Nuri', { validators: [Validators.required, ...textValidators] }),
        lastName: new FormControl<string | null>('Jo', { validators: [Validators.required, ...textValidators] }),
        email: new FormControl<string | null>('nuri.jo@next.jp', {
          validators: [Validators.required, Validators.email]
        }),
      }
    );

    return form;
  }
}
