// src/app/shared/visit-tracker/visit-tracker.component.ts
import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { VisitorService } from '@app/core/services/visitor.service';
import { environment } from '@environments/environment';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-visit-tracker',
  template: '', // invisible
  standalone: true,
})
export class VisitTrackerComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private visitorService = inject(VisitorService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && environment.enableVisitTracking) {
      // Log on every navigation (SPA routing)
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          switchMap(() => {
            const path = window.location.pathname + window.location.search;
            const referrer = document.referrer || null;
            return this.visitorService.logVisit$(path, referrer);
          })
        )
        .subscribe();
    }
  }
}
