import { Routes } from '@angular/router';
import { DreamComponent } from './dream.component';

export const dreamRoutes: Routes = [
  {
    path: 'create',
    component: DreamComponent,
    providers: [],
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  },

];
