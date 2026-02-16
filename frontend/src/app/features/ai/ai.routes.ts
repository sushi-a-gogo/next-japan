import { Routes } from '@angular/router';
import { aiEventGuard } from '@app/features/ai/ai-event.guard';
import { AiComponent } from './ai.component';
import { AiEventDesignerPageComponent } from './pages/ai-event-designer-page/ai-event-designer-page.component';
import { AiEventPageComponent } from './pages/ai-event-page/ai-event-page.component';

export const aiRoutes: Routes = [
  {
    path: '',
    component: AiComponent,
    children: [
      {
        path: 'create',
        component: AiEventDesignerPageComponent
      },
      {
        path: 'event',
        component: AiEventPageComponent,
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
