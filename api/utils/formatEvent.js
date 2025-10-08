const formatEvent = (event, deliveryUrl = null) => {
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
};

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

export default formatEvent;
