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
  opportunity: {
    opportunityId: string,
    startDate: string,
    endDate: string,
    timeZone: string,
    timeZoneAbbreviation: string,
    event: {
      eventId: string,
      eventTitle: string,
      image: {
        id: string,
        cloudflareImageId: string,
        width: number,
        height: number,
      },
    },
  }
  registrationId: string;
}
