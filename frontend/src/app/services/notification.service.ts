import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { EventNotification } from '@app/models/user-notification.model';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiService = inject(ApiService);
  private apiUri = 'api/notifications';
  private errorService = inject(ErrorService);

  private notificationSignal = signal<EventNotification[]>([]);
  notifications = this.notificationSignal.asReadonly();

  private unreadNotificationCountSignal = signal<number>(0);
  unreadNotificationCount = this.unreadNotificationCountSignal.asReadonly();

  private id = 0;

  constructor() {
    effect(() => {
      this.unreadNotificationCountSignal.set(this.notifications().filter((n) => !n.isRead).length);
    });
  }

  getUserNotifications$(userId: string) {
    return this.fetchUserNotifications$(userId);
  }

  clearUserNotifications() {
    return this.notificationSignal.set([]);
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
