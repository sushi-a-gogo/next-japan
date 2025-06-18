import { Routes } from '@angular/router';
import { EventService } from '@app/event/event.service';
import { EventPageComponent } from './event-page.component';

export const eventRoutes: Routes = [
  {
    path: ':eventId',
    component: EventPageComponent,
    providers: [EventService],
  }
];
