import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';
import { EventRegistrationsComponent } from './event-registrations/event-registrations.component';
import { UserComponent } from './user.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'registrations',
        pathMatch: 'full'
      },
      {
        path: 'registrations',
        component: EventRegistrationsComponent,
        canActivate: [authGuard]
      },
    ]
  },
];
