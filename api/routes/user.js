import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/list", async (req, res) => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "data",
    "users",
    "default-users.json"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(fileContent);
  res.status(200).json({ users });
});

router.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const filePath = path.resolve(
    __dirname,
    "..",
    "data",
    "users",
    "default-users.json"
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const users = JSON.parse(fileContent);

  const index = users.findIndex((user) => user.userId === userId);
  if (index === -1) {
    return res.status(404).json("I dont have that");
  }

  const user = users[index];
  res.status(200).json({ user });
});

export default router;
