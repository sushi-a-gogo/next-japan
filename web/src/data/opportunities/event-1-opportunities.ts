import { EventOpportunity } from "@app/event/models/event-opportunity.model";
import { eventInformation1 } from "../events/event-1";
import { timeZone } from "../timeZone";

const event = eventInformation1;
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
    opportunityId: 1,
    locationId: locations[0].locationId,
    locationName: locations[0].name,
    startDate: '2025-06-21T00:00:00',
    endDate: '2025-06-21T12:00:00',
    name: locations[0].name,
    addressLine1: locations[0].addressLine1,
    city: locations[0].city,
    state: locations[0].state,
    zip: locations[0].zip,
    latitude: locations[0].latitude,
    longitude: locations[0].longitude,
    ...tz,
    notes: 'Bring a fishing pole and live bait (preferably anchovies).'
  },
  {
    eventId,
    imageId,
    opportunityId: 100,
    description,
    eventTitle,
    locationId: locations[0].locationId,
    locationName: locations[0].name,
    startDate: '2025-07-21T00:00:00',
    endDate: '2025-07-21T12:00:00',
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
    opportunityId: 2,
    locationId: locations[1].locationId,
    locationName: locations[1].name,
    startDate: '2025-06-21T00:00:00',
    endDate: '2025-06-21T12:00:00',
    name: locations[1].name,
    addressLine1: locations[1].addressLine1,
    city: locations[1].city,
    state: locations[1].state,
    zip: locations[1].zip,
    latitude: locations[1].latitude,
    longitude: locations[1].longitude,
    ...tz,
  },
  {
    eventId,
    imageId,
    eventTitle,
    description,
    opportunityId: 200,
    locationId: locations[1].locationId,
    locationName: locations[1].name,
    startDate: '2025-08-01T01:00:00',
    endDate: '2025-08-01T12:00:00',
    name: locations[1].name,
    addressLine1: locations[1].addressLine1,
    city: locations[1].city,
    state: locations[1].state,
    zip: locations[1].zip,
    latitude: locations[1].latitude,
    longitude: locations[1].longitude,
    ...tz,
  },
  {
    eventId,
    imageId,
    eventTitle,
    description,
    opportunityId: 201,
    locationId: locations[1].locationId,
    locationName: locations[1].name,
    startDate: '2025-09-11T01:00:00',
    endDate: '2025-09-11T12:00:00',
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


export const event1Opportunities = opportunities;
