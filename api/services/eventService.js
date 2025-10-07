import coordinator from "../lib/coordinators.js";
import Event from "../models/Event.js";
import { uploadImageToCloudflare } from "../utils/cloudflare.js";

export const getRecentEvents = async () => {
  const events = await Event.find().sort({ createdAt: -1 }).limit(20);
  return events.map(formatEvent);
};

export const searchEvents = async (query) => {
  const events = await Event.find().sort({ createdAt: -1 });
  const formatted = events.map(formatEvent);

  return formatted.filter(
    (event) =>
      event.eventTitle.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.fullDescription.toLowerCase().includes(query.toLowerCase())
  );
};

export const saveEvent = async (data) => {
  const {
    eventTitle,
    description,
    fullDescription,
    image,
    imageUrl,
    eventCoordinators,
    aiProvider,
    prompt,
  } = data;

  if (!eventTitle || !description || !fullDescription || !imageUrl) {
    throw new Error(
      "Missing required fields: eventTitle, description, or imageUrl"
    );
  }

  // Upload image to Cloudflare
  const { cloudflareImageId, deliveryUrl } = await uploadImageToCloudflare(
    image.id,
    imageUrl
  );

  // Save to DB
  const event = new Event({
    eventTitle,
    description,
    fullDescription,
    imageId: image.id,
    imageHeight: image.height,
    imageWidth: image.width,
    cloudflareImageId,
    aiProvider,
    textPrompt: prompt?.text,
    imagePrompt: prompt?.image,
    eventCoordinators:
      eventCoordinators && eventCoordinators.length > 0
        ? eventCoordinators.map((c) =>
            coordinator.getCoordinatorDetails(c.eventCoordinatorId)
          )
        : [coordinator.getCoordinatorDetails("coord1")],
  });

  const saved = await event.save();
  return formatEvent(saved, deliveryUrl);
};

export const getEventById = async (id) => {
  const event = await Event.findById(id);
  return event ? formatEvent(event) : null;
};

// 🔧 Helpers
function formatEvent(event, deliveryUrl = null) {
  return {
    eventId: event._id.toString(),
    eventTitle: event.eventTitle,
    description: event.description,
    fullDescription: event.fullDescription,
    image: {
      id: event.imageId,
      cloudflareImageId: event.cloudflareImageId,
      width: event.imageWidth,
      height: event.imageHeight,
    },
    eventCoordinators: event.eventCoordinators?.map(mapCoordinator) || [],
    aiProvider: event.aiProvider,
    createdAt: event.createdAt,
    imageUrl: deliveryUrl || undefined,
    prompt: { text: event.textPrompt, image: event.imagePrompt },
  };
}

function mapCoordinator(c) {
  return {
    eventCoordinatorId: c.eventCoordinatorId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    image: {
      id: c.imageId,
      cloudflareImageId: c.cloudflareImageId,
      width: c.imageWidth,
      height: c.imageHeight,
    },
  };
}
