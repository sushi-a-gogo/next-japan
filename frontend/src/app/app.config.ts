import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { routes } from './app.routes';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withFetch()),
    {
      provide: IMAGE_LOADER, useValue: (config: ImageLoaderConfig) => {
        const { src, width } = config;
        const baseUrl = environment.cloudfareUrl; // e.g., https://imagedelivery.net
        // Skip OpenAI or non-Cloudflare URLs
        if (src.includes('oaidalleapiprodscus.blob.core.windows.net') || !src.includes('/public') || !src.includes(baseUrl)) {
          return src; // Return original URL unchanged
        }

        // Split src and remove /public and query params
        const parts = src.split('/public')[0].split('/').filter(p => p); // Remove empty parts
        const cloudflareImageId = parts.pop(); // Last segment is cloudflareImageId
        const cloudfareAccountHash = parts.pop(); // Second-to-last is account hash
        const dimQuery = width ? `w=${width}&h=${width / 1.75}` : '';

        // Construct the full URL
        return `${baseUrl}/${cloudfareAccountHash}/${cloudflareImageId}/public?${dimQuery}&format=webp&quality=100`;
      }
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      inMemoryScrollingFeature,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ), provideClientHydration(withEventReplay())
  ]
};
