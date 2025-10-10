import express from "express";
import { searchEvents } from "../controllers/eventSearchController.js";

const router = express.Router();
router.use(express.json());

router.get("/", searchEvents);

export default router;
