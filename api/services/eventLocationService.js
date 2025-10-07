import EventLocation from "../models/EventLocation.js";
import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path

export const getLocations = async () => {
  const locations = await EventLocation.find();
  return locations.map((item) => ({
    locationId: item._id.toString(), // Use _id as locationId
    ...item,
  }));
};

export const getEventLocations = async (eventId) => {
  // Fetch opportunities and populate locationId
  const opportunities = await EventOpportunity.find({
    eventId,
  })
    .populate("locationId")
    .lean(); // Populates locationId with EventLocation documents

  // Extract unique locations (locationId is now the full EventLocation document)
  const eventLocations = [
    ...new Set(
      opportunities.map((o) => o.locationId).filter((location) => !!location)
    ),
  ].map((location) => ({
    locationId: location._id.toString(), // Use _id as locationId
    ...location,
  }));

  return eventLocations;
};

export const getLocationById = async (locationId) => {
  const location = await EventLocation.findOne({
    locationId,
  }).populate("eventId");
  return location;
};
