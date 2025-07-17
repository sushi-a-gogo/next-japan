import { DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { EventService } from '@app/pages/event/event-page/event.service';
import { DisplayCountPipe } from "@app/pipes/display-count.pipe";
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-event-banner',
  imports: [NgOptimizedImage, DatePipe, DisplayCountPipe],
  templateUrl: './event-banner.component.html',
  styleUrl: './event-banner.component.scss'
})
export class EventBannerComponent {
  private eventService = inject(EventService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private eventData = this.eventService.eventData;

  event = computed(() => this.eventData().event);
  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  locationCount = computed(() => this.eventData().locations.length);

  resizedImage = computed(() => {
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
