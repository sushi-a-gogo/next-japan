import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '@environments/environment';

// Define custom SERVER_REQUEST token
export const SERVER_REQUEST = new InjectionToken<{ url: string; headers: { [key: string]: string | string[] } }>('SERVER_REQUEST');

@Injectable({
  providedIn: 'root'
})
export class CanonicalService {
  private document: Document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  constructor(
    @Optional() @Inject(SERVER_REQUEST) private serverRequest?: { url: string; headers: { [key: string]: string | string[] } }
  ) { }

  setCanonicalURL(canonicalPath: string = '/') {
    // Remove existing canonical tag
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Create new canonical link
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');

    let baseUrl: string;
    if (isPlatformServer(this.platformId) && this.serverRequest) {
      // Server-side: Use serverRequest headers
      const protocol = this.serverRequest.headers['x-forwarded-proto'] || 'https';
      const host = this.serverRequest.headers['host'] || environment.host;
      baseUrl = `${protocol}://${host}`;
    } else if (isPlatformServer(this.platformId)) {
      // Fallback if serverRequest is unavailable
      baseUrl = environment.baseUrl;
    } else if (isPlatformBrowser(this.platformId)) {
      // Client-side: Use window.location
      baseUrl = `${this.document.location.protocol}//${this.document.location.host}`;
    } else {
      // Fallback
      baseUrl = environment.baseUrl;
    }

    // Normalize canonicalPath and combine with baseUrl
    const normalizedPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${baseUrl}${normalizedPath}`;
    link.setAttribute('href', canonicalUrl);

    // Append to <head>
    this.document.head.appendChild(link);
  }
}
