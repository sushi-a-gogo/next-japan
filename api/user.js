import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";

dotenv.config();

const router = express.Router();

router.get("/list", async (req, res) => {
  const fileContent = await fs.readFile("./data/users/default-users.json");
  const users = JSON.parse(fileContent);
  res.status(200).json({ users });
});

router.get("/:id", async (req, res) => {
  const userId = Number(req.params.id);
  const fileContent = await fs.readFile("./data/users/default-users.json");
  const users = JSON.parse(fileContent);

  const index = users.findIndex((user) => user.userId === userId);
  if (index === -1) {
    return res.status(404).json("I dont have that");
  }

  const user = users[index];
  res.status(200).json({ user });
});

export default router;
