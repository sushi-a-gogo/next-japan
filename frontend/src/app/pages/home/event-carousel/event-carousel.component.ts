import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EventData } from '@app/pages/event/models/event-data.model';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { OrganizationService } from '@app/services/organization.service';
import { forkJoin } from 'rxjs';
import { EventCardComponent } from "./event-card/event-card.component";

const EventCarouselBreakpoints = {
  small: '(max-width: 739.98px)',
  medium: '(min-width: 740px) and (max-width: 1099.98px)',
  large: '(min-width: 1100px)',
};

@Component({
  selector: 'app-event-carousel',
  imports: [MatIconModule, MatRippleModule, MatTabsModule, EventCardComponent],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss'
})
export class EventCarouselComponent implements OnInit {
  events = signal<EventData[]>([]);
  loaded = signal<boolean>(false);
  hasError = signal<boolean>(false);

  carouselIndex = 0;
  slides: { events: (EventData | null)[] }[] = [];

  private eventCountPerSlide = 0;

  private eventCountPerSlideMap = new Map([
    [EventCarouselBreakpoints.small, 1],
    [EventCarouselBreakpoints.medium, 2],
    [EventCarouselBreakpoints.large, 3],
  ]);

  private organizationService = inject(OrganizationService);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
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

    const observables = {
      events: this.organizationService.getEvents$(),
      opportunities: this.organizationService.getNextOpportunities$(),
    };
    forkJoin(observables).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.events.set(res.events);
        this.configureEvents(res.opportunities);
      },
      error: () => {
        this.loaded.set(true);
        this.hasError.set(true);
      },
      complete: () => {
        this.loaded.set(true);
      }
    });
  }

  showPrevSlide() {
    this.carouselIndex = this.carouselIndex - 1;
  }

  showNextSlide() {
    this.carouselIndex = this.carouselIndex + 1;
  }

  private configureEvents(opportunities: EventOpportunity[]) {
    this.events().forEach((event) => {
      const eventOpportunities = opportunities
        .filter((o) => o.eventId === event.eventId)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

      event.nextOpportunityDate = eventOpportunities.length > 0 ? eventOpportunities[0] : undefined;
    });

    this.configureSlides();
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
