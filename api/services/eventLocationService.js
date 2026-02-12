import Event from "../models/Event.js";
import EventLocation from "../models/EventLocation.js";

export const getLocations = async () => {
  const locations = await EventLocation.find();
  return locations.map((item) => ({
    locationId: item._id.toString(), // Use _id as locationId
    ...item,
  }));
};

export const getEventLocation = async (eventId) => {
  const event = await Event.findById(eventId).populate("locationId").lean(); // Populates locationId with EventLocation document

  const document = event.locationId;
  if (!document) {
    return null;
  }

  return {
    locationId: document._id.toString(), // Use _id as locationId
    ...document,
  };
};

export const getLocationById = async (locationId) => {
  const location = await EventLocation.findOne({
    locationId,
  }).populate("eventId");
  return location;
};
