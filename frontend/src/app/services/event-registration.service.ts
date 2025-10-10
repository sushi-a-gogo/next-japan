import { inject, Injectable, signal } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { ApiResponse } from '@app/models/api-response.model';
import { EventRegistration, RegistrationStatus } from '@app/models/event/event-registration.model';
import { catchError, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class EventRegistrationService {
  private apiService = inject(ApiService);
  private apiUri = 'api/event-registrations';
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
    return this.apiService.get<EventRegistration>(`${this.apiUri}/${registrationId}`);
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
    return this.apiService.get<EventRegistration[]>(`${this.apiUri}/user/${userId}`).pipe(
      tap((res) => this.userEventRegistrationsSignal.set(res.data || []))
    );
  }

  private post$(registration: { userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.apiService.post<EventRegistration>(`${this.apiUri}`, registration).pipe(
      switchMap((res) => res.success && res.data ? this.getRegistration$(res.data.registrationId) : of(res)),
      tap((res) => {
        if (res.success && res.data) {
          this.registrationChange(res.data);
        }
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private put$(registration: { registrationId: string, userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.apiService.put<EventRegistration>(`${this.apiUri}/${registration.registrationId}`, registration).pipe(
      switchMap((res) => this.getRegistration$(registration.registrationId)),
      tap((res) => {
        if (res.success && res.data) {
          this.registrationChange(res.data);
        }
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private delete$(registration: EventRegistration) {
    return this.apiService.delete(`${this.apiUri}/${registration.registrationId}`).pipe(
      tap((res) => {
        if (res?.success) {
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
