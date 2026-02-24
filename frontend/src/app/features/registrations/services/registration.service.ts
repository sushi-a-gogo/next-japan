import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { EventRegistration, RegistrationStatus } from '@app/features/registrations/models/event-registration.model';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUri = 'api/event-registrations';
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);

  private lastUserId?: string;
  private refresh$ = new Subject<void>();
  private refresh = effect(() => {
    if (this.lastUserId !== this.auth.user()?.userId) {
      this.lastUserId = this.auth.user()?.userId;
      this.refresh$.next();
    }
  });

  pendingRefreshSignal = signal(false);
  pendingRefresh = this.pendingRefreshSignal.asReadonly();
  userEventRegistrations = toSignal(this.syncUserRegistrations$(), { initialValue: [] });

  getRegistration$(registrationId: string): Observable<ApiResponse<EventRegistration>> {
    return this.apiService.get<EventRegistration>(`${this.apiUri}/${registrationId}`);
  }

  refreshUserRegistrations() {
    this.refresh$.next();
  }

  registerUserToOpportunity$(userId: string, opportunityId: string): Observable<ApiResponse<EventRegistration>> {
    const userRegistration = {
      userId,
      opportunityId,
      status: RegistrationStatus.Requested,
    }
    return this.post$(userRegistration);
  }

  cancelRegistration$(registration: EventRegistration) {
    return this.delete$(registration);
  }

  private syncUserRegistrations$() {
    return this.refresh$.pipe(
      switchMap(() => {
        this.pendingRefreshSignal.set(true);
        const currentUser = this.auth.user();
        const currentUserId = currentUser?.userId;
        if (!currentUserId) {
          return of({ success: true, data: [] });
        }

        return this.fetchUserRegistrations$(currentUserId)
      }),
      map((res) => {
        this.pendingRefreshSignal.set(false);
        return res.data?.sort(this.sortByDate) || [];
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error retrieving Event Registrations', true)
      })
    );
  }

  private fetchUserRegistrations$(userId: string) {
    return this.apiService.get<EventRegistration[]>(`${this.apiUri}/user/${userId}`);
  }

  private post$(registration: { userId: string, opportunityId: string, status: RegistrationStatus }) {
    return this.apiService.post<EventRegistration>(`${this.apiUri}`, registration).pipe(
      switchMap((res) => res.success && res.data ? this.getRegistration$(res.data.registrationId) : of(res)),
      tap((res) => {
        if (res.success && res.data) {
          this.registrationChanged(res.data);
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
          this.registrationChanged(res.data);
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
          this.registrationChanged({
            ...registration,
            status: RegistrationStatus.Cancelled
          });
        }
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving Event Registration', true)
      })
    );
  }

  private registrationChanged(registration: EventRegistration) {
    this.refresh$.next();
  }

  private sortByDate = (a: EventRegistration, b: EventRegistration) =>
    new Date(a.opportunity.startDate).getTime() -
    new Date(b.opportunity.startDate).getTime();
}
