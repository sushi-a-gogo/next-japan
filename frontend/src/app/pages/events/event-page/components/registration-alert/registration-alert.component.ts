import { DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EventRegistration } from '@app/models/event/event-registration.model';
import { AddressStripComponent } from "@app/shared/address-strip/address-strip.component";
import { ModalComponent } from "@app/shared/modal/modal.component";
import { OpportunityTimestampComponent } from "@app/shared/opportunity-timestamp/opportunity-timestamp.component";

@Component({
  selector: 'app-registration-alert',
  imports: [DatePipe, RouterLink, MatButtonModule, ModalComponent, OpportunityTimestampComponent, AddressStripComponent],
  templateUrl: './registration-alert.component.html',
  styleUrl: './registration-alert.component.scss'
})
export class RegistrationAlertComponent {
  eventRegistration = input.required<EventRegistration>();
  showDialog = signal<boolean>(false);
  confirmCancel = signal<boolean>(false);

  closeDialog() {
    this.showDialog.set(false);
    this.confirmCancel.set(false);
  }
}
