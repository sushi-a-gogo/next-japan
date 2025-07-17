import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventData } from '@app/models/event/event-data.model';
import { ImageService } from '@app/services/image.service';
import { OpportunityDateComponent } from "@shared/opportunity-date/opportunity-date.component";

@Component({
  selector: 'app-event-card',
  imports: [NgOptimizedImage, RouterLink, OpportunityDateComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  private platformId = inject(PLATFORM_ID);
  private imageService = inject(ImageService);

  event = input.required<EventData>();
  isGrokEvent = computed(() => this.event().aiProvider === 'Grok');
  resizedImage = computed(() => {
    if (isPlatformBrowser(this.platformId)) {
      const width = this.isGrokEvent() ? 342 : 448;
      return this.imageService.resizeImage(this.event().image, 448, 256)
    }
    return null;
  });

  routerLink = computed(() => `/event/${this.event().eventId}`);
}
