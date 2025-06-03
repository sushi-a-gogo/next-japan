import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NotificationDetail } from '@app/models/notification-detail.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-notification-card',
  imports: [DatePipe],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  notification = input.required<NotificationDetail>();

  get imageSrc() {
    return this.notification().imageId
      ? `${environment.apiUri}/${this.notification().imageId}`
      : 'assets/images/notification-default.png';
  }

}
