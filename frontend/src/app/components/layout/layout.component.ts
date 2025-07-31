import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { EventSearchService } from '@app/services/event-search.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { filter } from 'rxjs';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { MyEventsComponent } from "../my-events/my-events.component";
import { SignInBannerComponent } from '../sign-in-banner/sign-in-banner.component';
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, SignInBannerComponent, MyEventsComponent, UserProfileComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;
  isAuthenticated = this.authService.isAuthenticated;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  private dialogService = inject(DialogService);
  showEventsDialog = computed(() => this.dialogService.showDialog() === 'events');
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

  closeEventsDialog() {
    this.dialogService.closeDialog('events');
  }

  closeProfileDialog() {
    this.dialogService.closeDialog('profile');
  }
}
