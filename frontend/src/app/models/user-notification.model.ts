import { AppImageData } from "./app-image-data.model";

export interface UserNotification {
  userId: string;
  notificationId: string;
  createdAt: string;
  sendAt: string;
  title: string;
  message: string;
  image: AppImageData;
  isRead?: boolean;
}

export interface EventNotification extends UserNotification {
  eventId: string;
  eventDate: string;
  eventTimeZone: string;
  eventTimeZoneAbbreviation: string;
  eventTitle: string;
  registrationId: string;
}
