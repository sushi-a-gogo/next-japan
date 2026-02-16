// api.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { ApiResponse } from '@app/core/models/api-response.model';
import { environment } from '@environments/environment';
import { Observable, tap } from 'rxjs';

type ApiOptions = {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private buildUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  get<T>(endpoint: string, options: ApiOptions = {}): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(endpoint), options)
      .pipe(tap((res) => this.debugLog(endpoint, res)));
  }

  post<T>(endpoint: string, body: unknown, options: ApiOptions = {}): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(endpoint), body, options)
      .pipe(tap((res) => this.debugLog(endpoint, res)));
  }

  put<T>(endpoint: string, body: unknown, options: ApiOptions = {}): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(this.buildUrl(endpoint), body, options)
      .pipe(tap((res) => this.debugLog(endpoint, res)));
  }

  delete<T>(endpoint: string, options: ApiOptions = {}): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(this.buildUrl(endpoint), options)
      .pipe(tap((res) => this.debugLog(endpoint, res)));
  }

  // Dev-only
  private debugLog<T>(endpoint: string, res: ApiResponse<T>): void {
    if (isDevMode()) {
      console.groupCollapsed(`[ApiService] ${endpoint}`);
      console.log(res);
      console.groupEnd();
    }
  }
}
