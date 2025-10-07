import axios from "axios";
import FormData from "form-data";

export const uploadImageToCloudflare = async (filename, imageUrl) => {
  const formData = new FormData();
  const imageBuffer = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  formData.append("file", imageBuffer.data, { filename });

  const uploadUrl = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`;
  const cloudflareResponse = await axios.post(uploadUrl, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    },
  });

  if (!cloudflareResponse.data.success)
    throw new Error("Cloudflare upload failed");

  const cloudflareImageId = cloudflareResponse.data.result.id;
  const deliveryUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${cloudflareImageId}/public?w=1792&h=1024&format=webp`;

  return { cloudflareImageId, deliveryUrl };
};
