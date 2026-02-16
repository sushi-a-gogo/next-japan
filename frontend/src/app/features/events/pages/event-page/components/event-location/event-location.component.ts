import { Component, computed, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '@app/features/events/pages/event-page/event.service';
import { EventRegistrationService } from '@app/features/events/services/event-registration.service';
import { OpportunityDateComponent } from '@app/features/events/ui/opportunity-date/opportunity-date.component';
import { ButtonComponent } from "@app/shared/components/button/button.component";
import { RegistrationStatus } from '@events/models/event-registration.model';

@Component({
  selector: 'app-event-location',
  imports: [ButtonComponent, OpportunityDateComponent],
  templateUrl: './event-location.component.html',
  styleUrl: './event-location.component.scss'
})
export class EventLocationComponent {
  private sanitizer = inject(DomSanitizer);
  private eventService = inject(EventService);
  private eventRegistrationService = inject(EventRegistrationService);

  onGetTickets = output();

  event = computed(() => this.eventService.eventData().event);
  location = computed(() => this.eventService.eventData().location);
  nextOpportunity = computed(() => this.eventService.eventData().opportunities.length ? this.eventService.eventData().opportunities[0] : null);
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
