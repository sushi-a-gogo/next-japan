import { Component, DestroyRef, effect, ElementRef, HostListener, inject, OnInit, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventSearchService } from '@app/services/event-search.service';
import { debounceTime, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-search-autocomplete',
  imports: [ReactiveFormsModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss',
})
export class SearchAutocompleteComponent implements OnInit {

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.visible) {
        this.eventSearchService.toggleSearchMode();
      }
    }
  }

  searchQuery = new FormControl({ value: '', disabled: true });
  filteredEvents: EventData[] = [];
  selectedValue?: string;
  visible = false;

  private searchInput = viewChild<ElementRef>('searchInput');
  private trigger = viewChild<MatAutocompleteTrigger>('autocompleteInput');
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private eventSearchService = inject(EventSearchService);

  constructor() {
    effect(() => {
      const enabled = this.eventSearchService.searchMode();
      if (enabled) {
        setTimeout(() => {
          this.searchQuery.enable({ emitEvent: false });
          const query = this.route.snapshot.queryParams['q'];
          if (query) {
            this.searchQuery.setValue(query, { emitEvent: false });
          }
          this.searchInput()?.nativeElement.focus();
          this.visible = true;
        }, 200);
      } else {
        this.visible = false;
        setTimeout(() => {
          this.searchQuery.disable({ emitEvent: false });
          this.searchQuery.setValue('', { emitEvent: false });
          this.filteredEvents = [];
          setTimeout(() => {
            this.selectedValue = undefined;
          }, 200);
        }, 200);
      }
    })
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (this.visible) {
          this.eventSearchService.toggleSearchMode();
        }
      });

    this.searchQuery.valueChanges.pipe(
      debounceTime(300),
      filter(() => !this.selectedValue),
      switchMap(query => {
        if (query && query?.length > 2) {
          return this.eventSearchService.searchAllEvents$(query);
        }
        return of([]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(events => {
      this.filteredEvents = events;
    });
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
