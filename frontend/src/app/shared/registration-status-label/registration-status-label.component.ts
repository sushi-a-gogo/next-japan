import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { RegistrationStatus } from '@app/models/event/event-registration.model';
import { EventRegistrationService } from '@app/services/event-registration.service';

@Component({
  selector: 'app-registration-status-label',
  imports: [DatePipe, RouterLink],
  templateUrl: './registration-status-label.component.html',
  styleUrl: './registration-status-label.component.scss'
})
export class RegistrationStatusLabelComponent {
  private registrationService = inject(EventRegistrationService);

  opportunity = input.required<EventOpportunity>();

  registration = computed(() => {
    const reg = this.registrationService.userEventRegistrations().find((r) => r.opportunity.opportunityId === this.opportunity().opportunityId);
    if (!reg || reg.status === RegistrationStatus.Cancelled) {
      return null;
    }

    return reg;
  });
}
