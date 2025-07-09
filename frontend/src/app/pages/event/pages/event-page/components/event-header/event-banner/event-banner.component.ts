import { DatePipe, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { EventService } from '@app/pages/event/event.service';
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

  event = this.eventService.event;
  eventLocations = this.eventService.eventLocations;
  eventOpportunities = this.eventService.eventOpportunities;

  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  locationCount = computed(() => this.eventLocations().length);

  resizedImage = computed(() => {
    const image = this.event() && isPlatformBrowser(this.platformId) ? this.event()!.image : null;
    return image ?
      this.imageService.resizeImage(image, image?.width, image?.height) : null;
  });

  imageLoaded = signal<boolean>(false);

  eventDateRange = computed(() => {
    const opportunities = this.eventOpportunities();
    if (opportunities.length) {
      const minDate = opportunities[0].startDate;
      const maxDate = opportunities.length > 1 ? opportunities[opportunities.length - 1].startDate : undefined;
      return {
        minDate, maxDate
      };
    }

    return null;
  });

  onImageLoad() {
    this.imageLoaded.set(true);
  }
}
