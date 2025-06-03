import { inject, Injectable, signal } from '@angular/core';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { EventRegistration, RegistrationStatus } from '@app/event/models/event-registration.model';
import { ApiResult } from '@app/models/api-result.model';
import { concatMap, delay, from, map, Observable, of, tap, toArray } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private notificationService = inject(NotificationService);

  private registrationSignal = signal<EventRegistration[]>([]);
  registrations = this.registrationSignal.asReadonly();

  private id = 0;


  requestOpportunities$(opportunities: EventOpportunity[], userId: number): Observable<ApiResult> {
    return from(opportunities).pipe(
      concatMap((opportunity) => this.addRegistration$(opportunity, userId)),
      toArray(),
      map((items) => {
        return { retVal: items };
      })
    );
  }

  checkForConflict(opp: EventOpportunity) {
    const selectedStartTime = new Date(opp.startDate);
    const selectedEndTime = new Date(opp.endDate);

    const items = [...this.registrations()];
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
    }, 120000);

    return of(registration).pipe(delay(250), tap(() => {
      this.registrationSignal.update((prev) => [...prev, registration]);
      this.notificationService.sendRegistrationNotification(registration);
    }));
  }

}
