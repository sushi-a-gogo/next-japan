import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventData } from '@app/models/event/event-data.model';
import { fromEvent } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';

const CARD_WIDTH = 325; // 315px card + 5px padding per side

const BreakpointsConfig = [
  { query: '(max-width: 767.98px)', eventsPerView: 1, viewportWidth: CARD_WIDTH + 40 },
  { query: '(min-width: 768px) and (max-width: 1119.98px)', eventsPerView: 2, viewportWidth: CARD_WIDTH * 2 + 35 },
  { query: '(min-width: 1120px)', eventsPerView: 3, viewportWidth: CARD_WIDTH * 3 },
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
  events = input.required<EventData[]>();
  sortedEvents = signal<EventData[]>([]);
  eventsPerView = signal(1);
  currentIndex = signal(0);
  viewportWidth = signal(CARD_WIDTH);

  ssrMode = computed(() => !isPlatformBrowser(this.platformId));

  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  get disablePrevButton() {
    return this.currentIndex() === 0;
  }
  get disableNextButton() {
    return this.currentIndex() >= this.events().length - this.eventsPerView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && isPlatformBrowser(this.platformId)) {
      this.sortedEvents.set([...this.events().sort(this.sortByDate)])
      this.setupBreakpoints();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scrollToIndex(this.currentIndex());
      this.setupScrollListener();
    }
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
        const newViewportWidth = activeBreakpoint?.viewportWidth ?? CARD_WIDTH;
        this.eventsPerView.set(newEventsPerView);
        this.viewportWidth.set(newViewportWidth);
        this.scrollToIndex(this.currentIndex());
      });
  }

  private setupScrollListener() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.carouselTrack.nativeElement, 'scroll')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const scrollLeft = this.carouselTrack.nativeElement.scrollLeft;
          const newIndex = Math.round(scrollLeft / CARD_WIDTH);
          if (newIndex !== this.currentIndex()) {
            this.currentIndex.set(newIndex);
          }
        });
    }
  }

  private scrollToIndex(index: number) {
    if (this.carouselTrack && isPlatformBrowser(this.platformId)) {
      const cardSlotWidth = CARD_WIDTH; // 315px card + 5px padding per side
      this.carouselTrack.nativeElement.scrollLeft = index * cardSlotWidth;
      this.currentIndex.set(index);
    }
  }

  scrollPrev() {
    const newIndex = Math.max(0, this.currentIndex() - this.eventsPerView());
    this.scrollToIndex(newIndex);
  }

  scrollNext() {
    const newIndex = Math.min(this.events().length - this.eventsPerView(), this.currentIndex() + this.eventsPerView());
    this.scrollToIndex(newIndex);
  }
}
