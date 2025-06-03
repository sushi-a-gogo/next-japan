import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { RegistrationService } from '@app/services/registration.service';
import { ModalComponent } from "@app/shared/modal/modal.component";
import { MyEventCardComponent } from "./my-event-card/my-event-card.component";

@Component({
  selector: 'app-my-events',
  imports: [MatButtonModule, MatRippleModule, ModalComponent, MyEventCardComponent],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.scss'
})
export class MyEventsComponent {
  private registrationService = inject(RegistrationService);

  close = output<boolean>();
  // if this was a real app, this would be fetched from an api instead of being pulled this signal
  // and/or the registrationService would be also used to fetch the registrations and seed the signal
  events = this.registrationService.registrations;

  closeDialog() {
    this.close.emit(true);
  }

}
