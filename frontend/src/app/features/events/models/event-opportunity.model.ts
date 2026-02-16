import { EventCalendarDate } from './event-calendar-date.model';

export interface EventOpportunity extends EventCalendarDate {
  opportunityId: string;
  eventId: string;
  notes?: string;
}
