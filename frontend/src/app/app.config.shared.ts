import { DatePipe } from '@angular/common';
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
import { provideAppImageLoader } from './core/providers/app-image-loader';

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
  provideAppImageLoader(environment.cloudfareAccountHash),
  provideRouter(
    routes,
    inMemoryScrollingFeature,
    withComponentInputBinding(),
    withRouterConfig({ paramsInheritanceStrategy: 'always' })
  ),
  provideClientHydration(withEventReplay()),
  provideMarkdown()
];

