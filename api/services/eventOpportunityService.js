import EventOpportunity from "../models/EventOpportunity.js"; // Adjust path

export const getOpportunities = async () => {
  const documents = await EventOpportunity.find().lean();
  const opportunities = documents.map((item) => ({
    opportunityId: item._id.toString(),
    ...item,
  }));
  return opportunities;
};

export const getEventOpportunities = async (eventId) => {
  const documents = await EventOpportunity.find({ eventId }).lean();
  const eventOpportunities = documents.map((item) => ({
    opportunityId: item._id.toString(),
    ...item,
  }));

  return eventOpportunities;
};

export const getOpportunityById = async (id) => {
  return await EventOpportunity.findById(id).populate("eventId");
};
