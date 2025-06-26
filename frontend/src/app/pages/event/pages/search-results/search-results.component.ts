import { Component, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@app/pages/event/event.service';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { OrganizationService } from '@app/services/organization.service';
import { FooterComponent } from "@shared/footer/footer.component";
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";
import { forkJoin } from 'rxjs';
import { EventOpportunity } from '../../models/event-opportunity.model';
import { SearchCardComponent } from "./search-card/search-card.component";

@Component({
  selector: 'app-search-results',
  imports: [FooterComponent, SearchCardComponent, PageLoadSpinnerComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnChanges {
  q = input<string>()
  events = signal<EventInformation[]>([]);
  loaded = signal(false);

  private eventService = inject(EventService);
  private organizationService = inject(OrganizationService);
  private destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    this.eventService.searchFullEvents(this.q() || '').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      this.events.set(events);
      this.loaded.set(true);
    });

    const observables = {
      events: this.eventService.searchFullEvents(this.q() || ''),
      opportunities: this.organizationService.getNextOpportunities$(),
    };
    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        const events = res.events;
        events.forEach((event) => {
          const opportunities = res.opportunities.sort(this.sortByDate).filter((o) => o.eventId === event.eventId);
          event.nextOpportunity = opportunities.length ? opportunities[0] : undefined;
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
