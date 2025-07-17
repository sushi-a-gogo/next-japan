import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AiService } from '@app/services/ai.service';

export const aiEventGuard: CanActivateFn = (route, state) => {
  const aiService = inject(AiService);
  const router = inject(Router);
  if (aiService.aiEvent()) {
    return true;
  }
  return router.navigate(["/ai/create"]);
};
