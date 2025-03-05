import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { routes } from './app.routes';
import { API_URL } from 'util-environment';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  delayInterceptorInterceptor,
  PopulateStore,
} from './shared/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([delayInterceptorInterceptor])
    ),
    provideAppInitializer(() => {
      inject(PopulateStore).fetchData();
    }),
    {
      provide: API_URL,
      useValue: 'http://localhost:3000',
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES',
    },
  ],
};
