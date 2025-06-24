import { inject, Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { EventRegistration, RegistrationStatus } from '@app/pages/event/models/event-registration.model';
import { concatMap, delay, from, Observable, of, tap, toArray } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private notificationService = inject(NotificationService);

  private registrationSignal = signal<EventRegistration[]>([]);
  registrations = this.registrationSignal.asReadonly();

  private id = 0;


  requestOpportunities$(opportunities: EventOpportunity[], userId: number): Observable<EventRegistration[]> {
    return from(opportunities).pipe(
      concatMap((opportunity) => this.addRegistration$(opportunity, userId)),
      toArray()
    );
  }

  checkForConflict(opp: EventOpportunity, userId: number) {
    const selectedStartTime = new Date(opp.startDate);
    const selectedEndTime = new Date(opp.endDate);

    const items = this.registrations().filter((r) => r.userId === userId);
    const conflicted = items.filter((s) => {
      if (s.opportunityId !== opp.opportunityId) {
        const startTime = new Date(s.startDate);
        if (startTime >= selectedStartTime && startTime < selectedEndTime) {
          return true;
        }

        const endTime = new Date(s.endDate);
        if (endTime > selectedStartTime && endTime <= selectedEndTime) {
          return true;
        }
      }

      return false;
    });

    return conflicted.length > 0;
  }

  private addRegistration$(opportunity: EventOpportunity, userId: number): Observable<EventRegistration> {
    const registration: EventRegistration = {
      ...opportunity,
      userId,
      registrationId: ++this.id,
      status: RegistrationStatus.Requested,
    }

    const delayMs = Math.floor(Math.random() * (10 - 2 + 1) + 2) * 60_000; // random between 2 and 10 minutes in ms
    setTimeout(() => {
      this.registrationSignal.update((prev) =>
        prev.map((reg) => {
          if (reg.registrationId === registration.registrationId) {
            const newReg = {
              ...reg,
              status: RegistrationStatus.Registered
            };

            this.notificationService.sendRegistrationNotification(newReg);
            return newReg;
          }
          return reg;
        })
      );
    }, delayMs);

    return of(registration).pipe(delay(250), tap(() => {
      this.registrationSignal.update((prev) => [...prev, registration]);
      this.notificationService.sendRegistrationNotification(registration);
    }));
  }

}
