import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { OrganizationInformation } from '@app/models/organization-information.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);

  private cache = new HttpClientCache<OrganizationInformation>(60, 1);
  private apiUri = `${environment.apiUrl}/api/organization`;

  getOrganizationInfo$(): Observable<OrganizationInformation> {
    const key = `organization`;
    if (this.cache.existsInCache(key)) {
      const cached = this.cache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchOrganizationData$().pipe(
      shareReplay(1)
    );

    this.cache.set(key, obs$);
    return obs$;
  }


  private fetchOrganizationData$() {
    return this.http.get<{ data: OrganizationInformation }>(`${this.apiUri}/info`).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'getOrganization'),
      map((resp) => {
        return resp.data as OrganizationInformation;
      }),
      catchError((e) => {
        return this.errorService.handleError(e, 'Error fetching organization information.', true);
      }));
  }
}
