import { inject, Injectable } from '@angular/core';
import { HttpClientCache } from '@app/core/cache/http-client-cache';
import { ApiService } from '@app/core/services/api.service';
import { ErrorService } from '@app/core/services/error.service';
import { EventLocation } from '@app/features/events/models/event-location.model';
import { catchError, map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class EventLocationService {
  private apiService = inject(ApiService);
  private errorService = inject(ErrorService);
  private apiUrl = 'api/event-locations';
  private eventCache = new HttpClientCache<EventLocation | null>();

  getEventLocation$(eventId: string): Observable<EventLocation | null> {
    const key = `location:${eventId}`;
    if (this.eventCache.existsInCache(key)) {
      const cached = this.eventCache.get(key);
      if (cached) {
        return cached;
      }
    }

    const obs$ = this.fetchEventLocation$(eventId).pipe(
      shareReplay(1)
    );
    this.eventCache.set(key, obs$);

    return obs$;
  }

  private fetchEventLocation$(eventId: string): Observable<EventLocation | null> {
    return this.apiService.get<EventLocation>(`${this.apiUrl}/${eventId}/location`).pipe(
      map((resp) => resp.data),
      catchError((e) => this.errorService.handleError(e, 'Error getting event location', true))
    );
  }
}
