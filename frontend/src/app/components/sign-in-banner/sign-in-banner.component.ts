import { ChangeDetectionStrategy, Component } from '@angular/core';
import fadeIn from '@app/animations/fadeIn.animation';
import { LoginButtonComponent } from '@app/shared/login-button/login-button.component';

@Component({
  selector: 'app-sign-in-banner',
  imports: [LoginButtonComponent],
  templateUrl: './sign-in-banner.component.html',
  styleUrl: './sign-in-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeIn],
  host: { '[@fadeIn]': 'in' }
})
export class SignInBannerComponent {
}
