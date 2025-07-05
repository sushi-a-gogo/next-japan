import { AppImageData } from "@app/models/app-image-data.model";
import { CalendarDate } from "@app/models/calendar-date.model";

export interface EventData {
  eventId: string;
  eventTitle: string;
  description: string;
  image: AppImageData,
  nextOpportunityDate?: CalendarDate;
}
