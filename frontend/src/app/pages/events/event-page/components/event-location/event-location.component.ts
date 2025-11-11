import { Component, computed, inject, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '@app/pages/events/event-page/event.service';
import { EventRegistrationService } from '@app/services/event-registration.service';
import { ButtonComponent } from "@app/shared/button/button.component";
import { OpportunityDateComponent } from '@app/shared/opportunity-date/opportunity-date.component';

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
    const registered = this.eventRegistrationService.userEventRegistrations().find((r) => r.opportunity.opportunityId === this.nextOpportunity()?.opportunityId);
    return registered;
  })

  mapsUrl = computed(() => {
    const unsafeUrl = this.location()?.mapsUrl;
    return unsafeUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl) : null;
  });

}
