import express from "express";
import * as registrationController from "../controllers/eventRegistrationController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/user/:userId",
  authMiddleware,
  registrationController.getEventRegistrationsForUser,
);

router.post(
  "/",
  authMiddleware,
  registrationController.createEventRegistration,
);

router.get(
  "/:registrationId",
  authMiddleware,
  registrationController.getEventRegistrationById,
);

router.put(
  "/:registrationId",
  authMiddleware,
  registrationController.updateEventRegistration,
);

router.delete(
  "/:registrationId",
  authMiddleware,
  registrationController.deleteEventRegistration,
);

export default router;
