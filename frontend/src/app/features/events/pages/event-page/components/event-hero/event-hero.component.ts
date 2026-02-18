import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, ElementRef, inject, input, output, PLATFORM_ID, viewChild } from '@angular/core';
import { DateTimeService } from '@app/core/services/date-time.service';
import { ImageService } from '@app/core/services/image.service';
import { EventInformation } from '@app/features/events/models/event-information.model';
import { EventPageService } from '@app/features/events/pages/event-page/event-page.service';
import { EventLikeButtonComponent } from "@app/features/events/ui/event-like-button/event-like-button.component";
import { EventShareButtonComponent } from "@app/features/events/ui/event-share-button/event-share-button.component";
import { EventRegistration } from '@app/features/registrations/models/event-registration.model';
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
  private eventPageService = inject(EventPageService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private eventData = this.eventPageService.eventData;
  private ticking = false;

  heroImg = viewChild<ElementRef>('heroImg');
  onGetTickets = output();

  event = input.required<EventInformation>();
  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  location = computed(() => this.eventData().location);

  bannerImage = computed(() => {
    const image = this.event()?.image;
    if (image && isPlatformBrowser(this.platformId)) {
      return this.imageService.resizeImage(image, image.width, image.height)
    }
    return null;
  });

  eventDateRange = computed(() => {
    const opportunities = this.eventData().opportunities;
    if (opportunities.length) {
      const startDate = new Date(opportunities[0].startDate);
      if (this.dateTimeService.isValidDate(startDate)) {
        const formattedStartDate = this.dateTimeService.formatDateInLocaleTime(new Date(startDate), 'mediumDate', opportunities[0].timeZone);

        const endDate = opportunities.length > 1 ? opportunities[opportunities.length - 1].startDate : undefined;
        if (endDate) {
          const formattedEndDate = this.dateTimeService.formatDateInLocaleTime(new Date(endDate), 'mediumDate', opportunities[0].timeZone);
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

  private sortRegistrationsByDate(a: EventRegistration, b: EventRegistration) {
    return new Date(a.opportunity.startDate).getTime() - new Date(b.opportunity.startDate).getTime();
  }
}
