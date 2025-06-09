import { AppImageData } from "@app/models/app-image-data.model";
import { CalendarDate } from "@app/models/calendar-date.model";

export interface EventData {
  eventId: number;
  eventTitle: string;
  description: string;
  image: AppImageData,
  nextOpportunity?: CalendarDate;
}
