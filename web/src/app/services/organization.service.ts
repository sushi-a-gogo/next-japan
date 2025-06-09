import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EventData } from '@app/event/models/event-data.model';
import { OrganizationEvents } from '@app/models/organization-events.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { ApiResult } from 'src/app/models/api-result.model';
import { DUMMY_EVENTS } from 'src/data/dummy-events';
import { DUMMY_OPPORTUNITIES } from 'src/data/dummy-opps';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);

  private organizationInformationSignal = signal<OrganizationInformation | null>(null);
  organizationInformation = this.organizationInformationSignal.asReadonly();

  getOrganizationInfo$() {
    return this.http.get<ApiResult>(`http://localhost:3000/organization`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getOrganization'),
      map((resp) => {
        const org = resp.data;
        this.organizationInformationSignal.set(org);
        const result: ApiResult =
        {
          hasError: false,
          retVal: resp.data,
        };
        return result;
      }),
      catchError((e) => {
        return throwError(() => new Error('Error fetching organization information.'));
      }),
    );
  }

  getEvents$() {
    return this.http.get<{ events: EventData[] }>(`http://localhost:3000/events`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getEvents'),
      map((resp) => ({ events: resp.events, upcomingOpportunities: DUMMY_OPPORTUNITIES })),
      map((result) => ({
        hasError: false,
        retVal: result,
      })),
      catchError((e) => {
        return throwError(() => new Error('Error fetching events.'));
      }),
    );
  }

  getOrganizationEvents$() {
    const result: OrganizationEvents = {
      events: DUMMY_EVENTS,
      upcomingOpportunities: DUMMY_OPPORTUNITIES,
    };

    const res: ApiResult = {
      hasError: false,
      retVal: result,
    };
    return of(res).pipe(delay(100));
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
