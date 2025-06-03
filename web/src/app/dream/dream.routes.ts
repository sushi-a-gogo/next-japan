import { Routes } from '@angular/router';
import { DreamComponent } from './dream.component';
import { DreamPageComponent } from './pages/dream-page/dream-page.component';

export const dreamRoutes: Routes = [
  {
    path: 'create',
    component: DreamComponent,
    providers: [],
  },
  {
    path: ':eventId',
    component: DreamPageComponent,
    providers: [],
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  },

];
