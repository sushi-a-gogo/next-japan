import { Component, inject } from '@angular/core';
import { AppLogoComponent } from "@app/core/ui/app-logo/app-logo.component";
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { SearchAutocompleteComponent } from "@app/features/events/ui/search-autocomplete/search-autocomplete.component";
import { AnchorComponent } from '@app/shared/components/anchor/anchor.component';

@Component({
  selector: 'app-navbar',
  imports: [AnchorComponent, AppLogoComponent, SearchAutocompleteComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  toggleSearchPanel() {
    this.eventSearch.toggleSearchMode();
  }

}
