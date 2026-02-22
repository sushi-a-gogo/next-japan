import { EventLocation } from "@app/features/events/models/event-location.model";
import { EventOpportunity } from "@app/features/events/models/event-opportunity.model";

export interface RegistrationRequestTicket {
  eventTitle: string;
  location: EventLocation;
  opportunity: EventOpportunity;
}
