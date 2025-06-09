import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { NotificationDetail } from '@app/models/notification-detail.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  notification = input.required<NotificationDetail>();

  get imageSrc() {
    return this.notification().image
      ? `${environment.apiUri}/images/${this.notification().image.id}`
      : 'assets/images/notification-default.png';
  }

}
