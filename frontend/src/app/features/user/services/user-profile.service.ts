import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/core/models/api-response.model';
import { User } from '@app/core/models/user.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { UserProfile } from '@app/features/user/models/user-profile.model';
import { UserReward } from '@app/features/user/models/user-reward.model';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUri = 'api/user';
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);

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
}
