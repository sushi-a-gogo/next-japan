import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@app/models/user.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { UserProfile } from '@models/user-profile.model';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private apiUri = `${environment.apiUrl}/api/user`;

  getUsers$() {
    return this.http.get<{ users: UserProfile[] }>(`${this.apiUri}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUsers'),
      map((resp) => resp.users),
      catchError((e) => this.errorService.handleError(e, 'Error fetching users.', true))
    );
  }

  getUser$(id: string) {
    return this.http.get<{ user: UserProfile }>(`${this.apiUri}/${id}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getUser'),
      catchError((e) => this.errorService.handleError(e, 'Error fetching user.', true))
    );
  }

  updateProfile$(userProfile: UserProfile): Observable<{ data: UserProfile }> {
    return this.http.put<UserProfile>(`${this.apiUri}/update`, userProfile).pipe(
      debug(RxJsLoggingLevel.DEBUG, "saveUser"),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error updating user profile', true)
      })
    );
  }

  signUpUser$(firstName: string, lastName: string, email: string, subscriptionPlan: string) {
    const newUser = {
      firstName,
      lastName,
      email,
      subscriptionPlan,
      image: { id: '', width: 0, height: 0 },
      isEmailPreferred: true,
    };
    return this.http.post<User>(`${this.apiUri}/signup`, newUser).pipe(
      debug(RxJsLoggingLevel.DEBUG, "signUpUser"),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error saving user profile', true)
      })
    );
  }
}
