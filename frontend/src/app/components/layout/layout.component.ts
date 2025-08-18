import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { EventSearchService } from '@app/services/event-search.service';
import { filter } from 'rxjs';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { SignInBannerComponent } from '../sign-in-banner/sign-in-banner.component';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, SignInBannerComponent, UserProfileComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private platformId = inject(PLATFORM_ID);

  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthMockService);
  isAuthenticated = this.authService.isAuthenticated;
  authIsActivated = computed(() => isPlatformBrowser(this.platformId) && this.authService.activated());

  private dialogService = inject(DialogService);
  showProfileDialog = computed(() => this.dialogService.showDialog() === 'profile');

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

  closeProfileDialog() {
    this.dialogService.closeDialog('profile');
  }
}
