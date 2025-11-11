import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, output, PLATFORM_ID, signal } from '@angular/core';
import { EventService } from '@app/pages/events/event-page/event.service';
import { DateTimeService } from '@app/services/date-time.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { ImageService } from '@app/services/image.service';
import { LikeButtonComponent } from "@app/shared/like-button/like-button.component";
import { ShareButtonComponent } from "@app/shared/share-button/share-button.component";
import { RegistrationAlertComponent } from "../registration-alert/registration-alert.component";
import { ViewRegistrationDialogComponent } from '../view-registration-dialog/view-registration-dialog.component';

@Component({
  selector: 'app-event-hero',
  imports: [NgOptimizedImage, LikeButtonComponent, ShareButtonComponent, RegistrationAlertComponent, ViewRegistrationDialogComponent],
  templateUrl: './event-hero.component.html',
  styleUrl: './event-hero.component.scss',

})
export class EventHeroComponent {
  private dateTimeService = inject(DateTimeService);
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);
  private imageService = inject(ImageService);
  private platformId = inject(PLATFORM_ID);
  private eventData = this.eventService.eventData;

  onGetTickets = output();

  event = computed(() => this.eventData().event);
  xAi = computed(() => this.event()?.aiProvider === 'Grok');
  location = computed(() => this.eventData().location);
  viewRegistration = signal(false);

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

  eventRegistration = computed(() => {
    const eventId = this.event()?.eventId;
    const registrations = this.eventRegistrationService.userEventRegistrations().filter((r) => r.opportunity.eventId === eventId);
    return registrations.length ? registrations[0] : null;
  });
}
