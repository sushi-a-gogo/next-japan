import { EventOpportunity } from '@app/event/models/event-opportunity.model';

export interface EventRegistration extends EventOpportunity {
  registrationId: number;
  scheduleConflict?: boolean;
  userId: number;
  status: RegistrationStatus;
}

export enum RegistrationStatus {
  Requested = 'requested',
  Registered = 'registered',
  Cancelled = 'cancelled',
}
