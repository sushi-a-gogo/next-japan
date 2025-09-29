import { DatePipe, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { environment } from '@environments/environment';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const sharedProviders = [
  DatePipe,
  provideAnimations(),
  provideHttpClient(
    withFetch(),
    withInterceptors([authInterceptor])
  ),
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      const { src, width } = config;
      const baseUrl = environment.cloudfareUrl;
      if (src.includes('oaidalleapiprodscus.blob.core.windows.net') || !src.includes('/public') || !src.includes(baseUrl)) {
        return src;
      }
      const parts = src.split('/public')[0].split('/').filter(p => p);
      const cloudflareImageId = parts.pop();
      const cloudfareAccountHash = parts.pop();
      const dimQuery = width ? `w=${width}&h=${width / 1.75}` : '';
      return `${baseUrl}/${cloudfareAccountHash}/${cloudflareImageId}/public?${dimQuery}&format=webp&quality=100`;
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
