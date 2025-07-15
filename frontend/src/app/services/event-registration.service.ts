import { inject, Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { EventRegistration, RegistrationStatus } from '@app/pages/event/models/event-registration.model';
import { concatMap, delay, from, Observable, of, tap, toArray } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  private notificationService = inject(NotificationService);

  private registrationSignal = signal<EventRegistration[]>([]);
  registrations = this.registrationSignal.asReadonly();

  private id = 0;


  requestOpportunities$(requests: EventRegistration[], userId: number): Observable<EventRegistration[]> {
    return from(requests).pipe(
      concatMap((request) => this.addRegistration$(request, userId)),
      toArray()
    );
  }

  checkForConflict(opp: EventOpportunity, userId: number) {
    const selectedStartTime = new Date(opp.startDate);
    const selectedEndTime = new Date(opp.endDate);

    const items = this.registrations().filter((r) => r.userId === userId);
    const conflicted = items.filter((s) => {
      if (s.opportunity.opportunityId !== opp.opportunityId) {
        const startTime = new Date(s.opportunity.startDate);
        if (startTime >= selectedStartTime && startTime < selectedEndTime) {
          return true;
        }

        const endTime = new Date(s.opportunity.endDate);
        if (endTime > selectedStartTime && endTime <= selectedEndTime) {
          return true;
        }
      }

      return false;
    });

    return conflicted.length > 0;
  }

  private addRegistration$(registration: EventRegistration, userId: number): Observable<EventRegistration> {
    const userRegistration: EventRegistration = {
      ...registration,
      userId,
      registrationId: `reg_${userId}_${++this.id}`,
      status: RegistrationStatus.Requested,
    }

    const delayMs = Math.floor(Math.random() * (10 - 2 + 1) + 2) * 60_000; // random between 2 and 10 minutes in ms
    setTimeout(() => {
      this.registrationSignal.update((prev) =>
        prev.map((reg) => {
          if (reg.registrationId === userRegistration.registrationId) {
            const newReg = {
              ...userRegistration,
              status: RegistrationStatus.Registered
            };

            this.notificationService.sendRegistrationNotification(newReg);
            return newReg;
          }
          return reg;
        })
      );
    }, delayMs);

    return of(userRegistration).pipe(delay(250), tap(() => {
      this.registrationSignal.update((prev) => [...prev, userRegistration]);
      this.notificationService.sendRegistrationNotification(userRegistration);
    }));
  }

}
