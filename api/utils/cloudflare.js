import axios from "axios";
import FormData from "form-data";
import { Buffer } from "node:buffer";

export const uploadImageToCloudflare = async (imageMeta, input) => {
  let buffer;
  let contentType = "image/png"; // default for our PNGs

  // 1. Convert input (data URL, raw base64, or http url) to Buffer
  try {
    if (typeof input === "string") {
      if (input.startsWith("data:image")) {
        const base64Data = input.split(",")[1];
        buffer = Buffer.from(base64Data, "base64");
      } else if (input.startsWith("http")) {
        const res = await axios.get(input, { responseType: "arraybuffer" });
        buffer = Buffer.from(res.data);
        // Try to detect content-type from response if possible
        contentType = res.headers["content-type"] || contentType;
      } else {
        // raw base64
        buffer = Buffer.from(input, "base64");
      }
    } else {
      throw new Error("Invalid image input");
    }
  } catch (err) {
    console.error("Failed to prepare image buffer:", err);
    throw err;
  }

  const fileName = imageMeta?.id || `event-image-${Date.now()}.png`;

  // 2. Create FormData properly (this is the key part)
  const form = new FormData();
  form.append("file", buffer, {
    filename: fileName,
    contentType: contentType, // ← Explicitly tell Cloudflare it's an image
  });

  // Optional: you can also set a custom ID
  // form.append('id', fileName);

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      form,
      {
        headers: {
          ...form.getHeaders(), // ← This adds the correct boundary
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        maxBodyLength: Infinity, // important for large images
      },
    );

    if (response.data.success) {
      const result = response.data.result;
      const deliveryUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${result.id}/public`;

      return {
        cloudflareImageId: result.id,
        deliveryUrl,
      };
    } else {
      throw new Error(
        `Cloudflare upload failed: ${JSON.stringify(response.data.errors)}`,
      );
    }
  } catch (error) {
    console.error(
      "Cloudflare Images upload error:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
