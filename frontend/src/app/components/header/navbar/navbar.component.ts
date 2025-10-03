import { Component, inject } from '@angular/core';
import { EventSearchService } from '@app/services/event-search.service';
import { AnchorComponent } from '@app/shared/anchor/anchor.component';
import { AppLogoComponent } from "@app/shared/app-logo/app-logo.component";
import { SearchAutocompleteComponent } from "@app/shared/search-autocomplete/search-autocomplete.component";

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
