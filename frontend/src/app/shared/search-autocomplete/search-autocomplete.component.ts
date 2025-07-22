import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { EventSearchService } from '@app/services/event-search.service';
import { debounceTime, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-autocomplete',
  imports: [ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ],
  host: { '[@fadeIn]': '' }

})
export class SearchAutocompleteComponent implements OnInit, AfterViewInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.eventSearchService.toggleSearchMode();
    }
  }

  searchQuery = new FormControl('');
  filteredEvents: EventData[] = [];
  selectedValue?: string;

  private searchInput = viewChild<ElementRef>('searchInput');
  private trigger = viewChild<MatAutocompleteTrigger>('autocompleteInput');
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private eventSearchService = inject(EventSearchService);

  ngOnInit() {
    const query = this.route.snapshot.queryParams['q'];
    if (query) {
      this.searchQuery.setValue(query, { emitEvent: false });
    }

    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.eventSearchService.toggleSearchMode();
      });

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
      this.filteredEvents = events;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput()?.nativeElement.click();
    }, 100)
  }

  search() {
    this.trigger()?.closePanel();
    this.eventSearchService.clearSearchMode();
    setTimeout(() => {
      this.router.navigate([`/event/search`], { queryParams: { q: this.searchQuery.value } });
    });
  }

  onOptionSelected(event: any) {
    this.selectedValue = event.option.value;
    console.log('onOptionSelected: ' + this.selectedValue);
    const selectedEvent = this.filteredEvents.find(e => e.eventTitle === this.selectedValue);
    if (selectedEvent) {
      // Navigate to event page
      this.eventSearchService.clearSearchMode();
      setTimeout(() => {
        this.router.navigate([`/event/${selectedEvent.eventId}`]);
      })
    }
  }
}
