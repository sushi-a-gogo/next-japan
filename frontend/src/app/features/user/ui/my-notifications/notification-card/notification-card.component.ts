import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EventNotification } from '@app/features/user/models/user-notification.model';
import { DateTimeService } from '@core/services/date-time.service';
import { ImageService } from '@core/services/image.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-card',
  imports: [NgOptimizedImage],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  private dateTimeService = inject(DateTimeService);
  private imageService = inject(ImageService);

  notification = input.required<EventNotification>();

  resizedImage = computed(() => {
    const image = this.notification().opportunity.event.image;
    if (image.cloudflareImageId) {
      return this.imageService.resizeImage(this.notification().opportunity.event.image, 168, 96);
    }

    return { src: 'assets/images/default-event.avif', image: { width: 1792, height: 1024 } };
  });

  notificationDate = computed(() => {
    const createdAt = new Date(this.notification().sendAt);
    const now = new Date();

    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday = createdAt.toDateString() === now.toDateString();

    // "Today Recent" (<= 2 hours)
    if (isToday && diffMinutes < 120) {
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      return `${diffHours}h ago`;
    }

    // "Today" (> 2 hours ago, same day)
    if (isToday) {
      return createdAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }); // e.g. "6:08 AM"
    }

    // "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (createdAt.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${createdAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    // "Earlier" (this week → show weekday + time, else date)
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return createdAt.toLocaleDateString([], {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }); // e.g. "Sun 9:19 AM"
    }

    // Older → fallback to month/day/year
    return createdAt.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  fullDate = computed(() => {
    const date = new Date(this.notification().opportunity.startDate);
    const formattedDate = this.dateTimeService.formatDateInLocaleTime(date, 'fullDate', this.notification().opportunity.timeZone);
    return formattedDate;
  });

  get imageSrc() {
    return this.notification().image
      ? `${environment.apiUrl}/images/${this.notification().image.id}`
      : 'assets/images/notification-default.png';
  }

}
