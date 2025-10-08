import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { ApiResponse } from '@app/models/api-response.model';
import { EventOpportunity } from '@app/models/event/event-opportunity.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private http = inject(HttpClient);
  private cache = new HttpClientCache<EventOpportunity[]>(5, 1);
  private eventCache = new HttpClientCache<EventOpportunity[]>();
  private errorService = inject(ErrorService);
  private apiUrl = `${environment.apiUrl}/api/event-opportunities`;

  getOpportunities$(): Observable<EventOpportunity[]> {
    const key = `opportunities`;
    if (this.cache.existsInCache(key)) {
      const cached = this.cache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchOpportunities$().pipe(
      shareReplay(1)
    );
    this.cache.set(key, obs$);

    return obs$;
  }

  getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    const key = `opportunities:${eventId}`;
    if (this.eventCache.existsInCache(key)) {
      const cached = this.eventCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchEventOpportunities$(eventId).pipe(
      shareReplay(1)
    );
    this.eventCache.set(key, obs$);

    return obs$;
  }

  getOpportunity$(opportunityId: number): Observable<EventOpportunity> {
    return this.http.get<ApiResponse<EventOpportunity>>(`${this.apiUrl}/${opportunityId}`).pipe(
      map((resp) => resp.data),
      debug(RxJsLoggingLevel.DEBUG, "getOpportunity"),
      catchError((e) => this.errorService.handleError(e, 'Error getting opportunity', true))
    );
  }

  private fetchOpportunities$(): Observable<EventOpportunity[]> {
    return this.http.get<ApiResponse<EventOpportunity[]>>(this.apiUrl).pipe(
      map((resp) => resp.data),
      debug(RxJsLoggingLevel.DEBUG, "getOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting opportunities', true))
    );
  }

  private fetchEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.http.get<ApiResponse<EventOpportunity[]>>(`${this.apiUrl}/${eventId}/opportunities`).pipe(
      map((resp) => resp.data),
      debug(RxJsLoggingLevel.DEBUG, "getEventOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event opportunities', true))
    );
  }
}
