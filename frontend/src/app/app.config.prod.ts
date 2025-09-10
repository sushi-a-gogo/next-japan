import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { sharedProviders } from './app.config.shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    ...sharedProviders
  ]
};
