import { computed, effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { EventNotification } from '@app/features/user/models/user-notification.model';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUri = 'api/notifications';
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);

  private lastUserId?: string;
  private refresh$ = new BehaviorSubject<void>(undefined);
  private refresh = effect(() => {
    if (this.lastUserId !== this.auth.user()?.userId) {
      this.lastUserId = this.auth.user()?.userId;
      this.refresh$.next();
    }
  });

  userNotifications = toSignal(this.syncUserNotifications$(), { initialValue: [] });

  unreadNotificationCount = computed(() =>
    this.userNotifications().filter((n) => !n.isRead).length
  );

  getNotification$(notificationId: string): Observable<ApiResponse<EventNotification>> {
    return this.apiService.get<EventNotification>(`${this.apiUri}/${notificationId}`);
  }

  markAsRead$(notification: EventNotification) {
    return this.delete$(notification.notificationId, notification.userId);
  }

  markAllAsRead$(userId: string) {
    return this.delete$('all', userId);
  }

  refreshUserNotifications() {
    this.refresh$.next();
  }

  private syncUserNotifications$() {
    return this.refresh$.pipe(
      switchMap(() => {
        const currentUser = this.auth.user();
        const currentUserId = currentUser?.userId;
        return currentUserId ? this.fetchUserNotifications$(currentUserId) : of({ success: true, data: [] });
      }),
      map((res) => res.data?.sort(this.sortByDate) || []),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error retrieving User Notifications', true)
      })
    )
  }

  private fetchUserNotifications$(userId: string) {
    return this.apiService.get<EventNotification[]>(`${this.apiUri}/user/${userId}`);
  }

  private post$(notification: { userId: string, opportunityId: string, title: string, message: string }) {
    return this.apiService.post(`${this.apiUri}`, notification).pipe(
      switchMap(() => this.fetchUserNotifications$(notification.userId)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving notification', true)
      })
    );
  }

  private delete$(id: string, userId: string) {
    return this.apiService.delete(`${this.apiUri}/${id}?userId=${userId}`).pipe(
      switchMap(() => this.fetchUserNotifications$(userId)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error deleting notification', true)
      })
    );
  }

  private sortByDate = (a: EventNotification, b: EventNotification) => {
    const t1 = new Date(a.sendAt).getTime();
    const t2 = new Date(b.sendAt).getTime();
    return t2 - t1;
  };
}

