import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { UserComponent } from './user.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfilePageComponent,
        canActivate: [authGuard]
      }
    ]
  },
];
