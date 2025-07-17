import { Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { EventService } from './event-page/event.service';
import { EventComponent } from './event.component';
import { SearchResultsPageComponent } from './search-results-page/search-results-page.component';

export const eventRoutes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchResultsPageComponent,
      },
      {
        path: ':eventId',
        component: EventPageComponent,
        providers: [EventService]
      },
    ]
  },
];
