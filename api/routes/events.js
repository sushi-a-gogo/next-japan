import express from "express";
import * as eventController from "../controllers/eventController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.use(express.json());

router.get("/", eventController.getEvents);
router.post("/", authMiddleware, eventController.saveEvent);
router.get("/:id", eventController.getEventById);

export default router;
