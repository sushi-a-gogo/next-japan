import { MapLocation } from '@app/models/map-location.model';
import { EventOpportunity } from './event-opportunity.model';

export interface EventLocation extends MapLocation {
  opportunities?: EventOpportunity[];
}
