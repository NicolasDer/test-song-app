import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideStore } from '@ngrx/store';
import { titleReducer } from './store/reducers/title.reducer';
import { appReducer } from './store/reducers/song.reducer';
import { provideEffects } from '@ngrx/effects';
import { SongEffects } from './store/effects/song.effects';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NgxSkeletonLoaderModule.forRoot({
        animation: 'progress-dark',
        theme: {
          extendsFromRoot: true,
          'background': '#2F3855'
        },
      })
    ),
    provideEffects([SongEffects]),
    provideStore({ title: titleReducer, songs: appReducer }),
    provideAnimations(),
    provideToastr(),
  ],
};
