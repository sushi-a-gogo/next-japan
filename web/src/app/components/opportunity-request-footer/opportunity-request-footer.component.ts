import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthMockService } from '@app/services/auth-mock.service';
import { SelectionService } from '@app/services/selection.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-opportunity-request-footer',
  imports: [MatRippleModule],
  templateUrl: './opportunity-request-footer.component.html',
  styleUrl: './opportunity-request-footer.component.scss'
})
export class OpportunityRequestFooterComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthMockService);
  private selectionService = inject(SelectionService);
  private destroyed$ = new Subject<void>();

  isAuthenticated = this.auth.isAuthenticated;
  selected = this.selectionService.selectedOpportunities;


  constructor() {
    effect(() => {
      if (!this.isAuthenticated()) {
        this.selectionService.clearAllSelected();
      }
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.selectionService.clearAllSelected();
      });
  }

  ngOnDestroy(): void {
    this.selectionService.clearAllSelected();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openRegistrationDialog() {
    this.selectionService.showRegistration();
  }
}
