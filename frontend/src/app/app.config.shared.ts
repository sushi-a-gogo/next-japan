import { DatePipe, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { environment } from '@environments/environment';
import Material from '@primeuix/themes/material';
import { provideMarkdown } from 'ngx-markdown';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const sharedProviders = [
  DatePipe,
  provideAnimations(), // <- deprecated but needed by NgxSpinner :(
  MessageService,
  providePrimeNG({
    theme: {
      preset: Material
    }
  }),
  provideHttpClient(
    withFetch(),
    withInterceptors([authInterceptor])
  ),
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      const { src, width } = config;

      // 1. Handle external/Azure images (Bypass Cloudflare)
      if (src.startsWith('http') && !src.includes('imagedelivery.net')) {
        return src;
      }

      const accountHash = environment.cloudfareAccountHash;

      // 2. Extract the Image ID
      // ngSrc="my-image-id", so this is simple.
      const imageId = src;

      // 3. Build the Optimized URL
      // 'public' is the base variant, then layer flexible overrides
      const params = [
        width ? `w=${width}` : '',
        width ? `h=${Math.round(width / 1.75)}` : '',
        'format=auto',
        'quality=85'
      ].filter(Boolean).join('&');

      return `https://imagedelivery.net/${accountHash}/${imageId}/public?${params}`;
    }
  },
  provideRouter(
    routes,
    inMemoryScrollingFeature,
    withComponentInputBinding(),
    withRouterConfig({ paramsInheritanceStrategy: 'always' })
  ),
  provideClientHydration(withEventReplay()),
  provideMarkdown()
];
