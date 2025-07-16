import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

import { ORGANIZATION_JSON } from "../utils/paths.js";

dotenv.config();

const router = express.Router();

router.get("/info", async (req, res) => {
  //return res.status(500).json();

  //await new Promise((resolve) => setTimeout(resolve, 15000));
  try {
    const fileContent = await fs.readFile(ORGANIZATION_JSON, "utf-8");
    const data = JSON.parse(fileContent);
    res.status(200).json({ data });
  } catch (e) {
    console.error(e);
    return res.status(500).json();
  }
});

export default router;
