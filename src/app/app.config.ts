import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { API_URL } from 'util-environment';
import { routes } from './app.routes';
import {
  delayInterceptorInterceptor,
  PopulateStore,
} from './shared/data-access';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([delayInterceptorInterceptor])
    ),
    provideTranslateService({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
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
