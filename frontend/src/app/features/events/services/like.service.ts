import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/core/models/api-response.model';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = `api/like-event`;;
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);

  toggleLike$(userId: string, eventId: string, liked: boolean): Observable<ApiResponse<{ likeCount: number }>> {
    return this.apiService
      .post<{ likeCount: number }>(this.apiUrl, { userId, eventId, liked })
      .pipe(
        catchError((e) => this.errorService.handleError(e, 'Error liking event.'))
      );
  }

  getLikeCount$(eventId: string): Observable<ApiResponse<{ likeCount: number }>> {
    return this.apiService
      .get<{ likeCount: number }>(`${this.apiUrl}/count/${eventId}`)
      .pipe(
        catchError((e) => this.errorService.handleError(e, 'Error getting like count.'))
      );
  }

  isLikedByUser$(userId: string | null, eventId: string): Observable<ApiResponse<{ likedByUser: boolean }>> {
    if (!userId) {
      return throwError(() => new Error('Please sign in to check likes'));
    }
    return this.apiService
      .get<{ likedByUser: boolean }>(`${this.apiUrl}/${eventId}/user/${userId}`)
      .pipe(
        catchError((error) => throwError(() => new Error('Failed to check like: ' + error.message)))
      );
  }
}
