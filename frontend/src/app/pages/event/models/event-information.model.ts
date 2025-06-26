import { EventCoordinator } from './event-coordinator.model';
import { EventData } from './event-data.model';
import { EventLocation } from './event-location.model';

export interface EventInformation extends EventData {
  fullDescription: string;
  eventCoordinators: EventCoordinator[];
  locations: EventLocation[];
  minDate?: string;
  maxDate?: string;

}
