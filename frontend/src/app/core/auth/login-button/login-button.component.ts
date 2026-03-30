import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";

@Component({
  selector: 'app-login-button',
  imports: [NextButtonComponent],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  signup = input<boolean>(false);
  private router = inject(Router);

  login() {
    const queryParams = this.signup() ? { signup: 'sign-up', returnTo: undefined } : { returnTo: undefined };
    this.router.navigate(['login'], {
      queryParams: queryParams,
    });
  }
}
