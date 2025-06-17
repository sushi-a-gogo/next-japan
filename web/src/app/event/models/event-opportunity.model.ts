import { AppImageData } from '@app/models/app-image-data.model';
import { CalendarDate } from '@app/models/calendar-date.model';
import { MapLocation } from '@app/models/map-location.model';

export interface EventOpportunity extends CalendarDate, MapLocation {
  opportunityId: number;
  eventId: number;
  eventTitle: string;
  description: string;
  image: AppImageData,
  locationName: string;
  locationNotes?: string;
  notes?: string;
}
