import { Routes } from '@angular/router';
import { authGuard } from '@app/core/auth/auth.guard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserComponent } from './user.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        canActivate: [authGuard]
      }
    ]
  },
];
