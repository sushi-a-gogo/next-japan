import { effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { EventRegistration, RegistrationStatus } from '@app/features/registrations/models/event-registration.model';
import { catchError, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUri = 'api/event-registrations';
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);

  // user event registrations sorted by date ASC
  private userEventRegistrationsSignal = signal<EventRegistration[]>([]);
  userEventRegistrations = this.userEventRegistrationsSignal.asReadonly();
  private hasCheckedRegistrations = signal(false);
  hasCheckedUserEventRegistrations = this.hasCheckedRegistrations.asReadonly();

  // Optional: track last known userId to avoid redundant fetches
  private lastProcessedUserId?: string;

  //Trigger fetch when user changes (guarded effect)
  private userChangeEffect = effect(() => {
    const currentUser = this.auth.user();
    const currentUserId = currentUser?.userId;

    // Skip if same userId (prevents double-run on unrelated CD cycles)
    if (currentUserId === this.lastProcessedUserId) {
      this.hasCheckedRegistrations.set(this.auth.loginStatus() !== 'pending');
      return;
    }

    this.lastProcessedUserId = currentUserId;

    if (!currentUserId) {
      // No user - clear data, set checked based on login status
      this.userEventRegistrationsSignal.set([]);
      this.hasCheckedRegistrations.set(this.auth.loginStatus() !== 'pending');
      return;
    }

    // Real user - start fetch
    this.hasCheckedRegistrations.set(false);  // loading starts
    this.fetchUserRegistrations$(currentUserId).pipe(take(1)).subscribe({
      next: () => this.hasCheckedRegistrations.set(true),  // done
      error: () => this.hasCheckedRegistrations.set(true)  // or handle error state
    });
  });

  // private userEffect = effect(() => {
  //   this.syncUserRegistrations(this.auth.user()?.userId);
  // });

  getRegistration$(registrationId: string): Observable<ApiResponse<EventRegistration>> {
    return this.apiService.get<EventRegistration>(`${this.apiUri}/${registrationId}`);
  }

  refreshUserRegistrations$() {
    const userId = this.auth.user()?.userId;
    return userId ? this.fetchUserRegistrations$(userId) : of({ success: true, data: [] });
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

  private syncUserRegistrations(userId?: string) {
    this.hasCheckedRegistrations.set(false);
    if (userId) {
      this.fetchUserRegistrations$(userId).pipe(take(1)).subscribe(() => {
        this.hasCheckedRegistrations.set(true);
      });
    } else {
      this.userEventRegistrationsSignal.set([]);
      this.hasCheckedRegistrations.set(this.auth.loginStatus() !== 'pending');
    }
  }

  private fetchUserRegistrations$(userId: string) {
    return this.apiService.get<EventRegistration[]>(`${this.apiUri}/user/${userId}`).pipe(
      tap((res) =>
        this.userEventRegistrationsSignal.set(
          [...(res.data ?? [])].sort(this.sortByDate)
        )
      )
    );
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
    this.userEventRegistrationsSignal.update((prev) => {
      let next: EventRegistration[];

      if (registration.status === RegistrationStatus.Cancelled) {
        next = prev.filter((r) => r.registrationId !== registration.registrationId);
      } else {
        next = prev.some(reg => reg.registrationId === registration.registrationId)
          ? prev.map(reg => reg.registrationId === registration.registrationId ? registration : reg)
          : [...prev, registration];
      }

      return next.sort(this.sortByDate);
    });
  }

  private sortByDate = (a: EventRegistration, b: EventRegistration) =>
    new Date(a.opportunity.startDate).getTime() -
    new Date(b.opportunity.startDate).getTime();
}
