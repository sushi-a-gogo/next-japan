import dotenv from "dotenv";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { dirname } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const originalDir = path.join(__dirname, "public", "images");
const cacheDir = path.join(__dirname, "cache", "resized");

function validateImagePath(imageName) {
  // Only allow basic safe filenames (no slashes or directory traversal)
  return /^[a-zA-Z0-9_\-\.]+\.(png|jpg|jpeg|webp)$/i.test(imageName);
}

// Route: /resize/:width/:height/:imageName
router.get("/resize/:width/:height/:imageName", async (req, res) => {
  const { width, height, imageName } = req.params;

  // Validate filename
  if (!validateImagePath(imageName)) {
    return res.status(400).send("Invalid image name");
  }

  const ext = path.extname(imageName);
  const baseName = path.basename(imageName, ext);
  const cachedFileName = `${width}x${height}-${baseName}.webp`;
  const cachedPath = path.join(cacheDir, cachedFileName);
  const originalPath = path.join(originalDir, imageName);

  try {
    // Check if cached image exists
    try {
      const stat = await fs.stat(cachedPath);
      if (stat.isFile()) {
        res.set("Content-Type", "image/webp");
        return res.sendFile(cachedPath);
      }
    } catch (_) {
      // Cache miss – continue
    }

    // Check original image exists
    await fs.access(originalPath);

    // Resize
    const resizedBuffer = await sharp(originalPath)
      .resize(parseInt(width), parseInt(height))
      .toFormat("webp")
      .toBuffer();

    // Save resized version to cache
    await fs.writeFile(cachedPath, resizedBuffer);

    res.set("Content-Type", "image/webp");
    res.send(resizedBuffer);
  } catch (err) {
    console.error("Image processing error:", err.message);
    res.status(404).send("Image not found or could not be processed");
  }
});

// DELETE /cache?age=3600  (age in seconds, optional)
router.delete("/cache", async (req, res) => {
  const maxAgeSeconds = parseInt(req.query.age, 10) || null;

  try {
    const files = await fs.readdir(cacheDir);

    const now = Date.now();
    let deleted = 0;

    for (const file of files) {
      const filePath = path.join(cacheDir, file);

      try {
        const stat = await fs.stat(filePath);

        if (!maxAgeSeconds || now - stat.mtimeMs > maxAgeSeconds * 1000) {
          await fs.unlink(filePath);
          deleted++;
        }
      } catch (err) {
        console.warn(`Could not delete file ${file}:`, err.message);
      }
    }

    res.json({ success: true, deleted });
  } catch (err) {
    console.error("Failed to purge cache:", err);
    res.status(500).send("Failed to purge cache");
  }
});

export default router;
