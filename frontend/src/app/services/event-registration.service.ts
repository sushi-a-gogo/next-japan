import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { ApiResponse } from '@app/models/api-response.model';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  private http = inject(HttpClient);
  private apiUri = `${environment.apiUrl}/api/event-registrations`;
  private errorService = inject(ErrorService);
  private eventRegistrationCache = new HttpClientCache<ApiResponse<EventRegistration[]>>(60, 1);
  private userEventRegistrationsSignal = signal<EventRegistration[]>([]);
  userEventRegistrations = this.userEventRegistrationsSignal.asReadonly();

  getUserEventRegistrations$(userId: string, allowCached = true): Observable<ApiResponse<EventRegistration[]>> {
    const key = `eventRegistrations`
    if (allowCached && this.eventRegistrationCache.existsInCache(key)) {
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
    const userRegistration = {
      userId,
      opportunityId,
      status: RegistrationStatus.Requested,
    }
    return this.post$(userRegistration).pipe(
      switchMap(() => {
        this.eventRegistrationCache.clear();
        return this.getUserEventRegistrations$(userId);
      })
    );
  }

  cancelRegistration$(registration: EventRegistration) {
    return this.delete$(registration);
  }

  private fetchRegistrations$(userId: string) {
    return this.http.get<ApiResponse<EventRegistration[]>>(`${this.apiUri}/user/${userId}`).pipe(
      tap((resp) => this.userEventRegistrationsSignal.set(resp.data || [])),
      debug(RxJsLoggingLevel.DEBUG, 'getRegistrations')
    );
  }

  private post$(registration: { userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.post(`${this.apiUri}`, registration).pipe(
      debug(RxJsLoggingLevel.DEBUG, "post EventRegistration"),
      switchMap((resp) => this.getRegistration$(resp.data.registrationId)),
      tap((resp) => {
        this.registrationChange(resp.data);
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private put$(registration: { registrationId: string, userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.http.put(`${this.apiUri}/${registration.registrationId}`, registration).pipe(
      debug(RxJsLoggingLevel.DEBUG, "put EventRegistration"),
      switchMap((resp) => this.getRegistration$(resp.data.registrationId)),
      tap((resp) => {
        this.registrationChange(resp.data);
      }),
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
          this.registrationChange(registration);
        }
        return of(false);
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private registrationChange(registration: EventRegistration) {
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
