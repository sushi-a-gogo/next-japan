import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventData } from '@app/models/event/event-data.model';
import { fromEvent } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';

const CARD_WIDTH = 325; // 315px card + 5px padding per side

const BreakpointsConfig = [
  { query: '(max-width: 689.98px)', eventsPerView: 1 },
  { query: '(min-width: 690px) and (max-width: 1014.98px)', eventsPerView: 2 },
  { query: '(min-width: 1015px) and (max-width: 1339.98px)', eventsPerView: 3 },
  { query: '(min-width: 1340px) and (max-width: 1664.98px)', eventsPerView: 4 },
  { query: '(min-width: 1665px) and (max-width: 1989.98px)', eventsPerView: 5 },
  { query: '(min-width: 1990px) and (max-width: 2314.98px)', eventsPerView: 6 },
  { query: '(min-width: 2315px) and (max-width: 2500px)', eventsPerView: 7 },
];

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss',
})
export class EventCarouselComponent implements OnChanges, AfterViewInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  events = input<EventData[]>([])
  sortedEvents = signal<EventData[]>([]);
  eventsLoaded = signal<boolean>(false);
  eventsPerView = signal(1);
  currentIndex = signal(0);

  ssrMode = computed(() => !isPlatformBrowser(this.platformId));

  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  disablePrevButton = computed(() => this.currentIndex() === 0);
  disableNextButton = computed(() => this.currentIndex() >= this.sortedEvents().length - this.eventsPerView());

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.sortedEvents.set([...this.events().sort(this.sortByDate)])
      setTimeout(() => this.eventsLoaded.set(this.events().length > 0));
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupBreakpoints();
      this.scrollToIndex(this.currentIndex());
      this.setupScrollListener();
    }
  }

  scrollPrev() {
    const newIndex = Math.max(0, this.currentIndex() - this.eventsPerView());
    this.scrollToIndex(newIndex);
  }

  scrollNext() {
    const newIndex = Math.min(this.sortedEvents().length - this.eventsPerView(), this.currentIndex() + this.eventsPerView());
    this.scrollToIndex(newIndex);
  }

  private sortByDate(a: EventData, b: EventData) {
    const dateA = a.nextOpportunityDate ? new Date(a.nextOpportunityDate?.startDate) : null;
    const dateB = b.nextOpportunityDate ? new Date(b.nextOpportunityDate?.startDate) : null;
    if (!dateA) {
      return 1;
    }
    if (!dateB) {
      return -1;
    }
    return dateA.getTime() - dateB.getTime();
  }

  private setupBreakpoints() {
    this.breakpointObserver
      .observe(BreakpointsConfig.map((bp) => bp.query))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        const activeBreakpoint = BreakpointsConfig.find((bp) => result.breakpoints[bp.query]);
        const newEventsPerView = activeBreakpoint?.eventsPerView ?? 1;
        this.eventsPerView.set(newEventsPerView);
        if (newEventsPerView === 1) {
          this.currentIndex.set(1);
        }
        this.scrollToIndex(this.currentIndex());
      });
  }

  private setupScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.carouselTrack.nativeElement, 'scroll')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const scrollLeft = this.carouselTrack.nativeElement.scrollLeft;
          const newIndex = Math.ceil(scrollLeft / CARD_WIDTH);
          if (newIndex !== this.currentIndex()) {
            this.currentIndex.set(newIndex);
          }
        });
    }
  }

  private scrollToIndex(index: number) {
    if (this.carouselTrack && isPlatformBrowser(this.platformId)) {
      const cardSlotWidth = CARD_WIDTH;
      this.carouselTrack.nativeElement.scrollLeft = index * cardSlotWidth;
      this.currentIndex.set(index);
    }
  }
}
