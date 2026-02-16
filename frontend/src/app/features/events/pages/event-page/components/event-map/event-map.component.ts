import { Component, computed, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventOpportunityService } from '@app/features/events/services/event-opportunity.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { EventDateCardComponent } from '@app/features/events/ui/event-date-card/event-date-card.component';
import { ButtonComponent } from "@app/shared/components/button/button.component";
import { RegistrationStatus } from '@features/events/models/event-registration.model';

@Component({
  selector: 'app-event-map',
  imports: [ButtonComponent, EventDateCardComponent],
  templateUrl: './event-map.component.html',
  styleUrl: './event-map.component.scss'
})
export class EventMapComponent {
  private sanitizer = inject(DomSanitizer);
  private eventService = inject(EventService);
  private eventOpportunityService = inject(EventOpportunityService);
  private eventRegistrationService = inject(EventRegistrationService);

  onGetTickets = output();

  event = computed(() => this.eventService.eventData().event);
  location = computed(() => this.eventService.eventData().location);

  nextOpportunity = computed(() => {
    if (!this.eventService.eventData().opportunities?.length) {
      return null;
    }
    return this.eventService.eventData().opportunities[0];
  });

  nextOpportunityDate = computed(() => {
    const op = this.nextOpportunity();
    return op ? this.eventOpportunityService.getCleanDate(op) : null;
  });

  nextOpportunityRegistered = computed(() => {
    const registered = this.eventRegistrationService.userEventRegistrations()
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
