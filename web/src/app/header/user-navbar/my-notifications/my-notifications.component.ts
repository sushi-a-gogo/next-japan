import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { NotificationDetail } from '@app/models/notification-detail.model';
import { NotificationService } from '@app/services/notification.service';
import { NotificationCardComponent } from "./notification-card/notification-card.component";

@Component({
  selector: 'app-my-notifications',
  imports: [MatButtonModule, MatMenuModule, MatTooltipModule, NotificationCardComponent],
  templateUrl: './my-notifications.component.html',
  styleUrl: './my-notifications.component.scss'
})
export class MyNotificationsComponent {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  unreadNotificationCount = this.notificationService.unreadNotificationCount;

  notifications = computed(() => this.notificationService.notifications().filter((n) => !n.isRead));

  menuToggle(isOpen: boolean) {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  markAsReadAndNavigate(notification: NotificationDetail) {
    this.notificationService.markAsRead(notification.notificationId);
    this.router.navigate([`/event/${notification.eventId}`]);
  }

}
