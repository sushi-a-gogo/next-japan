import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventSearchService } from '@app/services/event-search.service';
import { AppLogoComponent } from "@app/shared/app-logo/app-logo.component";
import { SearchAutocompleteComponent } from "@app/shared/search-autocomplete/search-autocomplete.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AppLogoComponent, SearchAutocompleteComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('400ms ease-in-out', style({ opacity: 1 }))
  //     ])
  //   ])
  // ],
  // host: { '[@fadeIn]': '' }
})
export class NavbarComponent {
  private eventSearch = inject(EventSearchService);
  inSearchMode = this.eventSearch.searchMode;

  toggleSearchPanel() {
    this.eventSearch.toggleSearchMode();
  }

}
