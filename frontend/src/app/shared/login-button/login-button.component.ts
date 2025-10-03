import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-login-button',
  imports: [ButtonComponent],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  signup = input<boolean>(false);
  private router = inject(Router);

  login() {
    const returnTo = this.router.url;
    const queryParams = this.signup() ? { signup: 'sign-up', returnTo: returnTo } : { returnTo: returnTo };
    this.router.navigate(['login'], {
      queryParams: queryParams,
    });
  }
}
