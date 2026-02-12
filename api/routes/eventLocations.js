import express from "express";
import * as eventLocationController from "../controllers/eventLocationController.js";

const router = express.Router();

router.get("/", eventLocationController.getLocations);
router.get("/:locationId", eventLocationController.getLocationById);
router.get("/:eventId/location", eventLocationController.getEventLocation);

export default router;
