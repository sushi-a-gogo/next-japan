import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, concatMap, from, map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  private http = inject(HttpClient);
  private apiUri = `${environment.apiUrl}/api/registrations`;

  private notificationService = inject(NotificationService);
  private errorService = inject(ErrorService);

  private registrationSignal = signal<EventRegistration[]>([]);
  registrations = this.registrationSignal.asReadonly();

  private eventRegistrationCache = new HttpClientCache<EventRegistration[]>(60, 1);

  getRegistrations$(userId: string) {
    const key = `eventRegistrations:${userId}`
    if (this.eventRegistrationCache.existsInCache(key)) {
      const cached = this.eventRegistrationCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchRegistrations$(userId).pipe(
      shareReplay(1)
    );
    this.eventRegistrationCache.set(key, obs$);

    return obs$;
  }

  requestOpportunities$(userId: string, opportunityIds: string[]): Observable<EventRegistration[]> {
    return from(opportunityIds).pipe(
      concatMap((opportunityId) => this.addRegistration$(opportunityId, userId)),
      switchMap(() => {
        this.eventRegistrationCache.clear();
        return this.fetchRegistrations$(userId);
      })
    );
  }

  cancelRegistration$(registration: EventRegistration) {
    const req = {
      registrationId: registration.registrationId!,
      userId: registration.userId!,
      opportunityId: registration.opportunity.opportunityId,
      status: RegistrationStatus.Cancelled
    };

    return this.put$(req).pipe(
      tap((resp) => {
        if (resp?.ok) {
          this.registrationSignal.update((prev) => {
            return prev.map((r) => {
              if (r.registrationId === req.registrationId) {
                r.status = RegistrationStatus.Cancelled;
              }
              return r;
            })
          });
          this.notificationService.sendRegistrationNotification(registration);
        }
      })
    );
  }

  checkForConflict(opp: EventOpportunity, userId: string) {
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

  private fetchRegistrations$(userId: string) {
    return this.http.get<{ registrations: EventRegistration[] }>(`${this.apiUri}/user/${userId}`).pipe(
      map((resp) => {
        this.registrationSignal.set(resp.registrations || []);
        return resp.registrations;
      }),
      debug(RxJsLoggingLevel.DEBUG, 'getRegistrations')
    )
  }

  private addRegistration$(opportunityId: string, userId: string) {
    const userRegistration = {
      userId,
      opportunityId,
      status: RegistrationStatus.Requested,
    }
    let registrationId: string | undefined = undefined;

    const delayMs = Math.floor(Math.random() * (10 - 2 + 1) + 2) * 60_000; // random between 2 and 10 minutes in ms
    setTimeout(() => {
      if (registrationId) {
        this.put$({ ...userRegistration, registrationId }).subscribe();
      }
    }, delayMs);

    return this.post$(userRegistration).pipe(tap((resp) => {
      registrationId = resp?.body?.data?.registrationId;
    }));
  }

  private post$(registration: { userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.post(`${this.apiUri}`, registration, { observe: 'response' }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "post EventRegistration"),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }


  private put$(registration: { registrationId: string, userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.put(`${this.apiUri}/${registration.registrationId}`, registration, { observe: 'response' }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "put EventRegistration"),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }
}
