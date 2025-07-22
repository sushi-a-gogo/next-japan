import { Component, computed, inject } from '@angular/core';
import { AuthMockService } from '@app/services/auth-mock.service';
import { DialogService } from '@app/services/dialog.service';
import { EventSearchService } from '@app/services/event-search.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { MyEventsComponent } from "../my-events/my-events.component";
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, MyEventsComponent, UserProfileComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private authService = inject(AuthMockService);
  isAuthenticating = this.authService.isAuthenticating;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  private dialogService = inject(DialogService);
  showEventsDialog = computed(() => this.dialogService.showDialog() === 'events');
  showProfileDialog = computed(() => this.dialogService.showDialog() === 'profile');

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
