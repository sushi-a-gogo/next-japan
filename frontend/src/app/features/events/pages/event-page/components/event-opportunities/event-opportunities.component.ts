import { Component, computed, input } from '@angular/core';
import { EventOpportunityCardComponent } from '@app/features/events/ui/event-opportunity-card/event-opportunity-card.component';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';
import { RequestRegistrationButtonComponent } from '@app/features/registrations/ui/request-registration-button/request-registration-button.component';

@Component({
  selector: 'app-event-opportunities',
  imports: [RequestRegistrationButtonComponent, EventOpportunityCardComponent],
  templateUrl: './event-opportunities.component.html',
  styleUrl: './event-opportunities.component.scss'
})
export class EventOpportunitiesComponent {
  opportunities = input<RegistrationRequestTicket[]>([]);
  selectedTickets = computed(() => this.opportunities()?.slice(0, 6) || []);
}
