import { Component, computed, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserProfileService } from '@app/services/user-profile.service';
import { UserAvatarComponent } from "@shared/avatar/user-avatar/user-avatar.component";
import { MyEventsComponent } from "../../../my-events/my-events.component";
import { UserProfileComponent } from "../../../user-profile/user-profile.component";

@Component({
  selector: 'app-user-menu',
  imports: [MatButtonModule, MatMenuModule, MatTooltipModule, UserProfileComponent, MyEventsComponent, UserAvatarComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  private userProfileService = inject(UserProfileService);

  signout = output();

  userProfile = this.userProfileService.userProfile;
  userName = computed(() => {
    if (this.userProfile()) {
      const last = this.userProfile()!.lastName ? ` ${this.userProfile()!.lastName?.substring(0, 1)}.` : '';
      return `${this.userProfile()!.firstName}${last}`;
    }

    return '';
  });

  showMyEvents = signal(false);
  showUserProfile = signal(false);

  logout() {
    this.signout.emit();
  }

  openMyEvents() {
    this.showMyEvents.set(true);
  }

  closeMyEvents() {
    this.showMyEvents.set(false);
  }

  openUserProfile() {
    this.showUserProfile.set(true);
  }

  closeUserProfile() {
    this.showUserProfile.set(false);
  }

}
