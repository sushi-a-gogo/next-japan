import { AppImageData } from "@app/core/models/app-image-data.model";

export interface AiEvent {
  eventTitle: string;
  description: string;
  fullDescription?: string;
  image: AppImageData;
  imageUrl: string;
  aiProvider: string;
  prompt?: { text: string; image: string }
}

