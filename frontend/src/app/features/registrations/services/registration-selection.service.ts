import { Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/features/events/models/event-opportunity.model';
import { EventRegistration } from '../models/event-registration.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationSelectionService {
  private selectedOpportunitySignal = signal<EventOpportunity | null>(null);
  selectedOpportunity = this.selectedOpportunitySignal.asReadonly();
  private registrationSignal = signal<EventRegistration | null>(null);
  selectedRegistration = this.registrationSignal.asReadonly();

  constructor() { }

  selectOpportunity(opportunity: EventOpportunity) {
    this.selectedOpportunitySignal.set(opportunity);
  }

  selectRegistration(reg: EventRegistration) {
    this.registrationSignal.set(reg);
  }

  clearSelected() {
    this.clearSelectedOpportunity();
    this.clearSelectedRegistration();
  }

  clearSelectedOpportunity() {
    this.selectedOpportunitySignal.set(null);
  }

  clearSelectedRegistration() {
    this.registrationSignal.set(null);
  }
}
