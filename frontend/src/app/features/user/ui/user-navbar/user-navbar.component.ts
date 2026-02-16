import { Component, inject, input } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AppLogoComponent } from "@app/core/ui/app-logo/app-logo.component";
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { EventSearchAutocompleteComponent } from "@app/features/events/ui/event-search-autocomplete/event-search-autocomplete.component";
import { User } from '@app/features/user/models/user.model';
import { MyNotificationsComponent } from "@app/features/user/ui/my-notifications/my-notifications.component";
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';
import { UserMenuComponent } from "./user-menu/user-menu.component";

@Component({
  selector: 'app-user-navbar',
  imports: [MatMenuModule, MyNotificationsComponent, AnchorComponent, AppLogoComponent, UserMenuComponent, EventSearchAutocompleteComponent],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.scss'
})
export class UserNavbarComponent {
  private router = inject(Router);
  private eventSearch = inject(EventSearchService);

  user = input.required<User>();
  inSearchMode = this.eventSearch.searchMode;

  toggleSearchPanel(event: any) {
    event.currentTarget.blur();
    this.eventSearch.toggleSearchMode();
  }

  logout() {
    const returnTo = this.router.url;
    const queryParams = { returnTo: returnTo };
    setTimeout(() => {
      this.router.navigate(['logout'], {
        //queryParams: queryParams,
      });
    }, 100);
  }
}
