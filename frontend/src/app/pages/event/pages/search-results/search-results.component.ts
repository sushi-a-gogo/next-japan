import { Component, DestroyRef, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { EventSearchService } from '@app/services/event-search.service';
import { MetaService } from '@app/services/meta.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";
import { forkJoin, of } from 'rxjs';
import { SearchCardComponent } from "./search-card/search-card.component";

@Component({
  selector: 'app-search-results',
  imports: [SearchCardComponent, PageLoadSpinnerComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnChanges {
  q = input<string>()
  events = signal<EventData[]>([]);
  loaded = signal(false);

  private title = inject(Title);
  private meta = inject(MetaService);
  private eventSearchService = inject(EventSearchService);
  private opportunityService = inject(OpportunityService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.title.setTitle("Search Results");
    const description = "Browse events matching your search on Next Japan. Find upcoming opportunities and details for each event.";
    this.meta.updateTags(this.title.getTitle(), description);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const qChange = changes['q'];
    if (!qChange) {
      return;
    }

    const observables = {
      events: of<EventData[]>([]),
      opportunities: of<EventOpportunity[]>([])
    };

    const query = this.q() && this.q()!.length > 2 ? this.q() : '';
    if (query) {
      observables.events = this.eventSearchService.searchEvents$(query);
      observables.opportunities = this.opportunityService.getOpportunities$();
    }

    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        const events = res.events;
        events.forEach((event) => {
          const opportunities = res.opportunities.filter((o) => o.eventId === event.eventId).sort(this.sortByDate);
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
