import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventCardComponent } from './event-card/event-card.component';

const CARD_WIDTH = 315;

const BreakpointsConfig = [
  { query: '(max-width: 819.98px)', eventsPerView: 1, viewportWidth: CARD_WIDTH },
  { query: '(min-width: 820px) and (max-width: 1199.98px)', eventsPerView: 2, viewportWidth: CARD_WIDTH * 2 },
  { query: '(min-width: 1200px)', eventsPerView: 3, viewportWidth: CARD_WIDTH * 3 },
];

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [ScrollingModule, EventCardComponent],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss',
})
export class EventCarouselComponent implements OnChanges, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  events = input.required<EventData[]>();
  showCarousel = signal(false);
  eventsPerView = signal(1);
  currentIndex = signal(0);
  itemSize = signal(CARD_WIDTH);
  viewportWidth = signal(CARD_WIDTH);
  itemWidth = signal(`${CARD_WIDTH}px`);

  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  get disablePrevButton() {
    return this.currentIndex() === 0;
  }
  get disableNextButton() {
    return this.currentIndex() >= this.events().length - this.eventsPerView();
  }

  trackByEventId(index: number, event: EventData): string {
    return event?.eventId ?? 'index-' + index;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && isPlatformBrowser(this.platformId)) {
      console.log('Events received:', this.events().length);
      this.setupBreakpoints();
      this.showCarousel.set(this.events().length > 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Viewport initialized:', !!this.viewport);
      setTimeout(() => this.scrollToIndex(this.currentIndex()), 0);
    }
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
        //this.itemWidth.set(`${100 / newEventsPerView}%`);
        console.log('Breakpoint:', {
          eventsPerView: newEventsPerView,
          viewportWidth: newViewportWidth,
          itemSize: this.itemSize(),
          itemWidth: this.itemWidth(),
        });
        setTimeout(() => this.scrollToIndex(this.currentIndex()), 0);
      });
  }

  private scrollToIndex(index: number) {
    if (this.viewport) {
      console.log('Scrolling to index:', index);
      this.viewport.scrollTo({ left: index * this.itemSize(), behavior: 'smooth' });
      this.currentIndex.set(index);
    }
  }

  scrollPrev() {
    const newIndex = Math.max(0, this.currentIndex() - this.eventsPerView());
    console.log('Scroll Prev:', { currentIndex: this.currentIndex(), newIndex });
    this.scrollToIndex(newIndex);
  }

  scrollNext() {
    const newIndex = Math.min(this.events().length - this.eventsPerView(), this.currentIndex() + this.eventsPerView());
    console.log('Scroll Next:', { currentIndex: this.currentIndex(), newIndex });
    this.scrollToIndex(newIndex);
  }
}
