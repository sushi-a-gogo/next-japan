import express from "express";
import * as eventSocialController from "../controllers/eventSocialController.js";

const router = express.Router();

router.post("/", eventSocialController.shareEvent);
router.get("/count/:eventId", eventSocialController.getEventShareCount);

export default router;
