import express from "express";
import {
  getEventShareCount,
  shareEvent,
} from "../controllers/eventSocialController.js";

const router = express.Router();

router.post("/", shareEvent);
router.get("/count/:eventId", getEventShareCount);

export default router;
