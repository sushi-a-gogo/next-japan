import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
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
  styleUrl: './my-notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MyNotificationsComponent implements OnInit {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  userId = input.required<string>();
  notificationMenuTrigger = viewChild<MatMenuTrigger>('notificationMenuTrigger')

  notifications = computed(() => {
    const items = this.notificationService.notifications();
    items.sort((a, b) => {
      const t1 = new Date(a.sendAt).getTime();
      const t2 = new Date(b.sendAt).getTime();
      return t2 - t1;
    });

    return items;
  });
  busy = signal<boolean>(false);

  private scrollPosition = 0;

  ngOnInit(): void {
    // Start polling every 60 seconds
    interval(60_000)
      .pipe(
        switchMap(() => this.notificationService.getUserNotifications$(this.userId())),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  menuToggle(menuOpen: boolean) {
    if (menuOpen) {
      this.scrollPosition = window.scrollY; // Store the current scroll position
      document.body.classList.add('overflow-clip');
      document.body.style.top = `-${this.scrollPosition}px`; // Apply negative top to maintain position
    } else {
      document.body.classList.remove('overflow-clip');
      document.body.style.top = ''; // Remove the fixed position
      window.scrollTo(0, this.scrollPosition); // Restore the scroll position
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

  clickX() {
    this.notificationMenuTrigger()?.closeMenu();
  }

  markAllAsRead() {
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
