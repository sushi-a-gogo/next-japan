import { Routes } from '@angular/router';
import { EventService } from '@app/pages/event/event.service';
import { EventComponent } from './event.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
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
        providers: [EventService],
      },
      {
        path: ':eventId',
        component: EventPageComponent,
        providers: [EventService],
      },
    ]
  },
];
