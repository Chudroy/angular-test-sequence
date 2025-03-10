import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
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
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import {
  API_URL,
  environment,
  DEFAULT_LOCALE,
  LUXON_DATE_FORMATS,
} from 'util-environment';
import { routes } from './app.routes';
import { delayInterceptor, PopulateStore } from './shared/data-access';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([delayInterceptor])),
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
      useValue: environment.apiUrl,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: DEFAULT_LOCALE,
    },
  ],
};
