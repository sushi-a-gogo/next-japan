import { Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventPageService } from './pages/event-page/event-page.service';
import { SearchResultsPageComponent } from './pages/search-results-page/search-results-page.component';

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
        path: 'search',
        component: SearchResultsPageComponent,
      },
      {
        path: ':eventId',
        component: EventPageComponent,
        providers: [EventPageService]
      },
    ]
  },
];
