import { EventData } from '@app/event/models/event-data.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';

export interface OrganizationEvents {
  events: EventData[];
  upcomingOpportunities: EventOpportunity[];
}
