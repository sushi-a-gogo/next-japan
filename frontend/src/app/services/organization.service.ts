import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  private apiUri = `${environment.apiUrl}/api/organization`;

  getOrganizationInfo$(): Observable<OrganizationInformation> {
    return this.http.get<{ data: OrganizationInformation }>(`${this.apiUri}/info`).pipe(
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
}
