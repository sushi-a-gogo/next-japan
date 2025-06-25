import { Component, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileService } from '@app/services/user-profile.service';
import { AppLogoComponent } from "@shared/app-logo/app-logo.component";
import { MyNotificationsComponent } from "./my-notifications/my-notifications.component";
import { SearchAutocompleteComponent } from "./search-autocomplete/search-autocomplete.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, RouterLinkActive, MatMenuModule, MatTooltipModule,
    MatRippleModule,
    MyNotificationsComponent, AppLogoComponent, UserMenuComponent, SearchAutocompleteComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  private router = inject(Router);
  private userProfileService = inject(UserProfileService);

  userProfile = this.userProfileService.userProfile;

  logout() {
    const returnTo = this.router.url;
    const queryParams = { returnTo: returnTo };
    this.router.navigate(['logout'], {
      queryParams: queryParams,
    });
  }
}
