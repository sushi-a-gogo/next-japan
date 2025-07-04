import { Routes } from '@angular/router';
import { aiEventGuard } from '@app/guards/ai-event.guard';
import { DreamComponent } from './dream.component';
import { AiEventBuilderComponent } from './pages/ai-event-builder/ai-event-builder.component';
import { AiEventComponent } from './pages/ai-event/ai-event.component';

export const dreamRoutes: Routes = [
  {
    path: '',
    component: DreamComponent,
    children: [
      {
        path: 'create',
        component: AiEventBuilderComponent
      },
      {
        path: 'event',
        component: AiEventComponent,
        canActivate: [aiEventGuard]
      },
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full'
      },
    ]
  }
];
