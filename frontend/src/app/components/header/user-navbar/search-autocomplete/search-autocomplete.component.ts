import { Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EventService } from '@app/pages/event/event.service';
import { EventData } from '@app/pages/event/models/event-data.model';
import { debounceTime, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-autocomplete',
  imports: [ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss',
  providers: [EventService]
})
export class SearchAutocompleteComponent implements OnInit {
  searchQuery = new FormControl('');
  filteredEvents: EventData[] = [];

  private trigger = viewChild<MatAutocompleteTrigger>('autocompleteInput');
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private eventService = inject(EventService);

  ngOnInit() {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        const query = this.route.snapshot.queryParams['q'];
        this.searchQuery.setValue(query, { emitEvent: false });
        this.filteredEvents = [];
      });

    this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      switchMap(query => this.eventService.searchEvents$(query || '')),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(events => {
      this.filteredEvents = events;
    });
  }

  search() {
    this.trigger()?.closePanel();
    this.router.navigate([`/event/search`], { queryParams: { q: this.searchQuery.value } });
  }

  onSearchInput() {
    // Optional: Add logic for input changes if needed
  }

  onOptionSelected(event: any) {
    const val = event.option.value;
    const selectedEvent = this.filteredEvents.find(e => e.eventTitle === val);
    if (selectedEvent) {
      // Navigate to event page or handle selection
      console.log('Selected:', selectedEvent);
      this.router.navigate([`/event/${selectedEvent.eventId}`]);
    }
  }
}
