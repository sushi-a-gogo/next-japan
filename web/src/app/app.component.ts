import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpportunityRequestFooterComponent } from "./components/opportunity-request-footer/opportunity-request-footer.component";
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component";
import { HeaderComponent } from './header/header.component';
import { SelectionService } from './services/selection.service';
import { UserProfileService } from './services/user-profile.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, OpportunityRequestFooterComponent, RegistrationDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.configureAppHeight();
  }

  title = 'next-japan';
  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  private selectionService = inject(SelectionService);
  showRegistrationDialog = this.selectionService.showRegistrationDialog;

  constructor() {
    this.configureAppHeight();
  }

  closeRegistrationDialog() {
    this.selectionService.hideRegistration();
  }


  private configureAppHeight(): void {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    window.addEventListener('--app-height', appHeight);
    appHeight();
  }
}
