import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/cache/http-client-cache';
import { MapLocation } from '@app/models/map-location.model';
import { catchError, map, Observable, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);
  private apiUrl = 'api/event-locations';
  private eventCache = new HttpClientCache<MapLocation[]>();

  getLocations$(): Observable<MapLocation[]> {
    return this.apiService.get<MapLocation[]>(this.apiUrl).pipe(
      map((resp) => resp.data || []),
      catchError((e) => this.errorService.handleError(e, 'Error getting locations', true))
    );
  }

  getEventLocations$(eventId: string): Observable<MapLocation[]> {
    const key = `locations:${eventId}`;
    if (this.eventCache.existsInCache(key)) {
      const cached = this.eventCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchEventLocations$(eventId).pipe(
      shareReplay(1)
    );
    this.eventCache.set(key, obs$);

    return obs$;
  }

  getLocation$(locationId: string): Observable<MapLocation | null> {
    return this.apiService.get<MapLocation>(`${this.apiUrl}/${locationId}`).pipe(
      map((resp) => resp.data),
      catchError((e) => this.errorService.handleError(e, 'Error getting location', true))
    );
  }

  private fetchEventLocations$(eventId: string): Observable<MapLocation[]> {
    return this.apiService.get<MapLocation[]>(`${this.apiUrl}/${eventId}/locations`).pipe(
      map((resp) => resp.data || []),
      catchError((e) => this.errorService.handleError(e, 'Error getting event locations', true))
    );
  }
}
