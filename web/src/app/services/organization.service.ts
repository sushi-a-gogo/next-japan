import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EventData } from '@app/event/models/event-data.model';
import { OrganizationEvents } from '@app/models/organization-events.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
import { ApiResult } from 'src/app/models/api-result.model';
import { DUMMY_EVENTS } from 'src/data/dummy-events';
import { DUMMY_OPPORTUNITIES } from 'src/data/dummy-opps';
import { Organization } from 'src/data/organization-data';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);

  private organizationInformationSignal = signal<OrganizationInformation | null>(Organization);
  organizationInformation = this.organizationInformationSignal.asReadonly();

  getOrganizationInfo$() {
    const org: OrganizationInformation = Organization;
    this.organizationInformationSignal.set(org);

    const res: ApiResult = {
      hasError: false,
      retVal: org,
    };
    return of(res);
  }

  getEvents$() {
    return this.http.get<{ events: EventData[] }>(`http://localhost:3000/all-events`).pipe(
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
