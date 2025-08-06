import { Routes } from '@angular/router';
import { EventPageComponent } from './event-page/event-page.component';
import { EventService } from './event-page/event.service';
import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { EventsComponent } from './events.component';
import { SearchResultsPageComponent } from './search-results-page/search-results-page.component';

export const eventRoutes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'registrations',
        component: EventRegistrationsComponent,
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
