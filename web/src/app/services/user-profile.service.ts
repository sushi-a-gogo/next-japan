import { Injectable, signal } from '@angular/core';
import { ApiResult } from '@app/models/api-result.model';
import { UserProfile } from '@models/user-profile.model';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { DUMMY_USERS } from 'src/data/users/default-user';
import { AppImageData } from '../models/app-image-data.model';

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

  getUserProfile$(): Observable<ApiResult> {
    const index = Math.floor(Math.random() * DUMMY_USERS.length);
    const selected = DUMMY_USERS[index];
    const res: ApiResult = {
      hasError: false,
      retVal: selected,
    };
    return of(res).pipe(
      tap((res) => {
        const userProfile = res.hasError ? null : res.retVal;
        this.user.set(userProfile);
      })
    );
  }

  updateProfile$(userProfile: UserProfile): Observable<ApiResult> {
    const prevUser = this.user();
    this.user.set(userProfile);

    return of({}).pipe(delay(100), catchError((err) => {
      this.user.set(prevUser);
      return throwError(() => new Error('User update failed.'))
    }));
  }

  updateProfileImage$(imageData: AppImageData) {
    return this.getUserProfile$();
  }

  deleteProfileImage$() {
    this.user.update((prev) => {
      if (prev) {
        return {
          ...prev!,
          imageId: undefined
        }
      }
      return prev;
    });
    return of({}).pipe(delay(25));
  }

  deleteMyData$() {
    return of(false);
  }
}
