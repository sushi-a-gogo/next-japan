import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, ElementRef, inject, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { LikeButtonComponent } from "@app/features/events/ui/like-button/like-button.component";
import { ShareButtonComponent } from "@app/features/events/ui/share-button/share-button.component";
import { DateTimeService } from '@core/services/date-time.service';
import { ImageService } from '@core/services/image.service';
import { RegistrationAlertComponent } from "../registration-alert/registration-alert.component";
import { ViewRegistrationDialogComponent } from '../view-registration-dialog/view-registration-dialog.component';

@Component({
  selector: 'app-event-hero',
  imports: [NgOptimizedImage, LikeButtonComponent, ShareButtonComponent, RegistrationAlertComponent, ViewRegistrationDialogComponent],
  templateUrl: './event-hero.component.html',
  styleUrl: './event-hero.component.scss',
  host: {
    '(window:scroll)': 'handleScroll()'
  }
})
export class EventHeroComponent {
  private dateTimeService = inject(DateTimeService);
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private eventData = this.eventService.eventData;
  private ticking = false;

  heroImg = viewChild<ElementRef>('heroImg');
  onGetTickets = output();

  event = computed(() => this.eventData().event);
  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  location = computed(() => this.eventData().location);
  viewRegistration = signal(false);

  bannerImage = computed(() => {
    const image = this.event()?.image;
    if (image && isPlatformBrowser(this.platformId)) {
      return this.imageService.resizeImage(image, image.width, image.height)
    }
    return { src: "assets/images/default-event.avif" };
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

  eventRegistration = computed(() => {
    const eventId = this.event()?.eventId;
    const registrations = this.eventRegistrationService.userEventRegistrations().filter((r) => r.opportunity.eventId === eventId);
    return registrations.length ? registrations[0] : null;
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
