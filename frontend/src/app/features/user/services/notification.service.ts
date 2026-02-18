import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { EventNotification } from '@app/features/user/models/user-notification.model';
import { catchError, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUri = 'api/notifications';
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);

  private notificationSignal = signal<EventNotification[]>([]);
  notifications = this.notificationSignal.asReadonly();

  unreadNotificationCount = computed(() =>
    this.notifications().filter((n) => !n.isRead).length
  );

  private userEffect = effect(() => {
    this.syncUserNotifications(this.auth.user()?.userId);
  });

  getUserNotifications$(userId: string) {
    return this.fetchUserNotifications$(userId);
  }

  getNotification$(notificationId: string): Observable<ApiResponse<EventNotification>> {
    return this.apiService.get<EventNotification>(`${this.apiUri}/${notificationId}`);
  }

  markAsRead$(notification: EventNotification) {
    return this.delete$(notification.notificationId, notification.userId);
  }

  markAllAsRead$(userId: string) {
    return this.delete$('all', userId);
  }

  private syncUserNotifications(userId?: string) {
    if (userId) {
      this.fetchUserNotifications$(userId).pipe(take(1)).subscribe();
    } else {
      this.notificationSignal.set([]);;
    }
  }

  private fetchUserNotifications$(userId: string) {
    return this.apiService.get<EventNotification[]>(`${this.apiUri}/user/${userId}`).pipe(
      tap((res) => this.notificationSignal.set(res.data || [])),
      catchError((e) => this.errorService.handleError(e, 'Error fetching notifications', true))
    );
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
}
