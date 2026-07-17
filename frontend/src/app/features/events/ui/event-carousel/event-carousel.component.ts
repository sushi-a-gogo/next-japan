import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, input, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventData } from '@app/features/events/models/event-data.model';
import { map } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [EventCardComponent],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventCarouselComponent {
  private platformId = inject(PLATFORM_ID);
  private breakpointObserver = inject(BreakpointObserver);

  events = input<EventData[]>([]);
  sortedEvents = computed(() => {
    const sorted = [...this.events().sort(this.sortByDate)];
    return sorted
  });
  ssrMode = computed(() => !isPlatformBrowser(this.platformId));
  showIndicators = toSignal(
    this.breakpointObserver.observe(['(min-width: 768px)']).pipe(
      map(result => result.matches)
    ),
    { initialValue: isPlatformBrowser(this.platformId) ? this.breakpointObserver.isMatched('(min-width: 768px)') : false }
  );
  hideCarousel = toSignal(
    this.breakpointObserver.observe(['(min-width: 2500px)']).pipe(
      map(result => result.matches)
    ),
    { initialValue: isPlatformBrowser(this.platformId) ? this.breakpointObserver.isMatched('(min-width: 2500px)') : false }
  );

  autoplayConfig = { delay: 6000, disableOnInteraction: true };
  paginationConfig = { clickable: true };
  breakpoints = {
    740: { slidesPerView: 2, slidesPerGroup: 2 },
    1024: { slidesPerView: 3, slidesPerGroup: 3 },
  };

  private sortByDate(a: EventData, b: EventData) {
    const dateA = a.nextCalendarDate ? new Date(a.nextCalendarDate?.startDate) : null;
    const dateB = b.nextCalendarDate ? new Date(b.nextCalendarDate?.startDate) : null;
    if (!dateA && !dateB) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (!dateA) {
      return 1;
    }

    if (!dateB) {
      return -1;
    }

    return dateA.getTime() - dateB.getTime();
  }
}
