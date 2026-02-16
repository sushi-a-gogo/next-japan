import { CalendarDate } from './calendar-date.model';

export interface EventOpportunity extends CalendarDate {
  opportunityId: string;
  eventId: string;
  notes?: string;
}
