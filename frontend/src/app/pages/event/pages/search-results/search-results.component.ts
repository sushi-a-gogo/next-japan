import { Component, DestroyRef, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterComponent } from "@shared/footer/footer.component";
import { EventService } from '../../event.service';
import { EventInformation } from '../../models/event-information.model';
import { SearchCardComponent } from "./search-card/search-card.component";

@Component({
  selector: 'app-search-results',
  imports: [FooterComponent, SearchCardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnChanges {
  q = input<string>()
  events = signal<EventInformation[]>([]);
  loaded = signal(false);

  private eventService = inject(EventService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.eventService.searchFullEvents(this.q() || '').pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      this.events.set(events);
      this.loaded.set(true);
    })
  }
}
