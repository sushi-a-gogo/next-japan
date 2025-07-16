import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { environment } from '@environments/environment';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private http = inject(HttpClient);
  private cache = new HttpClientCache<EventOpportunity[]>(3);
  private errorService = inject(ErrorService);
  private apiUrl = `${environment.apiUrl}/api/event-opportunities`;

  getOpportunities$(): Observable<EventOpportunity[]> {
    if (this.cache.existsInCache('opportunities')) {
      const cached = this.cache.get('opportunities');
      if (cached) {
        console.log("*** Opportunities retrieved from cache.");
        return cached;
      }
    }

    const obs$ = this.fetchOpportunities$().pipe(
      shareReplay(1)
    );
    this.cache.set('opportunities', obs$);

    return obs$;
  }

  getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    if (this.cache.existsInCache(eventId)) {
      const cached = this.cache.get(eventId);
      if (cached) {
        console.log("*** Event Opportunities retrieved from cache.");
        return cached;
      }
    }

    const obs$ = this.fetchEventOpportunities$(eventId).pipe(
      shareReplay(1)
    );
    this.cache.set(eventId, obs$);

    return obs$;
  }

  getOpportunity$(opportunityId: number): Observable<EventOpportunity> {
    return this.http.get<{ opportunity: EventOpportunity }>(`${this.apiUrl}/${opportunityId}`).pipe(
      map((resp) => resp.opportunity),
      debug(RxJsLoggingLevel.DEBUG, "getOpportunity"),
      catchError((e) => this.errorService.handleError(e, 'Error getting opportunity', true))
    );
  }

  private fetchOpportunities$(): Observable<EventOpportunity[]> {
    return this.http.get<{ opportunities: EventOpportunity[] }>(this.apiUrl).pipe(
      map((resp) => resp.opportunities),
      debug(RxJsLoggingLevel.DEBUG, "getOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting opportunities', true))
    );
  }

  private fetchEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.http.get<{ eventOpportunities: EventOpportunity[] }>(`${this.apiUrl}/${eventId}/opportunities`).pipe(
      map((resp) => resp.eventOpportunities),
      debug(RxJsLoggingLevel.DEBUG, "getEventOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event opportunities', true))
    );
  }
}
