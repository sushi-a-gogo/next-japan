import { afterNextRender, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { ErrorBarComponent } from "./components/error-bar/error-bar.component";
import { OpportunityRequestFooterComponent } from "./components/opportunity-request-footer/opportunity-request-footer.component";
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component";
import { HeaderComponent } from './header/header.component';
import { AuthMockService } from './services/auth-mock.service';
import { SelectionService } from './services/selection.service';
import { UserProfileService } from './services/user-profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, OpportunityRequestFooterComponent, RegistrationDialogComponent, LoginComponent, ErrorBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'next-japan';

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  private selectionService = inject(SelectionService);
  showRegistrationDialog = this.selectionService.showRegistrationDialog;

  constructor() {
    afterNextRender(this.configureAppHeight);
  }

  closeRegistrationDialog() {
    this.selectionService.hideRegistration();
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
