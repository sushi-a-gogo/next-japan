import { Component, input } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { EventRegistration } from '@app/event/models/event-registration.model';
import { OpportunityCardComponent } from "@app/shared/opportunity-card/opportunity-card.component";
import { RegistrationStatusLabelComponent } from "../../../../shared/registration-status-label/registration-status-label.component";

@Component({
  selector: 'app-my-event-card',
  imports: [MatRippleModule, OpportunityCardComponent, RegistrationStatusLabelComponent],
  templateUrl: './my-event-card.component.html',
  styleUrl: './my-event-card.component.scss'
})
export class MyEventCardComponent {
  event = input.required<EventRegistration>();
}
