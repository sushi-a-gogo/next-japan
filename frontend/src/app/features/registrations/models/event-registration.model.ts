import { AppImageData } from '@app/core/models/app-image-data.model';
import { EventLocation } from '../../events/models/event-location.model';
import { EventOpportunity } from '../../events/models/event-opportunity.model';

export interface EventRegistration {
  eventTitle: string;
  image: AppImageData,

  location: EventLocation;
  opportunity: EventOpportunity;

  registrationId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface RegistrationContext {
  registration?: EventRegistration;
  conflicted?: string;
}

export enum RegistrationStatus {
  Requested = 'requested',
  Registered = 'registered',
  Cancelled = 'cancelled',
}

export function getRegistrationContext(opportunity: EventOpportunity, eventRegistrations: EventRegistration[]): RegistrationContext | null {
  const registration = eventRegistrations.find((r) => r.opportunity.opportunityId === opportunity.opportunityId);
  if (registration) {
    return { registration };
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


