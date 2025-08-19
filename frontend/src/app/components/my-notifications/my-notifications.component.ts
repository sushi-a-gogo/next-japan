import { Component, computed, DestroyRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { EventNotification } from '@app/models/user-notification.model';
import { NotificationService } from '@app/services/notification.service';
import { interval, switchMap } from 'rxjs';
import { NotificationCardComponent } from "./notification-card/notification-card.component";

@Component({
  selector: 'app-my-notifications',
  imports: [MatButtonModule, MatMenuModule, MatTooltipModule, NotificationCardComponent],
  templateUrl: './my-notifications.component.html',
  styleUrl: './my-notifications.component.scss'
})
export class MyNotificationsComponent implements OnInit {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  userId = input.required<string>();
  notificationMenuTrigger = viewChild<MatMenuTrigger>('notificationMenuTrigger')

  showClearAll = signal<boolean>(false);
  notifications = computed(() => {
    const items = this.notificationService.notifications();
    items.sort((a, b) => {
      const t1 = new Date(a.createdAt).getTime();
      const t2 = new Date(b.createdAt).getTime();
      return t2 - t1;
    });
    return items;
  });
  busy = signal<boolean>(false);

  ngOnInit(): void {
    // Start polling every 60 seconds
    interval(60_000)
      .pipe(
        switchMap(() => this.notificationService.getUserNotifications$(this.userId())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  menuToggle(isOpen: boolean) {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      setTimeout(() => this.showClearAll.set(false), 250);
      document.body.classList.remove('no-scroll');
    }
  }

  markAsReadAndNavigate(notification: EventNotification) {
    this.busy.set(true);
    this.notificationService.markAsRead$(notification).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.busy.set(false);
        if (notification.eventId) {
          this.router.navigate([`/event/${notification.eventId}`]);
        }
      },
      error: () => this.busy.set(false)
    });
  }

  clickX(e: any) {
    if (this.notifications().length) {
      e.stopPropagation();
      if (this.showClearAll()) {
        this.markAllAsRead();
      } else {
        this.showClearAll.set(true);
      }
    }
  }

  private markAllAsRead() {
    this.busy.set(true);
    this.notificationService.markAllAsRead$(this.userId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.busy.set(false);
        this.notificationMenuTrigger()?.closeMenu();
      },
      error: () => this.busy.set(false)
    });
  }
}
