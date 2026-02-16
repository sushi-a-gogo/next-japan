import { effect, inject, Injectable } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { ApiResponse } from '@app/core/models/api-response.model';
import { UserProfile } from '@app/features/user/models/user-profile.model';
import { UserReward } from '@app/features/user/models/user-reward.model';
import { User } from '@app/features/user/models/user.model';
import { ApiService } from '@core/services/api.service';
import { ErrorService } from '@core/services/error.service';
import { ThemeService } from '@core/services/theme.service';
import { EventRegistrationService } from '@events/services/event-registration.service';
import { catchError, forkJoin, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiService = inject(ApiService);
  private auth = inject(AuthService);
  private eventRegistrationService = inject(EventRegistrationService);
  private notificationService = inject(NotificationService);
  private errorService = inject(ErrorService);
  private themeService = inject(ThemeService);
  private apiUri = 'api/user';

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.initGlobalUserData(user);
      } else {
        this.clearUserData();
      }
    });
  }

  getUsers$(): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>(`${this.apiUri}`).pipe(
      catchError((e) => this.errorService.handleError(e, 'Error fetching users.', true))
    );
  }

  getUser$(id: string): Observable<ApiResponse<UserProfile>> {
    return this.apiService.get<UserProfile>(`${this.apiUri}/${id}`).pipe(
      catchError((e) => this.errorService.handleError(e, 'Error fetching user.', true))
    );
  }

  initGlobalUserData(user: User) {
    this.themeService.setAppearance(user.mode);

    const observables = {
      notifications: this.notificationService.getUserNotifications$(user.userId),
      eventRegistrations: this.eventRegistrationService.getUserEventRegistrations$(user.userId),
    }
    forkJoin(observables).subscribe();
  }

  clearUserData() {
    this.eventRegistrationService.clearUserRegistrations();
    this.notificationService.clearUserNotifications();
    this.themeService.setAppearance();
  }

  getUserRewards$(id: string): Observable<ApiResponse<UserReward[]>> {
    return this.apiService.get<UserReward[]>(`${this.apiUri}/${id}/rewards`).pipe(
      catchError((e) => this.errorService.handleError(e, 'Error fetching user rewards.', true))
    );
  }

  updateProfile$(userProfile: UserProfile): Observable<ApiResponse<UserProfile>> {
    return this.apiService.put<UserProfile>(`${this.apiUri}/update`, userProfile).pipe(
      catchError((e) => {
        return this.errorService.handleError(e, 'Error updating user profile', true)
      })
    );
  }

  signUpUser$(firstName: string, lastName: string, email: string, subscriptionPlan: string): Observable<ApiResponse<User>> {
    const newUser = {
      firstName,
      lastName,
      email,
      subscriptionPlan,
      image: { id: '', width: 0, height: 0 },
      isEmailPreferred: true,
    };
    return this.apiService.post<User>(`${this.apiUri}/signup`, newUser).pipe(
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving user profile', true)
      })
    );
  }
}
