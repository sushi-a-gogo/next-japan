import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventData } from '@app/models/event/event-data.model';
import { EventsService } from '@app/services/events.service';
import { OpportunityService } from '@app/services/opportunity.service';
import { forkJoin, fromEvent, map } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';

const CARD_WIDTH = 325; // 315px card + 5px padding per side

// const BreakpointsConfig = [
//   { query: '(max-width: 767.98px)', eventsPerView: 1, viewportWidth: CARD_WIDTH + 40 },
//   { query: '(min-width: 768px) and (max-width: 1119.98px)', eventsPerView: 2, viewportWidth: CARD_WIDTH * 2 + 35 },
//   { query: '(min-width: 1120px)', eventsPerView: 3, viewportWidth: CARD_WIDTH * 3 },
// ];
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
export class EventCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  sortedEvents = signal<EventData[]>([]);
  eventsPerView = signal(1);
  currentIndex = signal(0);

  eventsLoaded = signal(false);

  ssrMode = computed(() => !isPlatformBrowser(this.platformId));

  private eventsService = inject(EventsService);
  private opportunityService = inject(OpportunityService);


  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  disablePrevButton = computed(() => this.currentIndex() === 0);
  disableNextButton = computed(() => this.currentIndex() >= this.sortedEvents().length - this.eventsPerView());

  ngOnInit(): void {
    this.fetchEvents$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((events) => {
      this.sortedEvents.set([...events.sort(this.sortByDate)])
      this.eventsLoaded.set(true);
    })
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

  private fetchEvents$() {
    const observables = {
      events: this.eventsService.get$(),
      opportunities: this.opportunityService.getOpportunities$(),
    };

    return forkJoin(observables).pipe(
      map((res) => {
        const events = res.events;
        events.forEach((event) => {
          const eventOpportunities = res.opportunities
            .filter((o) => o.eventId === event.eventId)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          event.nextOpportunityDate = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
        });
        return events;
      })
    );
  }
}
