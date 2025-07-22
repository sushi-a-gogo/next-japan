import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { AboutComponent } from "./components/about/about.component";
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { AuthMockService } from './services/auth-mock.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoginComponent,
    ErrorBarComponent,
    AboutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'next-japan';

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;

  constructor() {
    afterNextRender(this.configureAppHeight);
  }

  private configureAppHeight(): void {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', appHeight);
    appHeight();
  }
}
