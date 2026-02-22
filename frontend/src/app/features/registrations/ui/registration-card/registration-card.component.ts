import { Component, computed, input } from '@angular/core';
import { EventLocationCard } from "@app/features/events/ui/event-location-card/event-location-card.component";
import { EventOpportunityCardComponent } from "@app/features/events/ui/event-opportunity-card/event-opportunity-card.component";
import { EventRegistration } from '../../models/event-registration.model';
import { RegistrationRequestTicket } from '../../models/registration-request-ticket.model';

@Component({
  selector: 'app-registration-card',
  imports: [EventLocationCard, EventOpportunityCardComponent],
  templateUrl: './registration-card.component.html',
  styleUrl: './registration-card.component.scss',
})
export class RegistrationCardComponent {
  registration = input<EventRegistration | null>(null);
  ticket = input<RegistrationRequestTicket | null>(null);

  selected = computed(() => this.registration() ?? this.ticket());
  location = computed(() => {
    return this.selected()?.location
  });
  opportunity = computed(() => this.selected()?.opportunity);
}
