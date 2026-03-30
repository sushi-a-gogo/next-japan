import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '@app/core/auth/auth.service';
import { AppLogoComponent } from "@app/core/ui/app-logo/app-logo.component";
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { EventSearchAutocompleteComponent } from "@app/features/events/ui/event-search-autocomplete/event-search-autocomplete.component";
import { NextButtonComponent } from "@app/shared/ui/next-button/next-button.component";

@Component({
  selector: 'app-navbar',
  imports: [AppLogoComponent, EventSearchAutocompleteComponent, NextButtonComponent, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private auth = inject(AuthService);
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  authCompleted = computed(() => this.auth.loginStatus() !== 'pending');

  toggleSearchPanel() {
    this.eventSearch.toggleSearchMode();
  }

}
