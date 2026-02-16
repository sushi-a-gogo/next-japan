import { CalendarDate } from '@app/features/events/models/calendar-date.model';

export interface EventOpportunity extends CalendarDate {
  opportunityId: string;
  eventId: string;
  notes?: string;
}
