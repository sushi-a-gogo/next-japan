import { AppImageData } from "@app/models/app-image-data.model";

export interface AiEvent {
  eventTitle: string;
  description: string;
  image: AppImageData
  text?: string;
}
