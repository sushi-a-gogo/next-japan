import { AppImageData } from "./app-image-data.model";

export interface NotificationDetail {
  notificationId: number;
  notificationDate: Date;
  image: AppImageData;
  title: string;
  message: string;
  userId: string;
  eventId: string;
  eventDate: Date;
  eventTimeZone: string;
  isRead?: boolean;
}
