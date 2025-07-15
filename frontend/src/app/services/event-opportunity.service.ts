import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { EventOpportunity } from '@app/pages/event/models/event-opportunity.model';
import { environment } from '@environments/environment';
import { catchError, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class EventOpportunityService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private apiUrl = `${environment.apiUrl}/api/event-opportunities`;

  private eventOpportunitiesSignal = signal<EventOpportunity[]>([]);
  eventOpportunities = this.eventOpportunitiesSignal.asReadonly();

  getOpportunities$(): Observable<EventOpportunity[]> {
    return this.http.get<EventOpportunity[]>(this.apiUrl).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event opportunities', true))
    );
  }

  getEventOpportunities$(eventId: string): Observable<EventOpportunity[]> {
    return this.http.get<EventOpportunity[]>(`${this.apiUrl}/${eventId}/opportunities`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getOpportunities"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event opportunities', true))
    );
  }

  getOpportunity$(opportunityId: number): Observable<EventOpportunity> {
    return this.http.get<EventOpportunity>(`${this.apiUrl}/${opportunityId}`).pipe(
      debug(RxJsLoggingLevel.DEBUG, "getOpportunity"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event opportunity', true))
    );
  }
}
