import { inject, Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class VisitorService {
  private apiUrl = `api/visitors`;;
  private apiService = inject(ApiService);

  logVisit$(path: string, referrer: string | null) {
    return this.apiService
      .post(this.apiUrl, { path, referrer })
      .pipe(
        catchError((e) => {
          // Silent fail — we don't want to break the user experience
          console.warn('Visit tracking failed:', e);
          return EMPTY;
        })
      );
  }
}
