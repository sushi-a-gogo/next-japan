import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { ApiResponse } from '@app/models/api-response.model';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, Observable, shareReplay, switchMap, tap } from 'rxjs';
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

  private userEventRegistrationsSignal = signal<EventRegistration[]>([]);
  userEventRegistrations = this.userEventRegistrationsSignal.asReadonly();

  private eventRegistrationCache = new HttpClientCache<ApiResponse<EventRegistration[]>>(60, 1);

  getUserEventRegistrations$(userId: string): Observable<ApiResponse<EventRegistration[]>> {
    const key = `eventRegistrations`
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

  clearUserRegistrations() {
    this.userEventRegistrationsSignal.set([]);
    this.eventRegistrationCache.clear();
  }

  getRegistration$(registrationId: string): Observable<ApiResponse<EventRegistration>> {
    return this.http.get<ApiResponse<EventRegistration>>(`${this.apiUri}/${registrationId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getRegistration')
    )
  }

  requestOpportunity$(userId: string, opportunityId: string): Observable<ApiResponse<EventRegistration[]>> {
    return this.addRegistration$(opportunityId, userId).pipe(
      switchMap(() => {
        this.eventRegistrationCache.clear();
        return this.fetchRegistrations$(userId);
      })
    );
  }

  cancelRegistration$(registration: EventRegistration) {
    return this.delete$(registration);
  }

  checkForConflict(opp: EventOpportunity, userId: string) {
    const selectedStartTime = new Date(opp.startDate);
    const selectedEndTime = new Date(opp.endDate);

    const items = this.userEventRegistrations().filter((r) => r.userId === userId);
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
    return this.http.get<ApiResponse<EventRegistration[]>>(`${this.apiUri}/user/${userId}`).pipe(
      tap((resp) => this.userEventRegistrationsSignal.set(resp.data || [])),
      debug(RxJsLoggingLevel.DEBUG, 'getRegistrations')
    );
  }

  private addRegistration$(opportunityId: string, userId: string) {
    const userRegistration = {
      userId,
      opportunityId,
      status: RegistrationStatus.Requested,
    }
    let registrationId: string | undefined = undefined;

    const delayMs = Math.floor(Math.random() * (10 - 2 + 1) + 2) * 60000; // random between 2 and 10 minutes in ms
    setTimeout(() => {
      const registration = this.userEventRegistrationsSignal()
        .find((r) => r.registrationId === registrationId && r.status !== RegistrationStatus.Cancelled);
      if (registration) {
        this.put$({
          ...userRegistration,
          registrationId: registration.registrationId!,
          status: RegistrationStatus.Registered
        }).subscribe();
      }
    }, delayMs);

    return this.post$(userRegistration).pipe(tap((resp) => {
      registrationId = resp.data.registrationId;
    }));
  }

  private post$(registration: { userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.post(`${this.apiUri}`, registration).pipe(
      debug(RxJsLoggingLevel.DEBUG, "post EventRegistration"),
      switchMap((resp) => this.getRegistration$(resp.data.registrationId)),
      tap((resp) => this.registrationChange(resp.data)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private put$(registration: { registrationId: string, userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.put(`${this.apiUri}/${registration.registrationId}`, registration).pipe(
      debug(RxJsLoggingLevel.DEBUG, "put EventRegistration"),
      switchMap((resp) => this.getRegistration$(resp.data.registrationId)),
      tap((resp) => this.registrationChange(resp.data)),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private delete$(registration: EventRegistration) {
    return this.http.delete(`${this.apiUri}/${registration.registrationId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "delete EventRegistration"),
      tap((resp) => {
        if (resp?.success) {
          registration.status = RegistrationStatus.Cancelled;
          this.registrationChange(registration)
        }
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private registrationChange(registration: EventRegistration) {
    this.notificationService.sendRegistrationNotification(registration);
    this.userEventRegistrationsSignal.update((prev) => {
      if (registration.status === RegistrationStatus.Cancelled) {
        return prev.filter((r) => r.registrationId !== registration.registrationId);
      }

      return prev.some(reg => reg.registrationId === registration.registrationId)
        ? prev.map(reg => reg.registrationId === registration.registrationId ? registration : reg)
        : [...prev, registration];
    });
    this.eventRegistrationCache.clear();
  }
}
