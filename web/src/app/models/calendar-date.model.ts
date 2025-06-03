import { LocationTimeZone } from './location-time-zone.model';

export interface CalendarDate extends LocationTimeZone {
  startDate: string;
  endDate: string;
}
