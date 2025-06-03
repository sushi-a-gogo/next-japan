import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { LoadingSpinnerComponent } from '@app/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  imports: [LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthMockService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const returnTo = decodeURIComponent(params['returnTo'] || 'home');
      const authorizationParams = params['signup'] ? { screen_hint: 'signup' } : {};
      this.auth.loginWithRedirect({
        appState: { target: returnTo },
        authorizationParams: authorizationParams,
      });
    });
  }
}
