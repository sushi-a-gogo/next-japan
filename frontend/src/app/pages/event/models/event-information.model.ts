import { EventCoordinator } from './event-coordinator.model';
import { EventData } from './event-data.model';

export interface EventInformation extends EventData {
  fullDescription: string;
  eventCoordinators: EventCoordinator[];
}
