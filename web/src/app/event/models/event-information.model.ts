import { EventCoordinator } from './event-coordinator.model';
import { EventData } from './event-data.model';
import { EventLocation } from './event-location.model';

export interface EventInformation extends EventData {
  eventCoordinators: EventCoordinator[];
  fullDescription?: string;
  locations?: EventLocation[];
  eventPreviewUrl?: string;
  minDate?: string;
  maxDate?: string;

}
