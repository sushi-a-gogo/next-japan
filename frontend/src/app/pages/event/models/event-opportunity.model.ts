import { AppImageData } from '@app/models/app-image-data.model';
import { CalendarDate } from '@app/models/calendar-date.model';
import { MapLocation } from '@app/models/map-location.model';

export interface EventOpportunity extends CalendarDate, MapLocation {
  opportunityId: number;
  eventId: string;
  eventTitle: string;
  image: AppImageData,
  notes?: string;
}
