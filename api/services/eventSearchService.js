import Event from "../models/Event.js";
import EventLocation from "../models/EventLocation.js";
import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path
import formatEvent from "../utils/formatEvent.js";

export const findEvents = async (query) => {
  const events = await Event.find().sort({ createdAt: -1 });
  const locations = await EventLocation.find().limit(50);
  const opportunities = await EventOpportunity.find().limit(100);

  const formattedEvents = events.map((event) => {
    const eventOpportunities = opportunities.filter(
      (opp) => opp.eventId === event._id.toString()
    );

    const eventLocations = locations.filter(
      (location) =>
        !!eventOpportunities.find(
          (opp) => opp.locationId === location._id.toString()
        )
    );

    const locationNames = eventLocations
      .map((loc) => `${loc.locationName} ${loc.city} ${loc.state}`)
      .join(", ");

    const monthNames = eventOpportunities
      .map((o) => {
        const monthName = new Date(o.startDate).toLocaleString("default", {
          month: "long",
        });
        return monthName;
      })
      .join(", ");

    return {
      ...formatEvent(event),
      locationNames,
      monthNames,
    };
  });

  const filteredEvents = formattedEvents.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.fullDescription.toLowerCase().includes(query) ||
      event.locationNames.toLowerCase().includes(query) ||
      event.monthNames.toLowerCase().includes(query)
  );

  return filteredEvents.map((e) => ({
    eventId: e.eventId,
    eventTitle: e.eventTitle,
    description: e.description,
    image: e.image,
    aiProvider: e.aiProvider,
  }));
};
