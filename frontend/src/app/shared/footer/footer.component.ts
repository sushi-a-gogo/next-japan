import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { AppLogoComponent } from "../app-logo/app-logo.component";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppLogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private router = inject(Router);
  private auth = inject(AuthMockService);
  private dialogService = inject(DialogService);

  isAuthenticated = this.auth.isAuthenticated;

  signUp() {
    this.router.navigate([`login`], {
      queryParams: { signup: 'signup', returnTo: `${this.router.url}` },
    });
  }

  openAboutDialog($event: any) {
    $event.preventDefault();
    this.dialogService.showAboutDialog();
  }
}
