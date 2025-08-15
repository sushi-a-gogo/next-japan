import { effect, ElementRef, inject, Injectable, signal } from '@angular/core';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { NotificationDetail } from '@models/notification-detail.model';
import { map, Observable, of, Subject } from 'rxjs';
import { DateTimeService } from './date-time.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private dateTime = inject(DateTimeService);

  private notificationSignal = signal<NotificationDetail[]>([]);
  notifications = this.notificationSignal.asReadonly();

  private showNotificationSubject = new Subject<ElementRef>();
  showNotifications$ = this.showNotificationSubject.asObservable();

  private unreadNotificationCountSignal = signal<number>(0);
  unreadNotificationCount = this.unreadNotificationCountSignal.asReadonly();

  private id = 0;

  constructor() {
    effect(() => {
      this.unreadNotificationCountSignal.set(this.notifications().filter((n) => !n.isRead).length);
    });
  }

  markAsRead(notificationId: number) {
    this.notificationSignal.update((prev) => {
      return prev.map((n) => {
        if (n.notificationId === notificationId) {
          return {
            ...n,
            isRead: true
          }
        }

        return n;
      })
    });
  }

  markAllAsRead() {
    this.notificationSignal.update((prev) => {
      return prev.map((n) => {
        return {
          ...n,
          isRead: true
        }
      })
    });
  }

  sendRegistrationNotification(reg: EventRegistration) {
    const message = this.getRegistrationStatusMessage(reg.status);
    const notification: NotificationDetail = {
      notificationId: ++this.id, //this.getRandomIntInclusive(1, 1000000),
      notificationDate: new Date(),
      eventDate: reg.opportunity.startDate,
      eventTimeZone: reg.opportunity.timeZone,
      eventTimeZoneAbbreviation: reg.opportunity.timeZoneAbbreviation,
      userId: reg.userId || '',
      eventId: reg.opportunity.eventId,
      image: reg.image,
      title: reg.eventTitle,
      message,
    };

    this.notificationSignal.update((prev) => [notification, ...prev]);
  }

  showNotifications(elm: ElementRef) {
    this.showNotificationSubject.next(elm);
  }

  getUnreadNotificationCount$() {
    return this.getNotifications$().pipe(
      map((notifications) => {
        const count = notifications.filter((n: NotificationDetail) => !n.isRead).length;
        this.unreadNotificationCountSignal.set(count);
        return count;
      }),
    );
  }

  getNotifications$() {
    return of(this.notificationSignal());
  }

  getNotification$(notificationId: number) {
    return of(this.notificationSignal().find((n) => n.notificationId === notificationId))
  }

  updateNotifications$(notificationIds: number[], isRead: boolean) {
    return of(true);
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

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
