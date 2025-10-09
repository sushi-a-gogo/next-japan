import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private apiUrl = `api/share-event`;;
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);

  logShare$(userId: string, eventId: string): Observable<ApiResponse<{ shareCount: number }>> {
    return this.apiService
      .post<{ shareCount: number }>(this.apiUrl, { userId, eventId })
      .pipe(
        catchError((e) => this.errorService.handleError(e, 'Error logging share.'))
      );
  }

  getShareCount$(eventId: string): Observable<ApiResponse<{ shareCount: number }>> {
    return this.apiService
      .get<{ shareCount: number }>(`${this.apiUrl}/count/${eventId}`)
      .pipe(
        catchError((e) => this.errorService.handleError(e, 'Error getting share count.'))
      );
  }
}
