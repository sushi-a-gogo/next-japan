import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiUrl = `${environment.apiUrl}/api/like-event`;;
  private errorService = inject(ErrorService);

  constructor(private http: HttpClient) { }

  toggleLike$(userId: string, eventId: string, liked: boolean): Observable<ApiResponse<{ likeCount: number }>> {
    return this.http
      .post<ApiResponse<{ likeCount: number }>>(this.apiUrl, { userId, eventId, liked })
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'toggleLike'),
        catchError((e) => this.errorService.handleError(e, 'Error liking event.'))
      );
  }

  getLikeCount$(eventId: string): Observable<ApiResponse<{ likeCount: number }>> {
    return this.http
      .get<ApiResponse<{ likeCount: number }>>(`${this.apiUrl}/count/${eventId}`)
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'getLikeCount'),
        catchError((e) => this.errorService.handleError(e, 'Error getting like count.'))
      );
  }

  isLikedByUser$(userId: string | null, eventId: string): Observable<ApiResponse<{ liked: boolean }>> {
    if (!userId) {
      return throwError(() => new Error('Please sign in to check likes'));
    }
    return this.http
      .get<ApiResponse<{ liked: boolean }>>(`${this.apiUrl}/${eventId}/user/${userId}`)
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'isLikedByUser'),
        catchError((error) => throwError(() => new Error('Failed to check like: ' + error.message)))
      );
  }
}
