import { AppImageData } from "@app/core/models/app-image-data.model";
import { CalendarDate } from "./calendar-date.model";

export interface EventData {
  eventId: string;
  locationId: string;
  createdAt: string;
  eventTitle: string;
  description: string;
  image: AppImageData,
  aiProvider?: string;
  nextOpportunityDate?: CalendarDate;
}
