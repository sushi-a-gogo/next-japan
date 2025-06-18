import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EventData } from '@app/event/models/event-data.model';
import { EventOpportunity } from '@app/event/models/event-opportunity.model';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private organizationInformationSignal = signal<OrganizationInformation | null>(null);
  organizationInformation = this.organizationInformationSignal.asReadonly();

  private apiUri = `${environment.apiUri}`;

  getOrganizationInfo$(): Observable<OrganizationInformation> {
    return this.http.get<{ data: OrganizationInformation }>(`${this.apiUri}/organization`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getOrganization'),
      map((resp) => {
        const org = resp.data as OrganizationInformation;
        this.organizationInformationSignal.set(org);
        return org;
      }),
      catchError((e) => {
        this.organizationInformationSignal.set(null);
        return this.errorService.handleError(e, 'Error fetching organization information.', true);
      }));
  }

  getEvents$(): Observable<EventData[]> {
    return this.http.get<{ events: EventData[] }>(`${this.apiUri}/events`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getEvents'),
      map((resp) => resp.events as EventData[]),
      catchError((e) => this.errorService.handleError(e, 'Error fetching events.'))
    );
  }

  getNextOpportunities$(): Observable<EventOpportunity[]> {
    return this.http.get<{ opportunities: EventOpportunity[] }>(`${this.apiUri}/opportunities`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getNextOpportunities'),
      map((resp) => resp.opportunities),
      catchError((e) => this.errorService.handleError(e, 'Error fetching opportunities.'))
    );
  }
}
