import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppImageData } from '@app/models/app-image-data.model';
import { debug, RxJsLoggingLevel } from '@app/operators/debug';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private uri = `${environment.apiUri}/api`;

  constructor(private http: HttpClient) { }

  generateContent(params: any, text: string): Observable<{ text: string; image: AppImageData }> {
    return this.http.post<{ text: string; image: AppImageData }>(`${this.uri}/generate-content`, {
      promptParams: params,
      customText: text,
    }).pipe(
      debug(RxJsLoggingLevel.DEBUG, "openAI:generateContent")
    );
  }
}
