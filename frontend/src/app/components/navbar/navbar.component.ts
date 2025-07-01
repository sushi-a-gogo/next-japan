import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SearchAutocompleteComponent } from "@app/components/header/user-navbar/search-autocomplete/search-autocomplete.component";
import { EventSearchService } from '@app/services/event-search.service';
import { UserProfileService } from '@app/services/user-profile.service';
import { AppLogoComponent } from "@app/shared/app-logo/app-logo.component";
import { LoginButtonComponent } from "@app/shared/login-button/login-button.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AppLogoComponent, LoginButtonComponent, SearchAutocompleteComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  private userProfileService = inject(UserProfileService);
  userProfile = this.userProfileService.userProfile;

  toggleSearchPanel() {
    this.eventSearch.toggleSearchMode();
  }

}
