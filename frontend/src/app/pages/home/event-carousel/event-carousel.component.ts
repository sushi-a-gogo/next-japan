import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventData } from '@app/models/event/event-data.model';
import { CarouselModule } from 'primeng/carousel';
import { map } from 'rxjs';
import { EventCardComponent } from './event-card/event-card.component';

@Component({
  selector: 'app-event-carousel',
  standalone: true,
  imports: [EventCardComponent, CarouselModule],
  templateUrl: './event-carousel.component.html',
  styleUrl: './event-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  responsiveOptions = [
    { breakpoint: '739.98px', numVisible: 1, numScroll: 1 },
    { breakpoint: '1023.98px', numVisible: 2, numScroll: 2 },
    { breakpoint: '1339.98px', numVisible: 3, numScroll: 3 },
    { breakpoint: '1664.98px', numVisible: 3, numScroll: 3 },
    { breakpoint: '1989.98px', numVisible: 3, numScroll: 3 },
    { breakpoint: '2314.98px', numVisible: 3, numScroll: 3 },
    { breakpoint: '2500px', numVisible: 3, numScroll: 3 },
  ];

  private sortByDate(a: EventData, b: EventData) {
    const dateA = a.nextOpportunityDate ? new Date(a.nextOpportunityDate?.startDate) : null;
    const dateB = b.nextOpportunityDate ? new Date(b.nextOpportunityDate?.startDate) : null;
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
