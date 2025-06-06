import { CalendarDate } from "@app/models/calendar-date.model";

export interface EventData {
  eventId: number;
  imageId: string;
  eventTitle: string;
  description: string;
  imagePos?: string;
  nextOpportunity?: CalendarDate;
}
