import { AfterViewInit, Component, DestroyRef, effect, ElementRef, HostListener, inject, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { EventSearchService } from '@app/features/events/services/event-search.service';
import { EventData } from '@features/events/models/event-data.model';
import { debounceTime, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-event-search-autocomplete',
  imports: [ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './event-search-autocomplete.component.html',
  styleUrl: './event-search-autocomplete.component.scss',
  host: {
    '[class.show]': 'isComponentActive()',
    '[class.open]': 'isOpen()'
  }
})
export class EventSearchAutocompleteComponent implements OnInit, AfterViewInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isOpen() && event.key === 'Escape') {
      this.eventSearchService.toggleSearchMode();
    }
  }

  searchQuery = new FormControl('');
  filteredEvents = signal<EventData[]>([]);
  selectedValue?: string;
  isComponentActive = signal<boolean>(false);

  isOpen = signal<boolean>(false);
  private searchInput = viewChild<ElementRef>('searchInput');
  private trigger = viewChild<MatAutocompleteTrigger>('autocompleteInput');
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private eventSearchService = inject(EventSearchService);

  constructor() {
    effect(() => {
      const inSearchMode = this.eventSearchService.searchMode();
      if (inSearchMode) {
        this.isComponentActive.set(true);
        setTimeout(() => {
          this.isOpen.set(true);
          this.searchInput()?.nativeElement.click();
        }, 100);
      } else {
        this.isOpen.set(false);
        setTimeout(() => this.isComponentActive.set(false), 10);
      }
    });
  }

  ngOnInit() {
    const query = this.route.snapshot.queryParams['q'];
    if (query) {
      this.searchQuery.setValue(query, { emitEvent: false });
    }

    this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      filter(() => !this.selectedValue),
      switchMap(query => {
        if (query && query?.length > 2) {
          return this.eventSearchService.searchEvents$(query);
        }
        return of([]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(events => {
      this.filteredEvents.set(events);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput()?.nativeElement.click();
    }, 100)
  }

  search() {
    this.trigger()?.closePanel();
    this.router.navigate([`/event/search`], { queryParams: { q: this.searchQuery.value } });
  }

  onOptionSelected(event: any) {
    this.selectedValue = event.option.value;
    const selectedEvent = this.filteredEvents().find(e => e.eventTitle === this.selectedValue);
    if (selectedEvent) {
      // Navigate to event page
      this.router.navigate([`/event/${selectedEvent.eventId}`]);
    }
  }
}
