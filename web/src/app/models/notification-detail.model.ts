
export interface NotificationDetail {
  notificationId: number;
  notificationDate: Date;
  imageId: string;
  title: string;
  message: string;
  userId: number;
  eventId: number;
  eventDate: Date;
  eventTimeZone: string;
  isRead?: boolean;
}
