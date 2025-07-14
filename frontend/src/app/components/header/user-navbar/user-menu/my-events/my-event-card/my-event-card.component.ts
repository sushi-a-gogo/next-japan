import { Component, computed, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { EventRegistration } from '@app/pages/event/models/event-registration.model';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";
import { RegistrationStatusLabelComponent } from "@shared/registration-status-label/registration-status-label.component";

@Component({
  selector: 'app-my-event-card',
  imports: [RouterLink, MatRippleModule, RegistrationStatusLabelComponent, AddressStripComponent, OpportunityTimestampComponent],
  templateUrl: './my-event-card.component.html',
  styleUrl: './my-event-card.component.scss'
})
export class MyEventCardComponent {
  event = input.required<EventRegistration>();
  routerLink = computed(() => `/event/${this.event().eventId}`);
}
