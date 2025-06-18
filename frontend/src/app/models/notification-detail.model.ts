import { AppImageData } from "./app-image-data.model";

export interface NotificationDetail {
  notificationId: number;
  notificationDate: Date;
  image: AppImageData;
  title: string;
  message: string;
  userId: number;
  eventId: number;
  eventDate: Date;
  eventTimeZone: string;
  isRead?: boolean;
}
