import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { event1Opportunities } from './opportunities/event-1-opportunities';
import { event2Opportunities } from './opportunities/event-2-opportunities';
import { event3Opportunities } from './opportunities/event-3-opportunities';

export const DUMMY_OPPORTUNITIES: EventOpportunity[] = [...event1Opportunities, ...event2Opportunities, ...event3Opportunities];
