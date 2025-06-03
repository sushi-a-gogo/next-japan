import { EventOpportunity } from "@app/event/models/event-opportunity.model";
import { eventInformation2 } from "../events/event-2";
import { timeZone } from "../timeZone";

const event = eventInformation2;
const eventId = event.eventId;
const eventTitle = event.eventTitle;
const description = event.description;
const imageId = event.imageId;
const locations = event.locations!;
const tz = timeZone;

const opportunities: EventOpportunity[] = [
  {
    eventId,
    imageId,
    opportunityId: 3,
    eventTitle,
    description,
    locationId: locations[0].locationId,
    locationName: locations[0].name,
    startDate: '2025-08-27T00:00:00',
    endDate: '2025-08-27T12:00:00',
    name: locations[0].name,
    addressLine1: locations[0].addressLine1,
    city: locations[0].city,
    state: locations[0].state,
    zip: locations[0].zip,
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    ...tz,
  },
  {
    eventId,
    imageId,
    eventTitle,
    description,
    opportunityId: 4,
    locationId: locations[1].locationId,
    locationName: locations[1].name,
    startDate: '2025-09-15T00:00:00',
    endDate: '2025-09-15T12:00:00',
    name: locations[1].name,
    addressLine1: locations[1].addressLine1,
    city: locations[1].city,
    state: locations[1].state,
    zip: locations[1].zip,
    latitude: locations[1].latitude,
    longitude: locations[1].longitude,
    ...tz,
  },
];

export const event2Opportunities = opportunities;
