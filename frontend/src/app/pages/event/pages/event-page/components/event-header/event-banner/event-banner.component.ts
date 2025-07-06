import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '@app/pages/event/event.service';
import { DisplayCountPipe } from "@app/pipes/display-count.pipe";
import { ImageService } from '@app/services/image.service';

@Component({
  selector: 'app-event-banner',
  imports: [NgOptimizedImage, DatePipe, MatIconModule, DisplayCountPipe],
  templateUrl: './event-banner.component.html',
  styleUrl: './event-banner.component.scss'
})
export class EventBannerComponent {
  private eventService = inject(EventService);
  private imageService = inject(ImageService);

  event = this.eventService.event;
  eventLocations = this.eventService.eventLocations;
  locationCount = computed(() => this.eventLocations().length);
  resizedImage = computed(() => this.event() ?
    this.imageService.resizeImage(this.event()!.image, this.event()!.image.width, this.event()!.image.height)
    : null);
  imageLoaded = signal<boolean>(false);

  //'event-banner-default.png';
  multiDayEvent = computed(() => {
    const minDate = this.event()?.minDate;
    const maxDate = this.event()?.maxDate;
    return minDate && maxDate ?
      new Date(minDate!).toDateString() !== new Date(maxDate!).toDateString() : false;
  });

  onImageLoad() {
    this.imageLoaded.set(true);
  }
}
