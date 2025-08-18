import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { EventNotification, UserNotification } from '@app/models/user-notification.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUri = `${environment.apiUrl}/api/notifications`;
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

  sendRegistrationNotification$(reg: EventRegistration) {
    const message = this.getRegistrationStatusMessage(reg.status);
    const notification = {
      userId: reg.userId,
      opportunityId: reg.opportunity.opportunityId,
      title: reg.eventTitle,
      message,
    };

    return this.post$(notification);
  }

  getNotification$(notificationId: string): Observable<ApiResponse<EventNotification>> {
    return this.http.get<ApiResponse<EventNotification>>(`${this.apiUri}/${notificationId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getNotification')
    )
  }

  markAsRead$(notification: EventNotification) {
    return this.delete$(notification);
  }

  markAllAsRead$() {
    this.notificationSignal.update((prev) => {
      return prev.map((n) => {
        return {
          ...n,
          isRead: true
        }
      })
    });
  }

  private getRegistrationStatusMessage(status?: RegistrationStatus) {
    switch (status) {
      case RegistrationStatus.Requested:
        return 'We have received your registration request!';
      case RegistrationStatus.Registered:
        return 'Your event registration has been confirmed. We look forward to seeing you!';
      case RegistrationStatus.Cancelled:
        return 'Your event registration has been cancelled.';
      default:
        return 'Registration status not found.'
    }
  }

  private fetchUserNotifications$(userId: string) {
    return this.http.get<ApiResponse<EventNotification[]>>(`${this.apiUri}/user/${userId}`).pipe(
      tap((resp) => this.notificationSignal.set(resp.data || [])),
      debug(RxJsLoggingLevel.DEBUG, 'getNotifications')
    );
  }

  private post$(notification: { userId: string, opportunityId: string, title: string, message: string }) {
    return this.http.post(`${this.apiUri}`, notification).pipe(
      debug(RxJsLoggingLevel.DEBUG, "post User Notification"),
      switchMap(() => this.fetchUserNotifications$(notification.userId)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private delete$(notification: UserNotification) {
    return this.http.delete(`${this.apiUri}/${notification.notificationId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "delete Notification"),
      switchMap(() => this.fetchUserNotifications$(notification.userId)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error deleting notification', true)
      })
    );
  }
}
