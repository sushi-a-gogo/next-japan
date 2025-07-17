import { Routes } from '@angular/router';
import { aiEventGuard } from '@app/guards/ai-event.guard';
import { AiEventDesignerPageComponent } from './ai-event-designer-page/ai-event-designer-page.component';
import { AiEventPageComponent } from './ai-event-page/ai-event-page.component';
import { AiComponent } from './ai.component';

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
