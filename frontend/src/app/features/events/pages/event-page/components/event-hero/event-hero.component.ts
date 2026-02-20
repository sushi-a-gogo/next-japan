import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, ElementRef, inject, input, output, PLATFORM_ID, viewChild } from '@angular/core';
import { DateTimeService } from '@app/core/services/date-time.service';
import { ImageService } from '@app/core/services/image.service';
import { EventInformation } from '@app/features/events/models/event-information.model';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventLikeButtonComponent } from "@app/features/events/ui/event-like-button/event-like-button.component";
import { EventShareButtonComponent } from "@app/features/events/ui/event-share-button/event-share-button.component";
import { RegistrationStatusCardComponent } from "@app/features/registrations/ui/registration-status-card/registration-status-card.component";

@Component({
  selector: 'app-event-hero',
  imports: [NgOptimizedImage, EventLikeButtonComponent, EventShareButtonComponent, RegistrationStatusCardComponent],
  templateUrl: './event-hero.component.html',
  styleUrl: './event-hero.component.scss',
  host: {
    '(window:scroll)': 'handleScroll()'
  }
})
export class EventHeroComponent {
  private dateTimeService = inject(DateTimeService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private ticking = false;

  event = input<EventInformation | null>(null);
  location = input<EventLocation | null>(null);
  opportunities = input<EventOpportunity[] | null>(null);
  heroImg = viewChild<ElementRef>('heroImg');
  onGetTickets = output();

  xAi = computed(() => this.event()?.aiProvider === 'Grok');

  bannerImage = computed(() => {
    const image = this.event()?.image;
    if (image && isPlatformBrowser(this.platformId)) {
      return this.imageService.resizeImage(image, image.width, image.height)
    }
    return { src: "assets/images/default-event.avif" };
  });

  eventDateRange = computed(() => {
    const ops = this.opportunities() || [];
    if (ops.length) {
      const startDate = new Date(ops[0].startDate);
      if (this.dateTimeService.isValidDate(startDate)) {
        const formattedStartDate = this.dateTimeService.formatDateInLocaleTime(new Date(startDate), 'mediumDate', ops[0].timeZone);

        const endDate = ops.length > 1 ? ops[ops.length - 1].startDate : undefined;
        if (endDate) {
          const formattedEndDate = this.dateTimeService.formatDateInLocaleTime(new Date(endDate), 'mediumDate', ops[0].timeZone);
          return `${formattedStartDate} - ${formattedEndDate}`;
        }

        return `${formattedStartDate}`;
      }
    }

    return null;
  });

  handleScroll() {
    if (!isPlatformBrowser(this.platformId) || this.ticking) return;

    this.ticking = true;

    requestAnimationFrame(() => {
      const factor = window.innerWidth < 768 ? 0.15 : 0.25;
      const offset = window.scrollY * factor;

      this.heroImg()!.nativeElement.style.transform =
        `translateY(${offset}px)`;

      this.ticking = false;
    });
  }
}
