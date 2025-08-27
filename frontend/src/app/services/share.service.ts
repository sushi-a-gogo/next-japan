import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '@app/models/api-response.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private apiUrl = `${environment.apiUrl}/api/share-event`;;
  private errorService = inject(ErrorService);

  constructor(private http: HttpClient) { }

  logShare$(userId: string, eventId: string): Observable<ApiResponse<{ shareCount: number }>> {
    return this.http
      .post<ApiResponse<{ shareCount: number }>>(this.apiUrl, { userId, eventId })
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'logShare'),
        catchError((e) => this.errorService.handleError(e, 'Error logging share.'))
      );
  }

  getShareCount$(eventId: string): Observable<ApiResponse<{ shareCount: number }>> {
    return this.http
      .get<ApiResponse<{ shareCount: number }>>(`${this.apiUrl}/count/${eventId}`)
      .pipe(
        debug(RxJsLoggingLevel.DEBUG, 'logShare'),
        catchError((e) => this.errorService.handleError(e, 'Error getting share count.'))
      );
  }
}
