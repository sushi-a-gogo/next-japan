import { CalendarDate } from '@app/models/calendar-date.model';

export interface EventOpportunity extends CalendarDate {
  opportunityId: number;
  locationId: string;
  eventId: string;
  notes?: string;
}
