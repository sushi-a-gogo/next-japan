import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NotificationDetail } from '@app/models/notification-detail.model';
import { DateTimeService } from '@app/services/date-time.service';
import { ImageService } from '@app/services/image.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  private dateTimeService = inject(DateTimeService);
  private imageService = inject(ImageService);

  notification = input.required<NotificationDetail>();

  resizedImage = computed(() => {
    return this.imageService.resizeImage(this.notification().image, 168, 96);
  });

  fullDate = computed(() => {
    const date = new Date(this.notification().eventDate);
    const formattedDate = this.dateTimeService.formatDateInLocaleTime(date, 'fullDate', this.notification().eventTimeZone);
    return formattedDate;
  });

  get imageSrc() {
    return this.notification().image
      ? `${environment.apiUrl}/images/${this.notification().image.id}`
      : 'assets/images/notification-default.png';
  }

}
