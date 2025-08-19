import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { EventService } from '@app/pages/events/event-page/event.service';
import { DisplayCountPipe } from "@app/pipes/display-count.pipe";
import { DateTimeService } from '@app/services/date-time.service';
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-event-hero',
  imports: [NgOptimizedImage, DisplayCountPipe],
  templateUrl: './event-hero.component.html',
  styleUrl: './event-hero.component.scss',

})
export class EventHeroComponent {
  private dateTimeService = inject(DateTimeService);
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
      const startDate = opportunities[0].startDate;
      const formattedStartDate = this.dateTimeService.formatDateInLocaleTime(new Date(startDate), 'mediumDate', opportunities[0].timeZone);

      const endDate = opportunities.length > 1 ? opportunities[opportunities.length - 1].startDate : undefined;
      if (endDate) {
        const formattedEndDate = this.dateTimeService.formatDateInLocaleTime(new Date(endDate), 'mediumDate', opportunities[0].timeZone);
        return `${formattedStartDate} - ${formattedEndDate}`;
      }

      return `${formattedStartDate}`;
    }

    return null;
  });
}
