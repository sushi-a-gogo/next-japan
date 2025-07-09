import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, input, OnChanges, PLATFORM_ID, signal, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventCardComponent } from "./event-card/event-card.component";

const EventCarouselBreakpoints = {
  small: '(max-width: 819.98px)',
  medium: '(min-width: 820px) and (max-width: 1199.98px)',
  large: '(min-width: 1200px)',
};

@Component({
  selector: 'app-event-carousel',
  imports: [MatIconModule, MatRippleModule, MatTabsModule, EventCardComponent],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss'
})
export class EventCarouselComponent implements OnChanges {
  events = input.required<EventData[]>();
  showCarousel = signal(false);
  carouselIndex = 0;
  slides: { events: (EventData | null)[] }[] = [];

  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  private eventCountPerSlideMap = new Map([
    [EventCarouselBreakpoints.small, 1],
    [EventCarouselBreakpoints.medium, 2],
    [EventCarouselBreakpoints.large, 3],
  ]);
  private eventCountPerSlide = 0;
  private breakpointObserver = inject(BreakpointObserver);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && isPlatformBrowser(this.platformId)) {
      this.setupCarousel();
    }
  }

  private setupCarousel() {
    this.breakpointObserver
      .observe([EventCarouselBreakpoints.small, EventCarouselBreakpoints.medium, EventCarouselBreakpoints.large])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        for (const size of Object.keys(result.breakpoints)) {
          if (result.breakpoints[size]) {
            const count = this.eventCountPerSlideMap.get(size) ?? 1;
            if (count !== this.eventCountPerSlide) {
              this.eventCountPerSlide = count;
              this.configureSlides();
            }
          }
        }
      });

    this.configureSlides();
    this.showCarousel.set(true);
  }

  showPrevSlide() {
    this.carouselIndex = this.carouselIndex - 1;
  }

  showNextSlide() {
    this.carouselIndex = this.carouselIndex + 1;
  }

  private configureSlides() {
    const newSlides = [];
    const slideCount = Math.ceil(this.events().length / this.eventCountPerSlide);

    let startIndex = 0;
    for (let i = 0; i < slideCount; i++) {
      const slide: { events: (EventData | null)[] } = {
        events: this.events().slice(startIndex, startIndex + this.eventCountPerSlide),
      };

      const diff = this.eventCountPerSlide - slide.events.length;
      if (diff > 0 && slideCount > 1) {
        const placeholders = new Array(diff).fill(null);
        slide.events.push(...placeholders);
      }

      newSlides.push(slide);
      startIndex = startIndex + this.eventCountPerSlide;
    }

    const firstVisibleEventId = this.slides.length > 0 ? this.slides[this.carouselIndex].events[0]?.eventId : undefined;
    this.slides = newSlides;
    this.carouselIndex = firstVisibleEventId
      ? newSlides.findIndex((slide) => slide.events.find((e) => e?.eventId === firstVisibleEventId))
      : 0;
  }
}
