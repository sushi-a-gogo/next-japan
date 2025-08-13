import { AfterViewInit, Component, DestroyRef, effect, ElementRef, HostBinding, HostListener, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { EventSearchService } from '@app/services/event-search.service';
import { debounceTime, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-autocomplete',
  imports: [ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss'
})
export class SearchAutocompleteComponent implements OnInit, AfterViewInit {
  @HostBinding('class.show') show = false;
  @HostBinding('class.open') open = false;

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

  constructor() {
    effect(() => {
      const inSearchMode = this.eventSearchService.searchMode();
      if (inSearchMode) {
        this.show = true;
        setTimeout(() => {
          this.open = true;
          this.searchInput()?.nativeElement.click();
        }, 100);
      } else {
        this.open = false;
        setTimeout(() => this.show = false, 10);
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
    this.router.navigate([`/event/search`], { queryParams: { q: this.searchQuery.value } });
  }

  onOptionSelected(event: any) {
    this.selectedValue = event.option.value;
    console.log('onOptionSelected: ' + this.selectedValue);
    const selectedEvent = this.filteredEvents.find(e => e.eventTitle === this.selectedValue);
    if (selectedEvent) {
      // Navigate to event page
      this.router.navigate([`/event/${selectedEvent.eventId}`]);
    }
  }
}
