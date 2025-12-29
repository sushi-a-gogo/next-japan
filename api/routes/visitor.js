import express from "express";
import * as visitorController from "../controllers/visitorController.js";

const router = express.Router();

router.post("/", visitorController.trackVisit);

export default router;
