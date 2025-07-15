import { AppImageData } from '@app/models/app-image-data.model';
import { MapLocation } from '@app/models/map-location.model';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';

export interface EventRegistration {
  eventTitle: string;
  image: AppImageData,

  location: MapLocation;
  opportunity: EventOpportunity;

  registrationId?: string;
  userId?: number;
  status?: RegistrationStatus;
}

export enum RegistrationStatus {
  Requested = 'requested',
  Registered = 'registered',
  Cancelled = 'cancelled',
}
