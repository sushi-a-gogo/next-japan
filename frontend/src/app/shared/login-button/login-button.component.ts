import { Component, inject, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterLink } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';

@Component({
  selector: 'app-login-button',
  imports: [RouterLink, MatRippleModule],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
  signup = input<boolean>(false);

  private auth = inject(AuthMockService);
  private router = inject(Router);

  login() {
    this.auth.authenticationStart();
    return;
    const returnTo = this.router.url;
    const queryParams = this.signup() ? { signup: 'signup', returnTo: returnTo } : { returnTo: returnTo };
    this.router.navigate(['login'], {
      queryParams: queryParams,
    });
  }

}
