import express from "express";
import * as eventLocationController from "../controllers/eventLocationController.js";

const router = express.Router();

// GET all event locations
router.get("/", eventLocationController.getLocations);

// GET by locationId
router.get("/:locationId", eventLocationController.getLocationById);

// GET event locations
router.get("/:eventId/locations", eventLocationController.getEventLocations);

export default router;
