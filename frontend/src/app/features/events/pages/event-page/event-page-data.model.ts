import { EventInformation } from "@app/features/events/models/event-information.model";
import { EventLocation } from "@app/features/events/models/event-location.model";
import { EventOpportunity } from "@app/features/events/models/event-opportunity.model";
import { RegistrationRequestTicket } from "@app/features/registrations/models/registration-request-ticket.model";

export interface EventPageData {
  event: EventInformation | null,
  location: EventLocation | null,
  opportunities: EventOpportunity[],
  tickets: RegistrationRequestTicket[],
  error: unknown | null
};
