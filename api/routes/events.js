import axios from "axios";
import express from "express";
import FormData from "form-data";

import coordinator from "../lib/coordinators.js";
import Event from "../models/Event.js"; // Adjust path

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).limit(20);
    const formattedEvents = events.map((event) => ({
      eventId: event._id.toString(), // Use _id as eventId
      eventTitle: event.eventTitle,
      description: event.description,
      image: {
        id: event.imageId,
        cloudflareImageId: event.cloudflareImageId,
        width: event.imageWidth,
        height: event.imageHeight,
      },
      aiProvider: event.aiProvider,
      createdAt: event.createdAt,
    }));
    return res.status(200).json({
      success: true,
      events: formattedEvents,
    });
  } catch (error) {
    console.error("Get events error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve events",
    });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    const formattedEvents = events.map((event) => ({
      eventId: event._id.toString(), // Use _id as eventId
      eventTitle: event.eventTitle,
      description: event.description,
      fullDescription: event.fullDescription,
      image: {
        id: event.imageId,
        cloudflareImageId: event.cloudflareImageId,
        width: event.imageWidth,
        height: event.imageHeight,
      },
      eventCoordinators: event.eventCoordinators,
      aiProvider: event.aiProvider,
      createdAt: event.createdAt,
    }));

    const filteredEvents = formattedEvents.filter(
      (event) =>
        event.eventTitle.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.fullDescription.toLowerCase().includes(query)
    );

    res.json(
      filteredEvents.map((e) => ({
        eventId: e.eventId,
        eventTitle: e.eventTitle,
        description: e.description,
        image: e.image,
        aiProvider: e.aiProvider,
      }))
    );
  } catch (error) {
    console.error("Get events error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve events",
    });
  }
});

router.post("/save", async (req, res) => {
  try {
    const {
      eventTitle,
      description,
      fullDescription,
      image,
      imageUrl,
      eventCoordinators,
      aiProvider,
      prompt,
    } = req.body;

    // Input validation
    if (!eventTitle || !description || !fullDescription || !imageUrl) {
      return res.status(400).json({
        error: "Missing required fields: eventTitle, description, or imageUrl",
      });
    }

    // Upload image to Cloudflare
    const formData = new FormData();
    const imageBuffer = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const filename = image.id;
    formData.append("file", imageBuffer.data, {
      filename,
    });

    const cloudfareUploadUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    console.log("Upload image to: " + cloudfareUploadUrl);

    const cloudflareResponse = await axios.post(cloudfareUploadUrl, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
    });

    if (!cloudflareResponse.data.success) {
      throw new Error("Cloudflare upload failed");
    }

    const cloudflareImageId = cloudflareResponse.data.result.id;
    const deliveryUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${cloudflareImageId}/public?w=1792&h=1024&format=webp`;

    // Save to MongoDB
    const event = new Event({
      eventTitle,
      description,
      fullDescription,
      imageId: image.id,
      imageHeight: image.height,
      imageWidth: image.width,
      cloudflareImageId,
      aiProvider,
      textPrompt: prompt.text,
      imagePrompt: prompt.image,
    });

    // Ensure eventCoordinators is an array; default to head coordinator if not provided
    if (!eventCoordinators || eventCoordinators.length === 0) {
      event.eventCoordinators = [coordinator.getCoordinatorDetails("coord1")];
    } else {
      // Validate and populate coordinator details
      event.eventCoordinators = eventCoordinators.map((coord) => {
        return coordinator.getCoordinatorDetails(coord.eventCoordinatorId);
      });
    }

    const savedEvent = await event.save();

    return res.status(201).json({
      success: true,
      data: {
        eventId: savedEvent._id.toString(), // Pass _id as eventId
        eventTitle: savedEvent.eventTitle,
        description: savedEvent.description,
        fullDescription: savedEvent.fullDescription,
        image: {
          id: savedEvent.imageId,
          cloudflareImageId: savedEvent.cloudflareImageId,
          width: savedEvent.imageWidth,
          height: savedEvent.imageHeight,
        },
        eventCoordinators: savedEvent.eventCoordinators,
        imageUrl: deliveryUrl,
        aiProvider,
        prompt: { text: savedEvent.textPrompt, image: savedEvent.imagePrompt },
      },
    });
  } catch (error) {
    console.error("Save event error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to save event",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); // Use _id directly
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event: {
        eventId: event._id.toString(), // Use _id as eventId
        eventTitle: event.eventTitle,
        description: event.description,
        fullDescription: event.fullDescription,
        image: {
          id: event.imageId,
          cloudflareImageId: event.cloudflareImageId,
          width: event.imageWidth,
          height: event.imageHeight,
        },
        eventCoordinators: event.eventCoordinators.map((c) =>
          mapCoordinator(c)
        ),
        aiProvider: event.aiProvider,
        createdAt: event.createdAt,
      },
    });
  } catch (error) {
    console.error("Get event error:", error.message || error);
    return res.status(500).json({
      success: false,
      error: "Failed to retrieve event",
    });
  }
});

function mapCoordinator(coordinator) {
  return {
    eventCoordinatorId: coordinator.eventCoordinatorId,
    firstName: coordinator.firstName,
    lastName: coordinator.lastName,
    email: coordinator.email,
    image: {
      id: coordinator.imageId,
      cloudflareImageId: coordinator.cloudflareImageId,
      width: coordinator.imageWidth,
      height: coordinator.imageHeight,
    },
  };
}

export default router;
