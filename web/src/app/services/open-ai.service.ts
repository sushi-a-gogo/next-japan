import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private uri = `${environment.apiUri}/api`;

  constructor(private http: HttpClient) { }

  generateContent(params: any, text: string): Observable<{ text: string; imageUrl: string }> {
    return this.http.post<{ text: string; imageUrl: string }>(`${this.uri}/generate-content`, {
      promptParams: params,
      customText: text,
    });
  }

  generateImage(prompt: string) {
    return this.http.post<{ imageUrl: string }>(`${environment.apiUri}/generate-image`, { prompt });
  }
}
