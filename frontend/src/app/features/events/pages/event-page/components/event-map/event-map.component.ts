import { Component, computed, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventPageService } from '@app/features/events/pages/event-page/event-page.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventDateCardComponent } from '@app/features/events/ui/event-date-card/event-date-card.component';
import { RegistrationStatus } from '@app/features/registrations/models/event-registration.model';
import { RegistrationService } from '@app/features/registrations/services/registration.service';
import { ButtonComponent } from "@app/shared/components/button/button.component";

@Component({
  selector: 'app-event-map',
  imports: [ButtonComponent, EventDateCardComponent],
  templateUrl: './event-map.component.html',
  styleUrl: './event-map.component.scss'
})
export class EventMapComponent {
  private sanitizer = inject(DomSanitizer);
  private eventPageService = inject(EventPageService);
  private eventOpportunityService = inject(EventOpportunityService);
  private registrationService = inject(RegistrationService);

  onGetTickets = output();

  event = computed(() => this.eventPageService.eventData().event);
  location = computed(() => this.eventPageService.eventData().location);

  nextOpportunity = computed(() => {
    if (!this.eventPageService.eventData().opportunities?.length) {
      return null;
    }
    return this.eventPageService.eventData().opportunities[0];
  });

  nextOpportunityDate = computed(() => {
    const op = this.nextOpportunity();
    return op ? this.eventOpportunityService.getCleanDate(op) : null;
  });

  nextOpportunityRegistered = computed(() => {
    const registered = this.registrationService.userEventRegistrations()
      .find((r) => r.opportunity.opportunityId === this.nextOpportunity()?.opportunityId);
    if (registered) {
      return registered.status === RegistrationStatus.Requested ? "Registration requested." : "You're registered!"
    }
    return null;
  })

  mapsUrl = computed(() => {
    const unsafeUrl = this.location()?.mapsUrl;
    return unsafeUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl) : null;
  });

}
