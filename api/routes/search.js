import express from "express";
import { queryEvents } from "../controllers/eventSearchController.js";

const router = express.Router();
router.use(express.json());

router.get("/", queryEvents);

export default router;
