import { CalendarDate } from '@app/models/calendar-date.model';
import { MapLocation } from '@app/models/map-location.model';
import { EventData } from './event-data.model';

export interface EventOpportunity extends EventData, CalendarDate, MapLocation {
  opportunityId: number;
  locationName: string;
  locationNotes?: string;
  //eventLocationId: number;
  notes?: string;
}
