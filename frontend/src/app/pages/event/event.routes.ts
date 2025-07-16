import { Routes } from '@angular/router';
import { EventsService } from '@app/services/events.service';
import { EventComponent } from './event.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventService } from './pages/event-page/event.service';
import { SearchResultsComponent } from './pages/search-results/search-results.component';

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
        component: SearchResultsComponent,
        providers: [EventsService]
      },
      {
        path: ':eventId',
        component: EventPageComponent,
        providers: [EventService]
      },
    ]
  },
];
