import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { EventService } from '@app/pages/events/event-page/event.service';
import { DisplayCountPipe } from "@app/pipes/display-count.pipe";
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-event-hero',
  imports: [NgOptimizedImage, DatePipe, DisplayCountPipe],
  templateUrl: './event-hero.component.html',
  styleUrl: './event-hero.component.scss',
  animations: [
    trigger('fadeSlideIn', [
      state('void', style({
        transform: 'translateY(20px)'
      })),
      state('in', style({
        transform: 'translateY(0)'
      })),
      transition('void => in', [
        animate('400ms ease-in-out')
      ])
    ])
  ],
  host: { '[@fadeSlideIn]': 'in' }

})
export class EventHeroComponent {
  private eventService = inject(EventService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private eventData = this.eventService.eventData;

  event = computed(() => this.eventData().event);
  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  locationCount = computed(() => this.eventData().locations.length);

  bannerImage = computed(() => {
    const ev = this.event();
    const image = ev && isPlatformBrowser(this.platformId) ? ev!.image : null;
    return image ?
      this.imageService.resizeImage(image, image?.width, image?.height) : null;
  });

  eventDateRange = computed(() => {
    const opportunities = this.eventData().opportunities;
    if (opportunities.length) {
      const minDate = opportunities[0].startDate;
      const maxDate = opportunities.length > 1 ? opportunities[opportunities.length - 1].startDate : undefined;
      return {
        minDate, maxDate
      };
    }

    return null;
  });
}
