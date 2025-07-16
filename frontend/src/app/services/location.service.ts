import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MapLocation } from '@app/models/map-location.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private apiUrl = `${environment.apiUrl}/api/event-locations`;

  getLocations$(): Observable<MapLocation[]> {
    return this.http.get<{ locations: MapLocation[] }>(this.apiUrl).pipe(
      map((resp) => resp.locations),
      debug(RxJsLoggingLevel.DEBUG, "getLocations"),
      catchError((e) => this.errorService.handleError(e, 'Error getting locations', true))
    );
  }

  getEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.http.get<{ eventLocations: MapLocation[] }>(`${this.apiUrl}/${eventId}/locations`).pipe(
      map((resp) => resp.eventLocations),
      debug(RxJsLoggingLevel.DEBUG, "getEventLocations"),
      catchError((e) => this.errorService.handleError(e, 'Error getting event locations', true))
    );
  }

  getLocation$(locationId: string): Observable<MapLocation> {
    return this.http.get<{ location: MapLocation }>(`${this.apiUrl}/${locationId}`).pipe(
      map((resp) => resp.location),
      debug(RxJsLoggingLevel.DEBUG, "getLocation"),
      catchError((e) => this.errorService.handleError(e, 'Error getting location', true))
    );
  }
}
