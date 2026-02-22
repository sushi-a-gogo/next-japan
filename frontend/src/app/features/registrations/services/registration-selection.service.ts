import { Injectable, signal } from '@angular/core';
import { EventRegistration } from '@app/features/registrations/models/event-registration.model';
import { RegistrationRequestTicket } from '@app/features/registrations/models/registration-request-ticket.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationSelectionService {
  private registrationRequestSignal = signal<RegistrationRequestTicket | null>(null);
  registrationRequest = this.registrationRequestSignal.asReadonly();

  private registrationSignal = signal<EventRegistration | null>(null);
  selectedRegistration = this.registrationSignal.asReadonly();

  private cancelRegistrationSignal = signal<EventRegistration | null>(null);
  cancelRegistration = this.cancelRegistrationSignal.asReadonly();

  constructor() { }

  selectRegistrationRequest(ticket: RegistrationRequestTicket) {
    this.registrationRequestSignal.set(ticket);
  }

  selectRegistration(reg: EventRegistration) {
    this.registrationSignal.set(reg);
  }

  selectCancelRegistration(reg: EventRegistration) {
    this.cancelRegistrationSignal.set(reg);
  }

  clearSelected() {
    this.clearSelectedOpportunity();
    this.clearSelectedRegistration();
    this.clearCancelRegistration();
  }

  clearSelectedOpportunity() {
    this.registrationRequestSignal.set(null);
  }

  clearSelectedRegistration() {
    this.registrationSignal.set(null);
  }

  clearCancelRegistration() {
    this.cancelRegistrationSignal.set(null);
  }
}
