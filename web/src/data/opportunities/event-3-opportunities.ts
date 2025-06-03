import { EventOpportunity } from "@app/event/models/event-opportunity.model";
import { eventInformation3 } from "../events/event-3";
import { timeZone } from "../timeZone";

const event = eventInformation3;
const eventId = event.eventId;
const eventTitle = event.eventTitle;
const description = event.description;
const imageId = event.imageId;
const locations = event.locations!;
const tz = timeZone;

const opportunities: EventOpportunity[] = [
  {
    eventId,
    eventTitle,
    description,
    imageId,
    opportunityId: 5,
    locationId: locations[0].locationId,
    locationName: locations[0].name,
    startDate: '2025-07-21T08:00:00',
    endDate: '2025-07-21T14:00:00',
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
    eventTitle,
    description,
    imageId,
    opportunityId: 6,
    locationId: locations[0].locationId,
    locationName: locations[0].name,
    startDate: '2025-10-01T08:00:00',
    endDate: '2025-10-01T14:00:00',
    name: locations[0].name,
    addressLine1: locations[0].addressLine1,
    city: locations[0].city,
    state: locations[0].state,
    zip: locations[0].zip,
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    ...tz,
  },
];

export const event3Opportunities = opportunities;
