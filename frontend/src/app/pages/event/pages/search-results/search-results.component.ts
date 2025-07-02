import { Component, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { EventSearchService } from '@app/services/event-search.service';
import { OrganizationService } from '@app/services/organization.service';
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";
import { forkJoin, of } from 'rxjs';
import { SearchCardComponent } from "./search-card/search-card.component";

@Component({
  selector: 'app-search-results',
  imports: [SearchCardComponent, PageLoadSpinnerComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnChanges {
  q = input<string>()
  events = signal<EventInformation[]>([]);
  loaded = signal(false);

  private eventService = inject(EventSearchService);
  private organizationService = inject(OrganizationService);
  private destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    const qChange = changes['q'];
    if (!qChange) {
      return;
    }

    const observables = {
      events: of<EventInformation[]>([]),
      opportunities: of<EventOpportunity[]>([])
    };

    const query = this.q() && this.q()!.length > 2 ? this.q() : '';
    if (query) {
      observables.events = this.eventService.searchFullEvents(query);
      observables.opportunities = this.organizationService.getNextOpportunities$();

    }

    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        const events = res.events;
        events.forEach((event) => {
          const opportunities = res.opportunities.sort(this.sortByDate).filter((o) => o.eventId === event.eventId);
          event.nextOpportunityDate = opportunities.length ? opportunities[0] : undefined;
        });
        this.events.set(events);
      },
      error: () => {
        this.loaded.set(true);
      },
      complete: () => {
        this.loaded.set(true);
      }
    });

  }

  private sortByDate(a: EventOpportunity, b: EventOpportunity) {
    return new Date(a.startDate) < new Date(b.startDate) ? -1 : 1;
  }
}
