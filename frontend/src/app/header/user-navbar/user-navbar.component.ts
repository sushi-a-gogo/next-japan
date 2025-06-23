import { Component, computed, inject, signal } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { UserProfileService } from '@app/services/user-profile.service';
import { AppLogoComponent } from "../../shared/app-logo/app-logo.component";
import { MyDreamEventsComponent } from "./my-dream-events/my-dream-events.component";
import { MyNotificationsComponent } from "./my-notifications/my-notifications.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, MatMenuModule, MatTooltipModule,
    MatRippleModule,
    MyNotificationsComponent, AppLogoComponent, UserMenuComponent, MyDreamEventsComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  private router = inject(Router);
  private userProfileService = inject(UserProfileService);

  userProfile = this.userProfileService.userProfile;
  userName = computed(() => {
    if (this.userProfile()) {
      const last = this.userProfile()!.lastName ? ` ${this.userProfile()!.lastName?.substring(0, 1)}.` : '';
      return `${this.userProfile()!.firstName}${last}`;
    }

    return '';
  });

  showMyDreamEvents = signal(false);

  logout() {
    const returnTo = this.router.url;
    const queryParams = { returnTo: returnTo };
    this.router.navigate(['logout'], {
      queryParams: queryParams,
    });
  }


  openMyDreams() {
    this.showMyDreamEvents.set(true);
  }

  closeMyDreams() {
    this.showMyDreamEvents.set(false);
  }


}
