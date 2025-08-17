import { Component, computed, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { EventNotification } from '@app/models/user-notification.model';
import { NotificationService } from '@app/services/notification.service';
import { NotificationCardComponent } from "./notification-card/notification-card.component";

@Component({
  selector: 'app-my-notifications',
  imports: [MatButtonModule, MatMenuModule, MatTooltipModule, NotificationCardComponent],
  templateUrl: './my-notifications.component.html',
  styleUrl: './my-notifications.component.scss'
})
export class MyNotificationsComponent {
  userId = input.required<string>();
  notificationMenuTrigger = viewChild<MatMenuTrigger>('notificationMenuTrigger')

  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  showClearAll = signal<boolean>(false);
  notifications = computed(() =>
    this.notificationService.notifications().filter((n) => n.userId === this.userId() && !n.isRead)
  );

  menuToggle(isOpen: boolean) {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      setTimeout(() => this.showClearAll.set(false), 250);
      document.body.classList.remove('no-scroll');
    }
  }

  markAsReadAndNavigate(notification: EventNotification) {
    this.notificationService.markAsRead$(notification).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (notification.eventId) {
        this.router.navigate([`/event/${notification.eventId}`]);
      }
    });
  }

  clickX(e: any) {
    if (this.notifications().length) {
      e.stopPropagation();
      if (this.showClearAll()) {
        //this.notificationService.markAllAsRead();
        this.notificationMenuTrigger()?.closeMenu();
      } else {
        this.showClearAll.set(true);
      }
    }
  }

}
