import { Injectable, signal } from '@angular/core';
import { UserProfile } from '@models/user-profile.model';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { DUMMY_USERS } from 'src/data/users/default-user';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private user = signal<UserProfile | null>(null);
  userProfile = this.user.asReadonly();

  clearUserProfile() {
    this.user.set(null);
    return of({});
  }

  setUserProfile$(userId: number) {
    let index = DUMMY_USERS.findIndex((u: UserProfile) => u.userId === userId);
    if (index === -1) {
      index = Math.floor(Math.random() * DUMMY_USERS.length);
    }

    const selected = DUMMY_USERS[index];
    return of(selected).pipe(
      tap((profile) => {
        const userProfile = profile
        this.user.set(userProfile);
      })
    );

  }

  updateProfile$(userProfile: UserProfile): Observable<UserProfile> {
    const prevUser = this.user();
    this.user.set(userProfile);

    return of(userProfile).pipe(delay(100), catchError((err) => {
      this.user.set(prevUser);
      return throwError(() => new Error('User update failed.'))
    }));
  }
}
