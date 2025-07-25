import { Component, inject } from '@angular/core';

import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { EventSearchService } from '@app/services/event-search.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { AppLogoComponent } from "@shared/app-logo/app-logo.component";
import { SearchAutocompleteComponent } from "../../../shared/search-autocomplete/search-autocomplete.component";
import { MyNotificationsComponent } from "../../my-notifications/my-notifications.component";
import { UserMenuComponent } from "./user-menu/user-menu.component";

@Component({
  selector: 'app-user-navbar',
  imports: [RouterLink, MatMenuModule, MatTooltipModule,
    MatRippleModule,
    MyNotificationsComponent, AppLogoComponent, UserMenuComponent, SearchAutocompleteComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  private router = inject(Router);
  private eventSearch = inject(EventSearchService);
  private userProfileService = inject(UserProfileService);

  userProfile = this.userProfileService.userProfile;
  inSearchMode = this.eventSearch.searchMode;

  toggleSearchPanel(event: any) {
    event.currentTarget.blur();
    this.eventSearch.toggleSearchMode();
  }

  logout() {
    const returnTo = this.router.url;
    const queryParams = { returnTo: returnTo };
    this.router.navigate(['logout'], {
      queryParams: queryParams,
    });
  }
}
