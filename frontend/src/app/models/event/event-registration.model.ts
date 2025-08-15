import { AppImageData } from '@app/models/app-image-data.model';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { MapLocation } from '@app/models/map-location.model';

export interface EventRegistration {
  eventTitle: string;
  image: AppImageData,

  location: MapLocation;
  opportunity: EventOpportunity;

  registrationId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface RegistrationContext {
  registrationId?: string;
  registrationStatus?: RegistrationStatus;
  registrationCreatedAt?: string;
  conflicted?: string;
}

export enum RegistrationStatus {
  Requested = 'requested',
  Registered = 'registered',
  Cancelled = 'cancelled',
}

export function getRegistrationContext(opportunity: EventOpportunity, eventRegistrations: EventRegistration[]): RegistrationContext | null {
  const reg = eventRegistrations.find((r) => r.opportunity.opportunityId === opportunity.opportunityId);
  if (reg) {
    return { registrationId: reg.registrationId, registrationCreatedAt: reg.createdAt, registrationStatus: reg.status };
  }

  if (checkForConflict(opportunity, eventRegistrations)) {
    return {
      conflicted: "This event conflicts with one you've already registered for."
    };
  }

  return null;
}

function checkForConflict(opp: EventOpportunity, eventRegistrations: EventRegistration[]) {
  const selectedStartTime = new Date(opp.startDate);
  const selectedEndTime = new Date(opp.endDate);

  const conflicted = eventRegistrations.filter((s) => {
    if (s.opportunity.opportunityId !== opp.opportunityId) {
      const startTime = new Date(s.opportunity.startDate);
      if (startTime >= selectedStartTime && startTime < selectedEndTime) {
        return true;
      }

      const endTime = new Date(s.opportunity.endDate);
      if (endTime > selectedStartTime && endTime <= selectedEndTime) {
        return true;
      }
    }

    return false;
  });

  return conflicted.length > 0;
}


