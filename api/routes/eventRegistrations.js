import express from "express";
import * as registrationController from "../controllers/eventRegistrationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/user/:userId",
  authMiddleware,
  registrationController.getUserRegistrations
);

router.post("/", authMiddleware, registrationController.createRegistration);

router.get(
  "/:registrationId",
  authMiddleware,
  registrationController.getRegistrationById
);

router.put(
  "/:registrationId",
  authMiddleware,
  registrationController.updateRegistration
);

router.delete(
  "/:registrationId",
  authMiddleware,
  registrationController.deleteRegistration
);

export default router;
