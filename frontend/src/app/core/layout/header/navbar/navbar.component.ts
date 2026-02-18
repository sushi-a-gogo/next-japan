import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { AppLogoComponent } from "@app/core/ui/app-logo/app-logo.component";
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { EventSearchAutocompleteComponent } from "@app/features/events/ui/event-search-autocomplete/event-search-autocomplete.component";
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';

@Component({
  selector: 'app-navbar',
  imports: [AnchorComponent, AppLogoComponent, EventSearchAutocompleteComponent],
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
