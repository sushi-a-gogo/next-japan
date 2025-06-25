import { Component, DestroyRef, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@app/pages/event/event.service';
import { EventInformation } from '@app/pages/event/models/event-information.model';
import { FooterComponent } from "@shared/footer/footer.component";
import { PageLoadSpinnerComponent } from "@shared/page-load-spinner/page-load-spinner.component";
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
  private destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    this.eventService.searchFullEvents(this.q() || '').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      this.events.set(events);
      this.loaded.set(true);
    })
  }
}
