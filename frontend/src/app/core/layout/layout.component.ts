
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { CancelRegistrationDialogComponent } from "@app/features/registrations/ui/cancel-registration-dialog/cancel-registration-dialog.component";
import { ManageRegistrationDialogComponent } from "@app/features/registrations/ui/manage-registration-dialog/manage-registration-dialog.component";
import { RequestRegistrationDialogComponent } from "@app/features/registrations/ui/request-registration-dialog/request-registration-dialog.component";
import { filter } from 'rxjs';
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SignInBannerComponent } from './sign-in-banner/sign-in-banner.component';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, SignInBannerComponent, RequestRegistrationDialogComponent, ManageRegistrationDialogComponent, CancelRegistrationDialogComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private platformId = inject(PLATFORM_ID);

  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;

  constructor(router: Router) {
    router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.eventSearch.clearSearchMode();
    });
  }

  toggleSearchMode() {
    this.eventSearch.toggleSearchMode();
  }
}
