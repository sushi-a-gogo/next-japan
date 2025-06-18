import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NotificationDetail } from '@app/models/notification-detail.model';
import { ImageService } from '@app/services/image.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  private imageService = inject(ImageService);

  notification = input.required<NotificationDetail>();

  resizedImage = computed(() => {
    return this.imageService.resizeImage(this.notification().image, 80, 80);
  });

  get imageSrc() {
    return this.notification().image
      ? `${environment.apiUrl}/images/${this.notification().image.id}`
      : 'assets/images/notification-default.png';
  }

}
