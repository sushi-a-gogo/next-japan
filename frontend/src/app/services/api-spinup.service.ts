import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiSpinUpService {
  private http = inject(HttpClient);

  private spinUpSignal = signal<boolean>(false);
  apiSpinUp = this.spinUpSignal.asReadonly();

  private apiUri = `${environment.apiUrl}/api/ping`;

  ping$() {
    return this.http.get(`${this.apiUri}`, { observe: 'response' }).pipe(
      debug(RxJsLoggingLevel.DEBUG, 'ping'),
    );
  }
}
